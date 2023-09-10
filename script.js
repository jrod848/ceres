document.addEventListener("DOMContentLoaded", function () {
  const authForm = document.getElementById("auth-form");
  const errorMessage = document.getElementById("error-message");
  const dashboard = document.getElementById("dashboard");
  const dataList = document.getElementById("data-list");
  const logoutButton = document.getElementById("logout-button");

  authForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // You would typically send a request to a server for authentication here
      // For simplicity, we're using a hardcoded username and password
      if (email === "user@example.com" && password === "password") {
          // Authentication successful
          errorMessage.textContent = "";
          authForm.style.display = "none";
          dashboard.style.display = "block";
          displayDashboard();
      } else {
          // Authentication failed
          errorMessage.textContent = "Invalid email or password.";
      }
  });

  function displayDashboard() {
      // Dummy data for the dashboard
      const dummyData = ["Option 1", "Option 2", "Option 3"];

      dummyData.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          dataList.appendChild(li);
      });

      const options = document.querySelectorAll(".dashboard-option");

      options.forEach((option) => {
          option.addEventListener("click", function () {
              // Toggle the active class and expand/collapse details
              option.classList.toggle("active");
          });
      });

      logoutButton.addEventListener("click", function () {
          // Clear the form inputs
          document.getElementById("email").value = "";
          document.getElementById("password").value = "";

          // Hide the dashboard and show the login form
          dashboard.style.display = "none";
          authForm.style.display = "block";
      });
  }
});
