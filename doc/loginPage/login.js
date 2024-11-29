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

    alert("Login successful!");
    window.location.href = "../index.html";
  } else {
    alert("Invalid username or password.");
  }
});

document.querySelector(".registerButton").addEventListener("click", () => {
  window.location.href = "/../doc/registerPage/register.html";
});
