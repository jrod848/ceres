const list = document.querySelectorAll('.list');
const menuToggle = document.querySelector('.toggle');
const navigation = document.querySelector('.navigation');
const loginBtn = document.getElementById("loginBtn");
const loginForm = document.getElementById("loginForm");
const loginBody = document.querySelector(".loginBody");
const dashboardBody = document.querySelector(".dashboardBody");
const logOutBtn = document.querySelector(".logOut");
const errorMessage = document.getElementById("errorMessage");
const graphContainer = document.querySelector(".graphContainer");
const canvasElements = document.querySelectorAll(".graphContainer canvas");
const tableElements = document.querySelectorAll(".graphContainer table");
const averageButton = document.querySelectorAll(".chart-average");
const dashBtn = document.querySelectorAll(".dashboardButtons");
const dashBtnContainer = document.querySelector(".dashboardButtonsContainer");
const dashboardGraph = document.querySelector(".dashboardGraph");
const tables = ["table1", "table2", "table3", "table4","table5","table6","table7"];
const charts = [];
const containerMapping = [];
var updatingData

logOutBtn.addEventListener('click', logOut);
loginBtn.addEventListener('click', logIn);
menuToggle.addEventListener('click', toggle);
initializeContainers();
initData();

for (let i = 0; i < averageButton.length; i++) {
    const graphId = averageButton[i].getAttribute("graph-id");
    if (graphId) {
        averageButton[i].onclick = function () {
            dashboardGraph.style.height = "50vh";
            dashboardGraph.style.margin = "0";
            dashBtnContainer.style.display = "flex";
            resetList(averageButton, 'chart-average')
            setList(averageButton, i, 'chart-average active');
            resetList(dashBtn, 'dashboardButtons');
            setList(dashBtn, 0, 'dashboardButtons active');
            activateContainer(1, graphId, "line");
            containerMapping[graphId] = i;
        }
    }
}

for (let i = 0; i < dashBtn.length; i++) {
    dashBtn[i].onclick = function () {
        let buttonNumber = getButton();
        if (buttonNumber >= 0 || buttonNumber <= 3) {
            const graphId = averageButton[buttonNumber].getAttribute("graph-id");
            const dataType = dashBtn[i].getAttribute("data-type");
            if(dataType == "table" || dataType == "prediction"){
                dashboardGraph.style.height = "auto";
            } else {
                dashboardGraph.style.height = "50vh";
            }
            resetList(dashBtn, 'dashboardButtons');
            setList(dashBtn, i, 'dashboardButtons active');
            activateContainer(1, graphId, dataType);
            containerMapping[graphId] = i;
        } else {
            const graphId = averageButton[0].getAttribute("graph-id");
            resetList(dashBtn, 'dashboardButtons');
            setList(dashBtn, i, 'dashboardButtons active');
            activateContainer(1, graphId);
            containerMapping[graphId] = i;
        }
    }
}

function addDataToTable(tableId, timeData, valueData) {
    const tbody = document.getElementById(tableId).querySelector("tbody");
    const newRow = document.createElement("tr");
    const timeCell = document.createElement("td");
    timeCell.textContent = timeData;
    const valueCell = document.createElement("td");
    valueCell.textContent = valueData;
    newRow.appendChild(timeCell);
    newRow.appendChild(valueCell);
    tbody.appendChild(newRow);
}

function activateContainer(fork, graphId, dataType) {
    const containers = document.querySelectorAll(".graphContainer");
    if (fork == 1 && dataType == "line") {
        hideAllTable();
        containerDisplay(containers);
        showCanvas(graphId)
    } else if (fork == 1 && dataType == "table") {
        hideAllGraphs();
        containerDisplay(containers);
        showTables(graphId, dataType);
    } else if (fork == 1 && dataType == "prediction") {
        hideAllGraphs();
        containerDisplay(containers);
        showTables(graphId, dataType);
    } else {
        containerDisplay(containers);
    }
}

function hideAllTable() {
    tableElements.forEach(table => {
        table.style.display = "none";
    });
}

function hideAllGraphs() {
    canvasElements.forEach(canvas => {
        canvas.style.display = "none";
    });
}

function containerDisplay(containers) {
    containers.forEach(container => {
        const containerId = container.getAttribute("data-container-id");
        if (containerId === "graph") {
            container.style.display = "flex";
        } else {
            container.style.display = "none";
        }
    });
}

function showCanvas(graphId) {
    canvasElements.forEach(canvas => {
        const canvasGraphId = canvas.getAttribute("graph-id");
        if (canvasGraphId === graphId) {
            canvas.style.display = "flex";
        } else {
            canvas.style.display = "none"; // Hide other canvas elements
        }
    })
}

function showTables(graphId, dataType) {
    if (dataType == "table") {
        tableElements.forEach(table => {
            const tableId = table.getAttribute("graph-id");
            if (tableId === graphId) {
                table.style.display = "table";
            } else {
                table.style.display = "none";
            }
        });
    } else {
        tableElements.forEach((table,index) => {
            const tableId = table.getAttribute("graph-id");
            if (tableId === "pre-"+graphId && index > 3) {
                table.style.display = "table";
            } else {
                table.style.display = "none";
            }
        });
    }
}

function initData() {
    canvasElements.forEach((canvas, index) => {
        const ctx = canvas.getContext("2d");
        const chartConfig = {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    {
                        label: `Chart ${index + 1}`,
                        data: [],
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        };
        const chart = new Chart(ctx, chartConfig);
        charts.push(chart);
        canvas.style.display = "none";
    });
}

function updateChart(chart, graphId, value) {
    if (chart) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        chart.data.labels.push(timeString);
        chart.data.datasets[0].label = graphId; // Set the label for the dataset to the graphId
        chart.data.datasets[0].data.push(value);
        chart.update();

        // Calculate the average for this chart's data
        const chartData = chart.data.datasets[0].data;
        const average = calculateAverage(chartData);

        // Display the average in the corresponding div
        const averageDiv = document.getElementById(`average-${graphId}`);
        if (averageDiv) {
            averageDiv.innerHTML = `${graphId}<br>${average}`;
        }
    } else {
        console.error("Chart is not defined.");
    }
}

function toggle() {
    if (navigation.style.display != "flex"
        || (navigation.style.display == "flex" && navigation.classList.contains('active') && breakpoint() == 'md')
        || (navigation.style.display == "flex" && !navigation.classList.contains('active') && !menuToggle.classList.contains('active') && breakpoint() == 'md')) {
        navigation.style.display = "flex";
    } else {
        navigation.style.display = "none";
    }
    menuToggle.classList.toggle('active');
    navigation.classList.toggle('active');
}

function logIn() {
    var counter = 0;
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (email === "1" && password === "2") {
        errorMessage.textContent = "";
        loginBody.style.display = "none";
        dashboardBody.style.display = "flex";
    } else {
        errorMessage.textContent = "Invalid email or password.";
    }
    updatingData = setInterval(function () {
        if (counter < 20) {
            averageButton.forEach((item, index) => {
                const graphId = item.getAttribute("graph-id");
                const randomValue = Math.random() * 100;
                const randomValue2 = Math.random() * 200;
                updateChart(charts[index], graphId, randomValue);
                addDataToTable(tables[index], timeString, randomValue);
                addDataToTable(tables[index + 3], timeString, randomValue2);
            });
            counter++;
        } else {
            clearInterval(updatingData);
        }
    }, 100);
};

function logOut() {
    dashboardGraph.style.margin = "40px 0 0 0";
    dashBtnContainer.style.display = "none";
    errorMessage.textContent = "";
    loginBody.style.display = "flex";
    dashboardBody.style.display = "none";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    clearInterval(updatingData);
    menuToggle.classList.toggle('active');
    navigation.classList.toggle('active');
};

function resetList(element, className) {
    let j = 0;
    while (j < element.length) {
        element[j++].className = className;
    }
}

function setList(element, i, classNameActive) {
    element[i].className = classNameActive;
}

function initializeContainers() {
    const activeListItem = document.querySelector(".list.active"); // Use ".list.active"
    if (activeListItem) {
        activateContainer(0, "dashboard");
    }
}

function getButton() {
    for (let i = 0; i < averageButton.length; i++) {
        if (averageButton[i].className == 'chart-average active') {
            return i;
        }
    }
}

function breakpoint() {
    let breakpoints = {
        '(min-width: 768px)': 'md',
        '(min-width: 576px) and (max-width: 767.98px)': 'sm',
        '(max-width: 575.98px)': 'xs',
    }

    for (let media in breakpoints) {
        if (window.matchMedia(media).matches) {
            return breakpoints[media];
        }
    }

    return null;
}

function calculateAverage(data) {
    if (data.length === 0) {
        return "N/A";
    }
    const sum = data.reduce((acc, value) => acc + value, 0);
    const average = sum / data.length;
    return average.toFixed(2); // Format the average to 2 decimal places
}