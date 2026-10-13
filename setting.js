
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Replace this object with the SAME configuration used in signup.js.
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("password-form");
const currentInput = document.getElementById("current-password");
const newInput = document.getElementById("new-password");
const confirmInput = document.getElementById("confirm-password");
const message = document.getElementById("message");
const updateBtn = document.getElementById("update-btn");

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("login.html");
        return;
    }

    currentUser = user;
});

document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);
        const icon = button.querySelector("i");

        input.type = input.type === "password" ? "text" : "password";

        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
    });
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!currentUser) {
        showMessage("Please log in before changing your password.", "error");
        return;
    }

    const currentPassword = currentInput.value;
    const newPassword = newInput.value;
    const confirmPassword = confirmInput.value;

    if (newPassword.length < 6) {
        showMessage(
            "Your new password must contain at least 6 characters.",
            "error"
        );
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage("The new passwords do not match.", "error");
        return;
    }

    if (currentPassword === newPassword) {
        showMessage(
            "Your new password must be different from your current password.",
            "error"
        );
        return;
    }

    updateBtn.disabled = true;
    updateBtn.textContent = "Updating...";

    try {
        const credential = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
        );

        // Verify the current password.
        await reauthenticateWithCredential(currentUser, credential);

        // Change the password in Firebase Authentication.
        await updatePassword(currentUser, newPassword);

        showMessage("Password updated successfully!", "success");

        form.reset();
    } catch (error) {
        console.error("Password update error:", error);

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/invalid-login-credentials"
        ) {
            showMessage("Your current password is incorrect.", "error");
        } else if (error.code === "auth/weak-password") {
            showMessage(
                "Please choose a stronger password.",
                "error"
            );
        } else if (error.code === "auth/too-many-requests") {
            showMessage(
                "Too many attempts. Please try again later.",
                "error"
            );
        } else if (error.code === "auth/network-request-failed") {
            showMessage(
                "Network error. Check your internet connection.",
                "error"
            );
        } else if (error.code === "auth/requires-recent-login") {
            showMessage(
                "Please log out, log in again, and retry.",
                "error"
            );
        } else {
            showMessage(
                "Unable to update password. Please try again.",
                "error"
            );
        }
    } finally {
        updateBtn.disabled = false;
        updateBtn.innerHTML =
            '<i class="fa fa-lock"></i> Update Password';
    }
});

document.getElementById("logout").addEventListener("click", async (event) => {
    event.preventDefault();

    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout error:", error);
        showMessage("Unable to log out. Please try again.", "error");
    }
});
