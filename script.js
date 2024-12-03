// Global variables
let fileName = null;
let getResults = false;
let resultToDownload = null;
let imageUrl = null;
let progressFinished = false;
let pieChartInstance = null;
let barChartInstance = null;

// Load user data from localStorage
let users = JSON.parse(localStorage.getItem("users")) || {};

// Check if a user is logged in
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
console.log("Current User:", currentUser);

// Function to show admin actions if the logged-in user is admin
function showAdminActions() {
  const adminActionsDiv = document.getElementById("adminActions");

  if (currentUser && currentUser.role === "admin") {
    console.log("Admin logged in!");
    adminActionsDiv.style.display = "block";
  } else {
    console.log("Non-admin user logged in!");
    adminActionsDiv.style.display = "none";
  }
}

window.onload = showAdminActions();

// Function to clear all users except admin
function clearUsersExceptAdmin() {
  if (!users || typeof users !== "object" || Object.keys(users).length === 0) {
    // alert("No users found to clear!");
    showCustomAlert("No users found to clear!", "error");
    return;
  }

  const updatedUsers = {};

  for (const [username, userInfo] of Object.entries(users)) {
    if (username === "admin") {
      updatedUsers[username] = userInfo;
    }
  }
  localStorage.setItem("users", JSON.stringify(updatedUsers));
  users = updatedUsers;

  // alert("All users except admin have been cleared!");
  showCustomAlert("All users except admin have been cleared!");
}

// Function to clear results and reset global variables
function clearResult() {
  fileName = null;
  getResults = false;
  resultToDownload = null;
  imageUrl = null;
  progressFinished = false;

  const resultsList = document.getElementById("resultsTable");
  resultsList.innerHTML = "";

  document.getElementById("resultsContainer").style.display = "none";
  const progressBar = document.getElementById("progressContainer");
  progressBar.style.display = "none";

  const uploadMessage = document.getElementById("uploadMessage");
  if (uploadMessage) {
    uploadMessage.textContent = "";
    uploadMessage.style.display = "none";
  }

  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.value = "";
  }

  document.getElementById("chartsContainer").style.display = "none";

  // Destroy the charts if they exist
  if (pieChartInstance) {
    pieChartInstance.destroy();
    pieChartInstance = null;
  }
  if (barChartInstance) {
    barChartInstance.destroy();
    barChartInstance = null;
  }

  // Clear the canvas content
  document
    .getElementById("pieChart")
    .getContext("2d")
    .clearRect(0, 0, 500, 500);
  document
    .getElementById("barChart")
    .getContext("2d")
    .clearRect(0, 0, 500, 500);

  console.log("Global variables reset and results cleared.");
}

// start the progress bar
function startProgressBar(seconds = 30) {
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const uploadButton = document.getElementById("uploadButton");
  let progress = 0;
  let done = false;

  if (done === false) {
    uploadButton.disabled = true;
  }
  const interval = setInterval(() => {
    progress += 1;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      progressText.textContent = "Complete!";
      progressFinished = true;
      uploadButton.disabled = false;
      done = true;
    }
  }, seconds * 10);
}

// Function to generate a unique file name
function generateUniqueFileName(originalFileName) {
  const timestamp = Date.now();

  const fileExtension = originalFileName.split(".").pop();

  const baseName = originalFileName.replace(/\.[^/.]+$/, "");
  const uniqueFileName = `${baseName}${timestamp}.${fileExtension}`;

  return uniqueFileName;
}

// Redirect to login page if the user is not logged in
window.onload = () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    // alert("You need to log in first!");
    showCustomAlert("You need to log in first!", "error");
    window.location.href = "loginPage/loginPage.html";
  }
};

// Redirect to login page if the user is not logged in
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      alert("You need to log in first!");
      // showCustomAlert("You need to log in first!", "error");
      window.location.href = "loginPage/loginPage.html";
    }
  }
});

// Reset global variables and UI on page reload
window.onload = () => {
  fileName = null;
  getResults = false;
  resultToDownload = null;
  imageUrl = null;
  progressFinished = false;

  console.log("Global variables reset!");

  // Clear UI elements
  document.getElementById("resultsTable").innerHTML = "";
  document.getElementById("resultsContainer").style.display = "none";
  document.getElementById("uploadMessage").style.display = "none";
  document.getElementById("fileInput").value = "";
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
    // showCustomAlert("You must log in to access this content!", "error");
    window.location.href = "loginPage/loginPage.html";
  }
});

// Log out the user
document.getElementById("logoutButton").addEventListener("click", () => {
  sessionStorage.removeItem("isLoggedIn");
  alert("You have been logged out.");
  // showCustomAlert("You have been logged out.");
  window.location.href = "loginPage/loginPage.html";
});

// Handle form submission
document
  .getElementById("uploadForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    // Reset the UI elements
    progressFinished = false;
    resultToDownload = null;
    const resultContainer = document.getElementById("resultsContainer");
    const resultImage = document.getElementById("resultImage");
    const imageSentiment = document.getElementById("graphSentiment");
    resultContainer.style.display = "none";
    resultImage.src = "";
    resultImage.alt = "";
    imageSentiment.innerHTML = "";
    document.getElementById("chartsContainer").style.display = "none";

    // Destroy the charts if they exist
    if (pieChartInstance) {
      pieChartInstance.destroy();
      pieChartInstance = null;
    }
    if (barChartInstance) {
      barChartInstance.destroy();
      barChartInstance = null;
    }

    // Clear the canvas content
    document
      .getElementById("pieChart")
      .getContext("2d")
      .clearRect(0, 0, 500, 500);
    document
      .getElementById("barChart")
      .getContext("2d")
      .clearRect(0, 0, 500, 500);

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    fileName = file.name;
    fileName = generateUniqueFileName(fileName);
    imageUrl = file;
    let fileSize = file.size;
    let sentenceNo = 0;

    if (file && !isImageFile(fileName)) {
      console.log("File Name:", fileName);

      const reader = new FileReader();

      reader.onload = function (e) {
        try {
          const jsonData = JSON.parse(e.target.result);
          sentenceNo = jsonData.texts.length;
          console.log("Sentence Count:", sentenceNo);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };

      reader.readAsText(file);
    }

    if (!file) {
      // alert("Please choose a file to upload.");
      showCustomAlert("Please choose a file to upload.", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // alert("File size exceeds the 10MB limit.");
      showCustomAlert("File size exceeds the 10MB limit.", "error");
      return;
    }

    const endpoint = `https://2de7lmjom7.execute-api.ca-central-1.amazonaws.com/dev/prj-text-json-bucket/${fileName}`;

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
        const progressBar = document.getElementById("progressContainer");
        uploadResponse.style.display = "inline-block";
        progressBar.style.display = "block";
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

      if (isImageFile(fileName)) {
        if (fileSize < 0.1 * 1024 * 1024) {
          startProgressBar(10);
        } else if (fileSize < 0.2 * 1024 * 1024) {
          startProgressBar(20);
        } else {
          startProgressBar(30);
        }
      } else {
        if (sentenceNo < 50) {
          startProgressBar(10);
        } else if (sentenceNo < 100) {
          startProgressBar(20);
        } else if (sentenceNo < 200) {
          startProgressBar(30);
        } else if (sentenceNo < 300) {
          startProgressBar(40);
        } else if (sentenceNo < 400) {
          startProgressBar(50);
        } else {
          startProgressBar(60);
        }
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
    if (!progressFinished) {
      // alert("Please wait for the upload to finish.");
      showCustomAlert("Please wait for the upload to finish.", "error");
      return;
    }

    if (!fileName) {
      // alert("Please upload a file first.");
      showCustomAlert("Please upload a file first.", "error");
      return;
    }
    let isImage = isImageFile(fileName);

    let partitionKey = fileName.substring(0, fileName.lastIndexOf(".")).trim();
    console.log("Partition Key:", partitionKey);

    // let apiUrl = `https://rpj7jmku7c.execute-api.ca-central-1.amazonaws.com/stage0/getResult?partitionKey=${partitionKey}`;

    let apiUrl = `https://2de7lmjom7.execute-api.ca-central-1.amazonaws.com/dev/getResult?partitionKey=${partitionKey}`;
    console.log("API URL:", apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const results = await response.json();
      resultToDownload = results;
      console.log("Raw API Response:", results);
      if (isImage) {
        console.log("this is image data");
        const resultForImage = document.getElementById("resultForImage");
        const graphSentiment = document.getElementById("graphSentiment");
        const resultForText = document.getElementById("resultForText");
        resultForText.style.display = "none";
        const imgElement = resultForImage.querySelector("img");

        graphSentiment.innerHTML = "";

        const reader = new FileReader();

        reader.onload = function (e) {
          imgElement.src = e.target.result;
          imgElement.alt = "Uploaded Image";
        };

        reader.readAsDataURL(imageUrl);

        if (results.length === 0) {
          // alert("No results available for this image.");
          showCustomAlert("No results available for this image.", "error");
          return;
        }
        const [text, sentiment, probability] = results[0];

        console.log("Sentiment:", sentiment);
        console.log("Probability:", probability);

        const table = document.createElement("table");
        table.classList.add("sentiment-table");

        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
          <th>Attribute</th>
          <th>Value</th>
        `;
        table.appendChild(headerRow);

        const descriptionRow = document.createElement("tr");
        descriptionRow.innerHTML = `
          <td>Description</td>
          <td>${text}</td>
        `;
        table.appendChild(descriptionRow);

        const sentimentRow = document.createElement("tr");
        sentimentRow.innerHTML = `
          <td>Sentiment</td>
          <td>${sentiment}</td>
        `;
        table.appendChild(sentimentRow);

        const probabilityRow = document.createElement("tr");
        probabilityRow.innerHTML = `
          <td>Probability</td>
          <td>${parseFloat(probability).toFixed(4)}</td>
        `;
        table.appendChild(probabilityRow);

        graphSentiment.appendChild(table);

        const resultsTable = document.getElementById("resultsTable");
        resultsTable.innerHTML = "";
      } else {
        const resultsTable = document.getElementById("resultsTable");
        resultsTable.innerHTML = "";

        const table = document.createElement("table");
        table.classList.add("styled-table");

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
          textCell.textContent = text || "-";
          row.appendChild(textCell);

          const emotionCell = document.createElement("td");
          emotionCell.textContent = emotion || "-";
          row.appendChild(emotionCell);

          const scoreCell = document.createElement("td");
          scoreCell.textContent = parseFloat(score).toFixed(4) || "-";
          row.appendChild(scoreCell);

          table.appendChild(row);
        });

        resultsTable.appendChild(table);
      }
      document.getElementById("resultsContainer").style.display = "block";
      getResults = true;
    } catch (error) {
      console.error("Failed to fetch results:", error);
      // alert("Failed to fetch results. Please try again.");
      showCustomAlert("Failed to fetch results. Please try again.", "error");
    }
  });

// Handle download results button click
document.getElementById("downloadResultsBtn").addEventListener("click", () => {
  if (!resultToDownload) {
    // alert("No results available to download.");
    showCustomAlert("No results available to download.", "error");
    return;
  }

  const resultContent = JSON.stringify(resultToDownload, null, 2);
  const blob = new Blob([resultContent], { type: "application/json" });

  const downloadLink = document.createElement("a");
  const datasetName = fileName.replace(
    /\.(json|png|jpg|jpeg|svg|gif)$/,
    "_result.json"
  ); // Replace file extension
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = datasetName;
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
});

// Attach the event listener to the button dynamically
document
  .querySelector("#adminActions button")
  .addEventListener("click", clearUsersExceptAdmin);

function isImageFile(fileName) {
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

  const lowerCaseFileName = fileName.toLowerCase();

  return allowedExtensions.some((extension) =>
    lowerCaseFileName.includes(extension)
  );
}

// Handle clear results button click
document.getElementById("deleteResultsBtn").addEventListener("click", () => {
  clearResult();
});

// Custom alert function
function showCustomAlert(message, type = "success") {
  const customAlert = document.getElementById("customAlert");
  const customAlertMessage = document.getElementById("customAlertMessage");
  const customAlertTitle = document.getElementById("customAlertTitle");
  if (type === "error") {
    customAlertTitle.textContent = "Error";
    customAlertTitle.style.color = "red";
  } else {
    customAlertTitle.textContent = "Success";
    customAlertTitle.style.color = "green";
  }

  customAlertMessage.textContent = message;

  customAlert.style.display = "flex";
}

// Close the custom alert
document.getElementById("customAlertClose").addEventListener("click", () => {
  const customAlert = document.getElementById("customAlert");
  customAlert.style.display = "none";
});

// View Graphs Button Logic
document.getElementById("viewGraphsBtn").addEventListener("click", () => {
  const data = resultToDownload;

  const sentimentCounts = {};
  data.forEach(([_, sentiment]) => {
    sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
  });

  const labels = Object.keys(sentimentCounts);
  const values = Object.values(sentimentCounts);

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  document.getElementById("chartsContainer").style.display = "flex";

  if (pieChartInstance) {
    pieChartInstance.destroy();
  }
  if (barChartInstance) {
    barChartInstance.destroy();
  }

  // Pie Chart
  const pieCtx = document.getElementById("pieChart").getContext("2d");
  pieChartInstance = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });

  // Bar Chart
  const barCtx = document.getElementById("barChart").getContext("2d");
  barChartInstance = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Sentiment Count",
          data: values,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Sentiments",
          },
        },
        y: {
          title: {
            display: true,
            text: "Count",
          },
          beginAtZero: true,
        },
      },
    },
  });
});
