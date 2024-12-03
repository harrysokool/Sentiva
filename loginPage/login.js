// Load user data from localStorage
let users = {};
if (localStorage.getItem("users")) {
  users = JSON.parse(localStorage.getItem("users"));
}

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (users[username] && users[username].password === password) {
    sessionStorage.setItem("isLoggedIn", "true");

    const role = username === "admin" ? "admin" : "user";
    const currentUser = { username, role };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // alert("Login successful!");
    showCustomAlert("Login successful!");
    window.location.href = "../index.html";
  } else {
    // alert("Invalid username or password.");
    showCustomAlert("Invalid username or password.", "error");
  }
});

document.querySelector(".registerButton").addEventListener("click", () => {
  window.location.href = "/../Sentiva/registerPage/register.html";
});

function showCustomAlert(message, type = "success") {
  const customAlert = document.getElementById("customAlert");
  const customAlertMessage = document.getElementById("customAlertMessage");
  const customAlertTitle = document.getElementById("customAlertTitle");

  if (type === "success") {
    customAlertTitle.textContent = "Success";
    customAlert.style.backgroundColor = "#4CAF50";
  } else {
    customAlertTitle.textContent = "Error";
    customAlert.style.backgroundColor = "#f44336";
  }

  customAlertMessage.textContent = message;

  customAlert.style.display = "flex";
}

document.getElementById("customAlertClose").addEventListener("click", () => {
  const customAlert = document.getElementById("customAlert");
  customAlert.style.display = "none";
});
