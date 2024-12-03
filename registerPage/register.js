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
      // alert("All fields are required!");
      showCustomAlert("All fields are required!");
      return;
    }

    if (password1 !== password2) {
      // alert("Passwords do not match!");
      showCustomAlert("Passwords do not match!");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password1)) {
      // alert(
      //   "Password must be at least 8 characters long and include at least one uppercase letter and one number and cannot contain special characters."
      // );
      showCustomAlert(
        "Password must be at least 8 characters long and include at least one uppercase letter and one number and cannot contain special characters."
      );
      return;
    }

    if (otp !== "123456") {
      // alert("Invalid OTP!");
      showCustomAlert("Invalid OTP!");
      return;
    }

    if (users[username]) {
      // alert("User already exists. Please login.");
      showCustomAlert("User already exists. Please login.");
    } else {
      users[username] = { password: password1 };
      localStorage.setItem("users", JSON.stringify(users));
      // alert("Registration successful! Redirecting to login...");
      showCustomAlert(
        "Registration successful! Redirecting to login...",
        "success"
      );
    }
  });

// Handle login button click
document.getElementById("loginButton").addEventListener("click", function () {
  window.location.href = "/../Sentiva/loginPage/loginPage.html";
});

function showCustomAlert(message, type = "error") {
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

document.getElementById("customAlertClose").addEventListener("click", () => {
  const customAlert = document.getElementById("customAlert");
  customAlert.style.display = "none";
  const customAlertTitle = document.getElementById("customAlertTitle");
  if (customAlertTitle.textContent === "Success") {
    window.location.href = "/../Sentiva/loginPage/loginPage.html";
  }
});
