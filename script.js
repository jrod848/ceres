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
const ctx = document.getElementById("chart1").getContext("2d");

for (let i = 0; i < list.length; i++){
    list[i].onclick = function() {
        resetList();
        setList(i);
    } 
}

const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Sunlight",
          data: [],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
});


menuToggle.onclick = function() {
    if(navigation.style.display != "flex" 
    || (navigation.style.display == "flex" && navigation.classList.contains('active') && breakpoint() =='md') 
    || (navigation.style.display == "flex" && !navigation.classList.contains('active') && !menuToggle.classList.contains('active') && breakpoint() =='md')) {
        navigation.style.display = "flex";
    } else {
    navigation.style.display = "none";
    }
    
    menuToggle.classList.toggle('active');
    navigation.classList.toggle('active');
}

loginBtn.onclick = function () {
    resetList();
    setList(0);

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "1" && password === "2") {
        errorMessage.textContent = "";
        loginBody.style.display = "none";
        dashboardBody.style.display = "flex";
    } else {
        errorMessage.textContent = "Invalid email or password.";
    }
};

logOutBtn.onclick = function () {
    errorMessage.textContent = "";
    loginBody.style.display = "flex";
    dashboardBody.style.display = "none";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
};

function resetList(){
    let j = 0;
    while(j<list.length){
        list[j++].className = 'list';
    }
    
}

function setList(i){
    list[i].className = 'list active';
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

setInterval(function() {
    const now = new Date();
    chart.data.labels.push(now.toLocaleTimeString());
    chart.data.datasets[0].data.push(Math.random() * 2);
    chart.update();
  }, 5000);