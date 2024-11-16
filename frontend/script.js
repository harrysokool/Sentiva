document
  .getElementById("uploadForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const uploadMessage = document.getElementById("uploadMessage");
    const resultSection = document.getElementById("result-section");
    const resultSentiment = document
      .getElementById("resultSentiment")
      .querySelector("span");
    const resultConfidence = document
      .getElementById("resultConfidence")
      .querySelector("span");

    if (!file) {
      uploadMessage.textContent = "Please select a file.";
      return;
    }

    uploadMessage.textContent = "Uploading...";

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://your-api-endpoint/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();

      uploadMessage.textContent = "Upload successful!";
      resultSentiment.textContent = result.sentiment;
      resultConfidence.textContent = `${result.confidence}%`;

      resultSection.style.display = "block";
    } catch (error) {
      uploadMessage.textContent = "Upload failed. Please try again.";
    }
  });
