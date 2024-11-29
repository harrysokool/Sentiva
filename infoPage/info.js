// Log out the user
document.getElementById("logoutButton").addEventListener("click", () => {
  sessionStorage.removeItem("isLoggedIn");
  alert("You have been logged out.");
  window.location.href = "/../frontend/loginPage/loginPage.html";
});

// see if the user is logged in
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  const uploadSection = document.querySelector(".upload");
  const resultsSection = document.querySelector(".results");

  if (!isLoggedIn) {
    alert("You must log in to access this content.");
    window.location.href = "/../frontend/loginPage/loginPage.html";
  }
});
