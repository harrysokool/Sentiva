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
        
        outputString = "Text: " + text + " ### " + "Emotion: " + emotion + " ### " + "Score: " + str(score)
        outputList.append(outputString)
        print("\n" + outputString)
    
    print("\n"+ outputList)
    return outputList

        

    
        

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
    