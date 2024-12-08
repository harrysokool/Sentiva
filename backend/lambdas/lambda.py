import json
import boto3
from decimal import Decimal
import urllib.request
import os

dynamoDB = boto3.resource('dynamodb')
# put name of table that you want to refer to 
table = dynamoDB.Table('EmotionScore')

MAX_TEXTS = 100
MAX_SIZE = 5000000 #5 MB

def insertElementToTable(dataEntry, analysisResult):
    index = 0
    for output in analysisResult:
        textField = output['text']
        emotionField = output['sentiment'][0]
        scoreField = Decimal(str(output['sentiment'][1])) # convert to string first for rounding
        response = table.put_item(
            Item={
                'dataName': dataEntry,
                'index': index,
                'emotion': emotionField,
                'score': scoreField,
                'text': textField
            }
        )
        index += 1

def insertPictureElementToTable(dataEntry, description ,analysisResult):
    emotionField = analysisResult[0]
    scoreField = Decimal(str(analysisResult[1])) # convert to string first for rounding
    
    response = table.put_item(
        Item={
            'dataName': dataEntry,
            'index': Decimal(0),
            'emotion': emotionField,
            'score': scoreField,
            'text': description
            
        }
    )

def detect_labels(photo, bucket):
    try:
        session = boto3.Session(region_name='ca-central-1')
        client = session.client('rekognition')
        CONFIDENCE_THRESHOLD = 70
        print({'S3Object':{'Bucket':bucket,'Name':photo}})
        print('\n')
        response = client.detect_labels(Image={'S3Object':{'Bucket':bucket,'Name':photo}},
        MaxLabels=20,
        MinConfidence=CONFIDENCE_THRESHOLD
        )

        labels = []

        for label in response['Labels']:
            for instance in label['Instances']:
                labels.append(label['Name'])

        print(labels)       
        print("\n")          

        return labels
    except Exception as e:
        print(e)
        print("\n")
    

## End of New stuff

def lambda_handler(event, context):
# New lambda handler for both text and image, update: 20241127-0227, Sunny
    s3 = boto3.client('s3')
    """
    try:
        response = urllib.request.urlopen("https://www.google.com")
        print("Connection works\n")
    except Exception as e:
        print("Failed: \n")
        print(e)
        print("\n")
    return
    """
    def sentiment_analysis_text(json_content):
        texts = json_content['texts']
        
        result = []
        runtime = boto3.client('sagemaker-runtime')


        for t in texts:
            if "content" in t.keys():
                model_data = {
                    "inputs": t["content"]
                }
                # Invoke the endpoint
                response = runtime.invoke_endpoint(
                    EndpointName='prj-text-endpoint',
                    ContentType='application/json',
                    Body=json.dumps(model_data)
                )
                prediction = json.loads(response['Body'].read().decode())
                max_tup = (prediction[0]['label'], prediction[0]['score'])
                result.append({"text": t['content'], "sentiment": max_tup})
        print(result)
        return result

    def create_presigned_url(bucket_name, file_key, expiration=3600):

        try:
            response = s3.generate_presigned_url('get_object',
                                                        Params={'Bucket': bucket_name,
                                                                'Key': file_key},
                                                        ExpiresIn=expiration)
        except ClientError as e:
            return None
        
        return response
    
    def sentiment_analysis_image(url, labels):
        runtime = boto3.client('sagemaker-runtime')

        model_data = {
            "inputs": url,
            "parameters": {"candidate_labels": labels}
        }
        print(model_data)
        response = runtime.invoke_endpoint(
                    EndpointName='prj-img-endpoint3',
                    ContentType='application/json',
                    Body=json.dumps(model_data)
                )
        
        prediction = json.loads(response['Body'].read().decode())
        max_tup = (prediction[0]['label'], prediction[0]['score'])
        print(max_tup)
        print(prediction)
        return max_tup

    def sentiment_analysis_image_labels(url):
        runtime = boto3.client('sagemaker-runtime')

        model_data = {
            "inputs": url,
            "parameters": {"prompt": "A picture of"}
        }

        print(model_data)
        response = runtime.invoke_endpoint(
                    EndpointName='prj-img-label3',
                    ContentType='application/json',
                    Body=json.dumps(model_data)
                )
        
        prediction = json.loads(response['Body'].read().decode())
        label = prediction[0]['generated_text']
        print(label)
        print(prediction)
        return label
    
    # Get bucket name and file key from the S3 event
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    file_key = event['Records'][0]['s3']['object']['key']
    
    dbKey = os.path.splitext(os.path.basename(file_key))[0]

    metadata = s3.head_object(Bucket=bucket_name, Key=file_key)
    file_size = metadata['ContentLength']

    if file_size > MAX_SIZE:
        return {
            "statusCode": 400,
            "body": "File size is too large"
        }

    if file_key.lower().endswith('.json'):
        # Read the content of the file

        # Get the file object from S3
        file_obj = s3.get_object(Bucket=bucket_name, Key=file_key)

        file_content = file_obj['Body'].read().decode('utf-8')
        
        # Parse JSON content
        json_content = json.loads(file_content)

        if len(json_content['texts']) > MAX_TEXTS:
            
            return {
                "statusCode": 400,
                "body": "JSON content length is too large"
            }

        result = sentiment_analysis_text(json_content)
        

        ## new line to insert to dynamo
        # insertElementToTable("testDataSet2", result)
        insertElementToTable(dbKey, result)
        ## end of new stuff

        return {
            "statusCode": 200,
            "body": str(result)
        }
    elif file_key.lower().endswith('.png') or file_key.lower().endswith('.jpg') or file_key.lower().endswith('.jpeg'):
        #print(labels)
        #print("\n")

        # get image link, as model accept image in url only
        url = create_presigned_url(bucket_name, file_key)

        labels = ['joy','anger', 'love', 'sadness', 'fear', 'surprise']

        result = sentiment_analysis_image(url,labels)

        result_labels = sentiment_analysis_image_labels(url)
        # insertPictureElementToTable("testImage1", result)
        insertPictureElementToTable(dbKey, result_labels, result)

        return {
            "statusCode": 200,
            "body": str(result)
        }



    return {
        "statusCode": 200,
        "body": str(file_key)
    }