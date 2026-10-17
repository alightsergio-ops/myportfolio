
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC1_5UenCYCM6OoeQxmomfBktXJsCwOU6hg",
    authDomain: "portfolio-2b43f.firebaseapp.com",
    projectId: "portfolio-2b43f",
    storageBucket: "portfolio-2b43f.firebasestorage.app",
    messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
    appId: "REPLACE_WITH_YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("contactForm");
const statusText = document.getElementById("contactStatus");
const submitButton = document.getElementById("contactSubmit");

form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (name.length < 2 || name.length > 80 ||
        email.length > 254 ||
        message.length < 10 || message.length > 3000) {
        statusText.textContent = "Please check your details and try again.";
        statusText.className = "error";
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    statusText.textContent = "";

    try {
        await addDoc(collection(db, "contactMessages"), {
            name,
            email,
            message,
            status: "new",
            createdAt: serverTimestamp()
        });

        statusText.textContent =
            "Your message was sent successfully. Thank you!";
        statusText.className = "success";
        form.reset();
    } catch (error) {
        console.error("Contact form error:", error);

        statusText.textContent =
            "Sorry, your message could not be sent. Please try again.";
        statusText.className = "error";
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
    }
});
