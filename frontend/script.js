document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  // Select the sections to show or hide
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

document.getElementById("logoutButton").addEventListener("click", () => {
  sessionStorage.setItem("isLoggedIn", "false");

  alert("You have been logged out.");
  window.location.href = "loginPage/loginPage.html";
});
