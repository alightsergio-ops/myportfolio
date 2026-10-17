const button = document.getElementById("dark");

if (button) {
    button.addEventListener("click", function () {
        document.body.classList.toggle("dark");

        button.innerHTML = document.body.classList.contains("dark")
            ? '<i class="fa fa-sun-o"></i>'
            : '<i class="fa fa-moon-o"></i>';
    });
}

// const loginForm = document.getElementById("loginForm");
// const password = document.getElementById("password");
// const showPassword = document.getElementById("showPassword");

// // Show / hide password
// showPassword.addEventListener("change", function () {

//     password.type = this.checked ? "text" : "password";

// });


// // Login
// loginForm.addEventListener("submit", function(event) {

//     event.preventDefault();

//     const email = document.getElementById("email").value.trim();
//     const passwordValue = password.value;
//     const error = document.getElementById("error");

//     const correctEmail = "sergio@gmail.com";
//     const correctPassword = "123456";

//     if (email === correctEmail && passwordValue === correctPassword) {

//         localStorage.setItem("isLoggedIn", "true");

//         window.location.href = "dashboard.html";

//     } else {

//         error.textContent = "Invalid email or password";

//     }

// });



// const contactForm = document.getElementById("contactForm");

// if (contactForm) {
//     const status = document.getElementById("contactStatus");
//     const submitButton = document.getElementById("contactSubmit");

//     contactForm.addEventListener("submit", function (event) {
//         event.preventDefault();

//         if (!contactForm.checkValidity()) {
//             contactForm.reportValidity();
//             return;
//         }

//         const name = document
//             .getElementById("contactName")
//             .value.trim();

//         const email = document
//             .getElementById("contactEmail")
//             .value.trim();

//         const message = document
//             .getElementById("contactMessage")
//             .value.trim();

//         if (name.length < 2 || message.length < 10) {
//             status.textContent =
//                 "Please enter a valid name and a message of at least 10 characters.";
//             status.className = "error";
//             return;
//         }

//         if (name.length > 80 || email.length > 254 ||
//             message.length > 3000) {
//             status.textContent =
//                 "Some fields exceed the allowed length.";
//             status.className = "error";
//             return;
//         }

//         status.textContent =
//             "Validation successful. Connecting message delivery is the next step.";
//         status.className = "success";
//     });
// }

