import json
import boto3
from decimal import Decimal 



dynamoDB = boto3.resource('dynamodb')

# put name of table that you want to refer to 
table = dynamoDB.Table('EmotionScore')


# Given partition key as input, will count how many times of each emotion is contained from that one entry
def getTotalCounts(partitionKey):
    
    #returns all elements with the given partition key as a dictionary 
    resultDict = table.query(KeyConditionExpression=Key('dataName').eq(partitionKey)) 
    
    listOfResults = resultDict['Items']
    
    joyCount, angerCount, loveCount, sadnessCount, fearCount, surpriseCount = 0
    
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
        
    print("\nTotal counts of joy: " + joyCount)
    print("\nTotal counts of anger: " + angerCount)
    print("\nTotal counts of love: " + loveCount)
    print("\nTotal counts of sadness: " + sadnessCount)
    print("\nTotal counts of fear: " + fearCount)
    print("\nTotal counts of surprise: " + surpriseCount)
    
        

testList = [ 
    {
        'text': '{"Im so sad"}', 
        'sentiment': ('sadness', 0.9987390637397766)
    },
    {
        'text': '{"Sorta happy"}', 
        'sentiment': ('happy', 0.6347849067397766)
    }
]

# insertElementToTable(testList)
        
    



def lambda_handler(event, context):
    ## TODO: will implement insert, add, remove, etc. operations for dynamo
    return
    