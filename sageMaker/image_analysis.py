import torch
import clip
from PIL import Image

# Cache the model and preprocess function to avoid reloading for every inference
model_cache = None

def predict_fn(input_data, context):
    """SageMaker's prediction function."""
    global model_cache

    if model_cache is None:
        model_cache, preprocess = clip.load("ViT-B/32", device="cpu")

    # Preprocess the input image
    image = preprocess(Image.open(input_data)).unsqueeze(0).to("cpu")

    # Define sentiment labels
    sentiment_labels = [
        "a happy painting", "a sad painting", "a calm artwork",
        "an angry artwork", "a joyful painting", "a peaceful painting",
        "a depressing artwork", "a vibrant painting", "a dark artwork",
        "a bright painting", "a neutral artwork"
    ]

    # Tokenize text prompts
    text_inputs = torch.cat([clip.tokenize(label) for label in sentiment_labels]).to("cpu")

    with torch.no_grad():
        # Perform inference
        image_features = model_cache.encode_image(image)
        text_features = model_cache.encode_text(text_inputs)
        similarity = (image_features @ text_features.T).softmax(dim=-1)
        probs = similarity[0].cpu().numpy()

    # Get the sentiment with the highest probability
    predicted_sentiment = sentiment_labels[probs.argmax()]
    return {
        "predicted_sentiment": predicted_sentiment,
        "probabilities": {label: float(prob) for label, prob in zip(sentiment_labels, probs)}
    }
