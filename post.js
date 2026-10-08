import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


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
const db = getFirestore(app);

const singlePost = document.getElementById("singlePost");


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


async function loadPost() {

    try {

        const params = new URLSearchParams(
            window.location.search
        );

        const postId = params.get("id");


        if (!postId) {

            singlePost.innerHTML = `
                <p style="color:red;">
                    Post not found.
                </p>
            `;

            return;
        }


        const postRef = doc(db, "posts", postId);

        const postSnapshot = await getDoc(postRef);


        if (!postSnapshot.exists()) {

            singlePost.innerHTML = `
                <p style="color:red;">
                    This post does not exist.
                </p>
            `;

            return;
        }


        const post = postSnapshot.data();


        if (post.status !== "Published") {

            singlePost.innerHTML = `
                <p>
                    This post is not available.
                </p>
            `;

            return;
        }


        singlePost.innerHTML = `

            <h1>
                ${escapeHTML(post.title || "Untitled")}
            </h1>


            <div class="single-post-meta">

                <span>
                    <i class="fa fa-user"></i>
                    ${escapeHTML(post.author || "Unknown")}
                </span>

                <span>
                    <i class="fa fa-calendar"></i>
                    ${escapeHTML(post.date || "")}
                </span>

            </div>


            <div class="single-post-content">

                ${escapeHTML(
                    post.content || "No content available."
                )}

            </div>

        `;


    } catch (error) {

        console.error(
            "Error loading post:",
            error
        );

        singlePost.innerHTML = `
            <p style="color:red;">
                Error loading post.
            </p>
        `;

    }

}


loadPost();