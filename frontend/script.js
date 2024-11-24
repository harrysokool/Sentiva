document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn"); // Check if user is logged in

  // Select the sections to show or hide
  const uploadSection = document.querySelector(".upload");
  const resultsSection = document.querySelector(".results");

  if (isLoggedIn) {
    // If logged in, display the sections
    uploadSection.style.display = "block";
    resultsSection.style.display = "block";
  } else {
    // If not logged in, hide sections and redirect (optional)
    uploadSection.style.display = "none";
    resultsSection.style.display = "none";
    alert("You must log in to access this content.");
    window.location.href = "loginPage/loginPage.html"; // Redirect to login page
  }
});

document.getElementById("logoutButton").addEventListener("click", () => {
  // Set isLoggedIn to "false"
  sessionStorage.setItem("isLoggedIn", "false");

  alert("You have been logged out.");
  window.location.href = "loginPage/loginPage.html"; // Redirect to login page
});
