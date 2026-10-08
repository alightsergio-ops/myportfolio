const button = document.getElementById("dark");

button.addEventListener("click", function(){
    document.body.classList.toggle("dark");
    
    if (document.body.classList.contains("dark")) {

        button.innerHTML = '<i class="fa fa-sun-o"></i>';
    } 
    else {
        button.innerHTML = '<i class="fa fa-moon-o"></i>';
    }
});


const loginForm = document.getElementById("loginForm");
const password = document.getElementById("password");
const showPassword = document.getElementById("showPassword");

// Show / hide password
showPassword.addEventListener("change", function () {

    password.type = this.checked ? "text" : "password";

});


// Login
loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const passwordValue = password.value;
    const error = document.getElementById("error");

    const correctEmail = "sergio@gmail.com";
    const correctPassword = "123456";

    if (email === correctEmail && passwordValue === correctPassword) {

        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "dashboard.html";

    } else {

        error.textContent = "Invalid email or password";

    }

});

