document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin") {
    sessionStorage.setItem("isLoggedIn", "true");
    alert("Login successful!");
    window.location.href = "../index.html";
  } else {
    alert("Invalid username or password.");
  }
});
