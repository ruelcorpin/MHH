document.addEventListener("DOMContentLoaded", function () {
    // Event listeners for both forms
    document.getElementById("signupForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from reloading the page
        submitForm("signup");
    });

    document.getElementById("signinForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from reloading the page
        submitForm("signin");
    });
});

// Function to switch between tabs
function switchTab(tabName) {
    const tabs = document.querySelectorAll(".form-box");
    const buttons = document.querySelectorAll(".tab-button");

    tabs.forEach(tab => {
        tab.classList.remove("active-form");
    });
    buttons.forEach(button => {
        button.classList.remove("active");
    });

    document.getElementById(tabName).classList.add("active-form");
    const activeButton = document.querySelector(`button[onclick="switchTab('${tabName}')"]`);
    activeButton.classList.add("active");
}

// Function to handle form submission
function submitForm(formType) {
    const formElement = document.getElementById(`${formType}Form`);
    const formData = new FormData(formElement);

    // Convert FormData to JSON object for signup (to properly handle first & last name separately)
    let jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value.trim(); // Trim whitespace
    });

    fetch(`/${formType}`, {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("message").innerHTML = `<p style="color: green;">${data.message}</p>`;
        formElement.reset();
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
