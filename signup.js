
    import { initializeApp } 
        from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

    import { 
        getAuth,
        createUserWithEmailAndPassword,
        updateProfile
    } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

    const firebaseConfig = {
        apiKey: "AIzaSyAaHKvKOat8MEYEnr-f--T7ayCp6gJXVb0",
        authDomain: "portfolio-2b43f.firebaseapp.com",
        projectId: "portfolio-2b43f",
        storageBucket: "portfolio-2b43f.firebasestorage.app",
        messagingSenderId: "1076539748550",
        appId: "1:1076539748550:web:941501fcf32c1f5321e7c7",
        measurementId: "G-BGV8CN0KVD"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const signupForm = document.getElementById("signup-form");

    signupForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const fullname = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            await updateProfile(user, {
                displayName: fullname
            });

            alert("Account created successfully!");

            window.location.href = "login.html";

        } catch (error) {

            console.error(error);

            if (error.code === "auth/email-already-in-use") {
                alert("This email is already registered.");
            } 
            else if (error.code === "auth/invalid-email") {
                alert("Please enter a valid email address.");
            } 
            else if (error.code === "auth/weak-password") {
                alert("Password is too weak. Use at least 6 characters.");
            } 
            else {
                alert("Signup failed: " + error.message);
            }
        }
    });


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
