import json
import boto3
from decimal import Decimal 
from boto3.dynamodb.conditions import Key




# Given partition key as input, will count how many times of each emotion is contained from that one entry
def getResult(partitionKey, table):
    
    #returns all elements with the given partition key as a dictionary 
    resultDict = table.query(KeyConditionExpression=Key('dataName').eq(partitionKey)) 
    
    listOfResults = resultDict['Items']
    
    outputList = []
    
    
    for element in listOfResults:
        emotion = element['emotion']
        text = element['text']
        score = element['score']
        
        # outputString = "Text: " + text + " ### " + "Emotion: " + emotion + " ### " + "Score: " + str(score)
        resultTuple = (text, emotion, str(score))
        outputList.append(resultTuple)
        # outputList.append(outputString)
        # print("\n" + outputString)
        print(resultTuple)
    
    print(outputList)
    return outputList

def lambda_handler(event, context):
    # TODO implement
    
    # partitionKey = event.get('partitionKey')
    # results = getResult(partitionKey) # change this value to key you want to call
    
    # partitionKey = event.get('queryStringParameters', {}).get('partitionKey')
    # results = getResult(partitionKey) # change this value to key you want to call

    # Comment out the two above lines and uncomment the ones below for testing 
    # results = getResult("testDataSet2") # change this value to key you want to call

    # return {
    #     'statusCode': 200,
    #     'body': json.dumps(results)
    # }
    try:
        dynamoDB = boto3.resource('dynamodb')

        # put name of table that you want to refer to 
        table = dynamoDB.Table('EmotionScore')
        partitionKey = event.get("queryStringParameters", {}).get("partitionKey")
        print(f"Received partitionKey: {partitionKey}, Type: {type(partitionKey)}")
    
        if not partitionKey:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                'body': json.dumps({'error': 'partitionKey is required'})
            }
    
        # Call your function to fetch data from DynamoDB
        results = getResult(partitionKey, table)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps(results)
        }
    except Exception:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps({'error': 'Internal Server Error'})
        }
    

