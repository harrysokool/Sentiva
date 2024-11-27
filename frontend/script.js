// Global variables
let fileName = null;

// see if the user is logged in
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  const uploadSection = document.querySelector(".upload");
  const resultsSection = document.querySelector(".results");

  if (isLoggedIn) {
    uploadSection.style.display = "block";
    resultsSection.style.display = "block";
  } else {
    uploadSection.style.display = "none";
    resultsSection.style.display = "none";
    alert("You must log in to access this content.");
    window.location.href = "loginPage/loginPage.html";
  }
});

// Log out the user
document.getElementById("logoutButton").addEventListener("click", () => {
  sessionStorage.removeItem("isLoggedIn");
  alert("You have been logged out.");
  window.location.href = "loginPage/loginPage.html";
});

// Handle form submission
document
  .getElementById("uploadForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    fileName = file.name;

    if (!file) {
      alert("Please choose a file to upload.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds the 10MB limit.");
      return;
    }

    const endpoint = `https://2de7lmjom7.execute-api.ca-central-1.amazonaws.com/dev/prj-text-json-bucket/${file.name}`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (response.ok) {
        const uploadResponse = document.querySelector(".uploadMSG");
        uploadResponse.style.display = "inline-block";
        document.getElementById(
          "uploadMessage"
        ).textContent = `File "${file.name}" uploaded successfully!`;
        document.getElementById("uploadMessage").style.color = "green";
      } else {
        const errorMessage = await response.text();
        document.getElementById(
          "uploadMessage"
        ).textContent = `Failed to upload file: ${errorMessage}`;
        document.getElementById("uploadMessage").style.color = "red";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      document.getElementById("uploadMessage").textContent =
        "Error uploading file. Please try again.";
      document.getElementById("uploadMessage").style.color = "red";
    }
  });

// Handle view results button click
document
  .getElementById("viewResultsBtn")
  .addEventListener("click", async () => {
    if (!fileName) {
      alert("Please upload a file first.");
      return;
    }

    let partitionKey = fileName.replace(".json", "").trim();
    console.log("Partition Key:", partitionKey);

    let apiUrl = `https://ju6ivpqe76.execute-api.ca-central-1.amazonaws.com/stage0/getResult?partitionKey=${partitionKey}`;
    console.log("API URL:", apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Raw API Response:", result);

      const results = JSON.parse(result.body);
      console.log("Parsed Results:", results);

      const resultsList = document.getElementById("resultsList");
      resultsList.innerHTML = "";
      results.forEach(([text, emotion, score]) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Text: "${text}" | Emotion: ${emotion} | Score: ${parseFloat(
          score
        ).toFixed(4)}`;
        resultsList.appendChild(listItem);
      });

      document.getElementById("resultsContainer").style.display = "block";
    } catch (error) {
      console.error("Failed to fetch results:", error);
      alert("Failed to fetch results. Please try again.");
    }
  });

// Handle download results button click

// Handle clear results button click
