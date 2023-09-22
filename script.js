document.addEventListener("DOMContentLoaded", function () {
  const authForm = document.getElementById("auth-form");
  const errorMessage = document.getElementById("error-message");
  const dashboard = document.getElementById("dashboard");
  const logoutButton = document.getElementById("logout-button");
  const options = document.querySelectorAll(".dashboard-option");


  function createChart(chartId, data) {
    const ctx = document.getElementById(chartId).getContext("2d");
    return new Chart(ctx, {
        type: "line", // You can change the chart type (e.g., "bar", "pie", etc.)
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}

    options.forEach((option, index) => {
        const graphContainer = option.querySelector(".graph-container");
        const optionDetails = option.querySelector(".option-details");

        option.addEventListener("click", function () {
            // Toggle the display of the chart
            if (graphContainer.style.display === "none" || graphContainer.style.display === "") {
                optionDetails.style.display = "block";
                graphContainer.style.display = "block";

                // Create and update the chart
                const chartData = {
                    labels: ["Label 1", "Label 2", "Label 3"],
                    datasets: [
                        {
                            label: "Data",
                            data: [10, 20, 30],
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                    ],
                };
                createChart(`chart${index + 1}`, chartData);
            } else {
                optionDetails.style.display = "none";
                graphContainer.style.display = "none";
            }
        });
    });

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

      logoutButton.addEventListener("click", function () {
          // Clear the form inputs
          document.getElementById("email").value = "";
          document.getElementById("password").value = "";

          // Hide the dashboard and show the login form
          dashboard.style.display = "none";
          authForm.style.display = "block";
      });
});
