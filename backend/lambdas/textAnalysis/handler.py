import json
import text_analysis

# need to change the model and also make it relate to our topic (emotion analysis)
def lambda_handler(event, context):
    result = text_analysis.sentiment_analysis(event['text'])
    
    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }