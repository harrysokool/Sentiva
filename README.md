# Sentiva: Cloud-Based Sentiment Analysis Platform

This project is a machine learning application designed to analyze and identify the sentiment conveyed in both text and visual media, including images and artwork.

## Features
- **Text-Based Sentiment Analysis**: Detects emotions such as happiness, sadness, anger, and more from text inputs.
- **Image Sentiment Analysis**: Analyzes images or artwork to determine the emotions they convey.
- **Real-Time Predictions and Visualization**: Provides instant, easy-to-understand feedback on input sentiment.

## Project Overview

Emotions can be challenging to interpret, especially in indirect communication mediums like text, images, or art. Misinterpreting emotional tones can lead to miscommunication, misunderstanding, or missed opportunities for deeper emotional engagement. This project aims to bridge that gap by offering users meaningful insights into the emotions expressed in text and visual content.

### Problem Statement

In everyday life, understanding emotions in written or visual content is often difficult. Misinterpretation of these emotions can result in:
- Miscommunication in personal or professional interactions.
- Difficulty interpreting the emotional tone of messages in a foreign language.
- Challenges in understanding the emotional intent behind artworks or photographs.

### Solution Overview

Our solution is a **cloud-based emotion sentiment analysis application** that empowers users to uncover the emotional undertones of text and images. The system’s key functionalities include:
- **Text Analysis**: Users can input a document or text snippet to receive an emotional sentiment breakdown (e.g., happy, sad, angry).
- **Image Analysis**: Users can upload an image or artwork to reveal the emotions it conveys.

The application leverages advanced machine learning models hosted on the cloud, ensuring scalability and seamless access from any device. Potential use cases include:
- **Art Interpretation**: Users in museums or galleries can upload images of artwork to understand its emotional context.
- **Language Learning**: Learners can input messages in a new language to interpret emotional nuances accurately.

### Main Features
- **Cloud-Based**: Accessible from any device with an internet connection.
- **Multimodal Input**: Supports both text and image inputs for comprehensive sentiment analysis.
- **Emotion Detection**: Provides a detailed breakdown of emotional content in the input.
- **User-Friendly Interface**: Designed for simplicity and ease of use, ensuring a seamless user experience.

## How to Use the Application

### Access the Platform
- Open the Sentiva application on your web browser.
- Register an account e.g. username: user1, pwd: Hello123 (pwd have to at least have 1 number and 1 capital alphabet and no special characters) email: hello@gmail.com, OTP: 123456

### Upload Your Input
- **For text analysis**: Upload a `.json` file containing text data. Ensure the file format matches the expected structure (e.g., `document_name` and `texts` fields).
- **For image analysis**: Upload an image file in `.jpeg` or `.jpg` format.

### Analyze Sentiment
- Click on the **"Upload and Analyze"** button to process your input.

### View Results
- Sentiment results will appear as a table displaying:
  - **Index**: The line number of the input text or image.
  - **Text/Description**: The text content or a description of the uploaded image.
  - **Sentiment**: The detected emotion (e.g., joy, sadness, anger).
  - **Probability**: The confidence score of the prediction.

### Visualize Data
- Click on the **"View Graphs"** button to generate and display:
  - A **Pie Chart** showing the sentiment distribution.
  - A **Bar Chart** displaying the frequency of each sentiment.

### Clear Results
- To reset the application and upload new data, click the **"Clear Results"** button. This action will clear all displayed results and graphs.


With this tool, users can gain deeper emotional insights, improving communication, interpretation, and overall understanding.
