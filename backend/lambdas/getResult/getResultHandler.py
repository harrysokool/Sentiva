import json
import boto3
from decimal import Decimal 
from boto3.dynamodb.conditions import Key

dynamoDB = boto3.resource('dynamodb')

# put name of table that you want to refer to 
table = dynamoDB.Table('EmotionScore')

# Given partition key as input, will count how many times of each emotion is contained from that one entry
def getResult(partitionKey):
    
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

    partitionKey = event["queryStringParameters"]["partitionKey"]
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
    results = getResult(partitionKey)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        'body': json.dumps(results)
    }