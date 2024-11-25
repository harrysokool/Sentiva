# import json
# import boto3

# dynamoDB = boto3.resource('dynamodb')

# put name of table that you want to refer to 
# table = dynamoDB.Table('EmotionScore')

def insertElementToTable(analysisResult):
    index = 0
    for output in analysisResult:
        print("\ninput #:" + str(index))
        textField = output['text']
        emotionField = output['sentiment'][0]
        scoreField = output['sentiment'][1]
        print("\nText: " + textField)
        print("\nEmotion: " + emotionField)
        print("\nScore: " + str(scoreField))
        index += 1
        

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

insertElementToTable(testList)
        
    



# def lambda_handler(event, context):
#     ## TODO: will implement insert, add, remove, etc. operations for dynamo
#     return
    