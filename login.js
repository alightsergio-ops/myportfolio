import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
}
    from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


/* =========================
   FIREBASE CONFIGURATION
========================= */

const firebaseConfig = {
    apiKey: "AIzaSyAaHKvKOat8MEYEnr-f--T7ayCp6gJXVb0",
    authDomain: "portfolio-2b43f.firebaseapp.com",
    projectId: "portfolio-2b43f",
    storageBucket: "portfolio-2b43f.firebasestorage.app",
    messagingSenderId: "1076539748550",
    appId: "1:1076539748550:web:941501fcf32c1f5321e7c7",
    measurementId: "G-BGV8CN0KVD"
};


/* =========================
   INITIALIZE FIREBASE
========================= */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


/* =========================
   DARK MODE
========================= */

const darkButton = document.getElementById("dark");

if (darkButton) {

    darkButton.addEventListener("click", function () {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            darkButton.innerHTML =
                '<i class="fa fa-sun-o"></i>';

        } else {

            darkButton.innerHTML =
                '<i class="fa fa-moon-o"></i>';

        }

    });

}


/* =========================
   SHOW / HIDE PASSWORD
========================= */

const passwordInput = document.getElementById("password");
const showPassword = document.getElementById("show-password");

if (showPassword && passwordInput) {

    showPassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            showPassword.classList.remove("fa-eye");
            showPassword.classList.add("fa-eye-slash");

        } else {

            passwordInput.type = "password";

            showPassword.classList.remove("fa-eye-slash");
            showPassword.classList.add("fa-eye");

        }

    });

}


/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const error =
            document.getElementById("login-error");


        if (error) {
            error.textContent = "";
        }


        try {

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            console.log("Logged in user:", user);

            /* Go to Dashboard */
            window.location.href = "dashboard.html";


        } catch (error) {

            console.error("Login error:", error);

            if (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/user-not-found"
            ) {

                if (error) {
                    document.getElementById("login-error").textContent =
                        "Invalid email or password.";
                }

            } else if (error.code === "auth/invalid-email") {

                document.getElementById("login-error").textContent =
                    "Please enter a valid email.";

            } else {

                document.getElementById("login-error").textContent =
                    "Login failed. Please try again.";

            }

        }

    });

}