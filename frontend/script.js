// Global variables
let fileName = null;
let getResults = false;
let resultToDownload = null;

// Redirect to login page if the user is not logged in
window.onload = () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    alert("You need to log in first!");
    window.location.href = "loginPage/loginPage.html";
  }
};

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      alert("You need to log in first!");
      window.location.href = "loginPage/loginPage.html";
    }
  }
});

// Reset global variables and UI on page reload
window.onload = () => {
  fileName = null;
  getResults = false;
  resultToDownload = null;

  console.log("Global variables reset!");

  // Clear UI elements
  document.getElementById("resultsTable").innerHTML = ""; // Clear results table
  document.getElementById("resultsContainer").style.display = "none"; // Hide results container
  document.getElementById("uploadMessage").style.display = "none"; // Hide upload message
  document.getElementById("fileInput").value = ""; // Clear file input
};

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

    let apiUrl = `https://rpj7jmku7c.execute-api.ca-central-1.amazonaws.com/stage0/getResult?partitionKey=${partitionKey}`;
    console.log("API URL:", apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Parse the raw JSON response
      const results = await response.json();
      resultToDownload = results;
      console.log("Raw API Response:", results);

      // Populate the results table
      const resultsTable = document.getElementById("resultsTable");
      resultsTable.innerHTML = "";

      const table = document.createElement("table");
      table.border = "1";

      const headerRow = document.createElement("tr");
      ["Index", "Text", "Sentiment", "Probability"].forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      results.forEach(([text, emotion, score], index) => {
        const row = document.createElement("tr");

        const indexCell = document.createElement("td");
        indexCell.textContent = index + 1;
        row.appendChild(indexCell);

        const textCell = document.createElement("td");
        textCell.textContent = text;
        row.appendChild(textCell);

        const emotionCell = document.createElement("td");
        emotionCell.textContent = emotion;
        row.appendChild(emotionCell);

        const scoreCell = document.createElement("td");
        scoreCell.textContent = parseFloat(score).toFixed(4);
        row.appendChild(scoreCell);

        table.appendChild(row);
      });

      resultsTable.appendChild(table);
      document.getElementById("resultsContainer").style.display = "block";
      getResults = true;
    } catch (error) {
      console.error("Failed to fetch results:", error);
      alert("Failed to fetch results. Please try again.");
    }
  });

// Handle download results button click
document.getElementById("downloadResultsBtn").addEventListener("click", () => {
  if (!resultToDownload) {
    alert("No results available to download.");
    return;
  }

  const resultContent = JSON.stringify(resultToDownload, null, 2);
  const blob = new Blob([resultContent], { type: "application/json" });

  const downloadLink = document.createElement("a");
  const datasetName = fileName.replace(".json", "_result.json");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = datasetName;
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
});

// Handle clear results button click
document.getElementById("deleteResultsBtn").addEventListener("click", () => {
  fileName = null;
  getResults = false;
  resultToDownload = null;

  const resultsList = document.getElementById("resultsTable");
  resultsList.innerHTML = "";

  document.getElementById("resultsContainer").style.display = "none";

  const uploadMessage = document.getElementById("uploadMessage");
  if (uploadMessage) {
    uploadMessage.textContent = "";
    uploadMessage.style.display = "none";
  }

  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.value = "";
  }

  console.log("Global variables reset and results cleared.");
});
