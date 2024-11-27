import json
import boto3
from decimal import Decimal
from boto3.dynamodb.conditions import Key

dynamoDB = boto3.resource('dynamodb')

# put name of table that you want to refer to 
table = dynamoDB.Table('EmotionScore')

# Given partition key as input, will count how many times of each emotion is contained from that one entry
def getTotalCounts(partitionKey):
    
    #returns all elements with the given partition key as a dictionary 
    resultDict = table.query(KeyConditionExpression=Key('dataName').eq(partitionKey)) 
    
    listOfResults = resultDict['Items']
    
    joyCount = 0
    angerCount = 0
    loveCount = 0
    sadnessCount = 0
    fearCount = 0
    surpriseCount = 0
    
    for element in listOfResults:
        emotion = element['emotion']
        if emotion == "joy":
            joyCount += 1
        elif emotion == "anger":
            angerCount += 1
        elif emotion == "love":
            loveCount += 1
        elif emotion == "sadness":
            sadnessCount += 1
        elif emotion == "fear":
            fearCount += 1
        elif emotion == "surprise":
            surpriseCount += 1
        
    print("\nTotal counts of joy: " + str(joyCount))
    print("\nTotal counts of anger: " + str(angerCount))
    print("\nTotal counts of love: " + str(loveCount))
    print("\nTotal counts of sadness: " + str(sadnessCount))
    print("\nTotal counts of fear: " + str(fearCount))
    print("\nTotal counts of surprise: " + str(surpriseCount))

def lambda_handler(event, context):
    # TODO implement

    getTotalCounts("testDataSet2")
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
