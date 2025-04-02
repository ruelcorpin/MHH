// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("resetPasswordForm").addEventListener("submit", function (event) {
//         event.preventDefault(); // Prevent form from reloading the page
//         resetPassword();
//     });
// });

// // Function to handle password reset
// function resetPassword() {
//     const email = document.getElementById("resetEmail").value;

//     // Simulate a request to the server (you can modify this for actual email handling)
//     setTimeout(() => {
//         document.getElementById("resetMessage").innerHTML = `<p style="color: green;">A password reset link has been sent to ${email}.</p>`;
//         document.getElementById("resetPasswordForm").reset();
//     }, 1000);
// }

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
    const formData = new FormData(document.getElementById(`${formType}Form`));
    
    fetch(`/${formType}`, {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("message").innerHTML = `<p style="color: green;">${data.message}</p>`;
        document.getElementById(`${formType}Form`).reset();
    })
    .catch(error => {
        console.error("Error:", error);
    });
}