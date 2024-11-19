import json
import boto3

dynamoDB = boto3.resource('dynamodb')

# put name of table that you want to refer to 
table = dynamoDB.Table('SentimentScore')

def lambda_handler(event, context):
    ## TODO: will implement insert, add, remove, etc. operations for dynamo
    return
    