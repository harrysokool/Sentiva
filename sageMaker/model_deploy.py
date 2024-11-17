import boto3
from sagemaker.pytorch import PyTorchModel
from sagemaker import get_execution_role

def deploy_model():
    role = get_execution_role()

    model = PyTorchModel(
        model_data=None,  # No pre-trained model artifact needed
        entry_point="image_analysis.py",  # Your script
        role=role,
        framework_version="1.10.0",
        py_version="py38",
        image_uri="763104351884.dkr.ecr.us-west-2.amazonaws.com/pytorch-inference:1.10.0-cpu-py38-ubuntu20.04",
        endpoint_name="clip-image-endpoint"
    )

    predictor = model.deploy(
        initial_instance_count=1,
        instance_type="ml.m5.large"
    )
    print(f"Endpoint deployed at: {predictor.endpoint_name}")

if __name__ == "__main__":
    deploy_model()
