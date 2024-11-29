let users = {};
if (localStorage.getItem("users")) {
  users = JSON.parse(localStorage.getItem("users"));
}

// Handle form submission
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password1 = document.getElementById("password1").value.trim();
    const password2 = document.getElementById("password2").value.trim();
    const otp = document.getElementById("otp").value.trim();

    if (!username || !password1 || !password2 || !otp) {
      alert("All fields are required!");
      return;
    }

    if (password1 !== password2) {
      alert("Passwords do not match!");
      return;
    }

    // Strong password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password1)) {
      alert(
        "Password must be at least 8 characters long and include at least one uppercase letter and one number."
      );
      return;
    }

    if (otp !== "123456") {
      alert("Invalid OTP!");
      return;
    }

    if (users[username]) {
      alert("User already exists. Please login.");
    } else {
      users[username] = { password: password1 };
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful! Redirecting to login...");
      window.location.href = "/../docs/loginPage/loginPage.html";
    }
  });

// Handle login button click
document.getElementById("loginButton").addEventListener("click", function () {
  window.location.href = "/../docs/loginPage/loginPage.html";
});
