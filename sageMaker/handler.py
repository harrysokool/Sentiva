import boto3
import os
from urllib.parse import unquote_plus

s3 = boto3.client('s3')
sagemaker_runtime = boto3.client('runtime.sagemaker')

def lambda_handler(event, context):
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    key = unquote_plus(event['Records'][0]['s3']['object']['key'])

    # Download the image locally
    local_path = f"/tmp/{os.path.basename(key)}"
    s3.download_file(bucket_name, key, local_path)

    # Read the image as bytes
    with open(local_path, "rb") as f:
        image_bytes = f.read()

    # Invoke the SageMaker endpoint
    endpoint_name = os.getenv('SAGEMAKER_ENDPOINT')
    response = sagemaker_runtime.invoke_endpoint(
        EndpointName=endpoint_name,
        ContentType="application/x-image",
        Body=image_bytes
    )

    result = response['Body'].read().decode('utf-8')
    print(f"Inference result: {result}")

    return {
        "statusCode": 200,
        "body": f"Image analysis complete for {key}. Result: {result}"
    }
