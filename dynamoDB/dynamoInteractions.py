import json
import boto3
from decimal import Decimal 



dynamoDB = boto3.resource('dynamodb')

# put name of table that you want to refer to 
table = dynamoDB.Table('EmotionScore')

def insertElementToTable(dataEntry, analysisResult):
    index = 0
    for output in analysisResult:
        print("\nNew text input")
        textField = output['text']
        emotionField = output['sentiment'][0]
        # scoreField = output['sentiment'][1]
        scoreField = Decimal(str(output['sentiment'][1]))
        reponse = table.put_item(
            Item={
                'dataName': dataEntry,
                'index': index,
                'emotion': emotionField,
                'score': scoreField,
                'text': textField
            }
        )
        index += 1
        
        print("\nText: " + textField)
        print("\nEmotion: " + emotionField)
        print("\nScore: " + str(scoreField))
        

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
    