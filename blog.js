import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


// ===============================
// Firebase Configuration
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyAaHKvKOat8MEYEnr-f--T7ayCp6gJXVb0",
    authDomain: "portfolio-2b43f.firebaseapp.com",
    projectId: "portfolio-2b43f",
    storageBucket: "portfolio-2b43f.firebasestorage.app",
    messagingSenderId: "1076539748550",
    appId: "1:1076539748550:web:941501fcf32c1f5321e7c7",
    measurementId: "G-BGV8CN0KVD"
};


// ===============================
// Initialize Firebase
// ===============================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ===============================
// Blog Container
// ===============================

const blogPosts = document.getElementById("blogPosts");


// ===============================
// Escape HTML
// ===============================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ===============================
// Load Blog Posts
// ===============================

async function loadBlogPosts() {

    console.log("Loading blog posts...");


    try {

        // Get posts from Firestore
        const snapshot = await getDocs(
            collection(db, "posts")
        );


        console.log(
            "Posts found:",
            snapshot.size
        );


        // Clear loading message
        blogPosts.innerHTML = "";


        // ===============================
        // No Posts
        // ===============================

        if (snapshot.empty) {

            blogPosts.innerHTML = `
                <p class="loading">
                    No posts available.
                </p>
            `;

            return;
        }


        // ===============================
        // Store Posts
        // ===============================

        const posts = [];


        snapshot.forEach((doc) => {

            const data = doc.data();


            posts.push({

                id: doc.id,

                ...data

            });

        });


        // ===============================
        // Sort Posts
        // Newest First
        // ===============================

        posts.sort((a, b) => {

            const aTime = a.createdAt?.toDate
                ? a.createdAt.toDate().getTime()
                : 0;


            const bTime = b.createdAt?.toDate
                ? b.createdAt.toDate().getTime()
                : 0;


            return bTime - aTime;

        });


        // ===============================
        // Published Posts Counter
        // ===============================

        let publishedPosts = 0;


        // ===============================
        // Display Posts
        // ===============================

        posts.forEach((post) => {


            // Only show Published posts
            if (post.status !== "Published") {

                return;

            }


            publishedPosts++;


            // Create Blog Card
            const card = document.createElement("article");


            card.className = "blog-card";


            // ===============================
            // Blog Card HTML
            // ===============================

            card.innerHTML = `

                <h2>
                    ${escapeHTML(
                        post.title || "Untitled"
                    )}
                </h2>


                <div class="blog-meta">

                    <span>

                        <i class="fa fa-user"></i>

                        ${escapeHTML(
                            post.author || "Unknown"
                        )}

                    </span>


                    <span>

                        <i class="fa fa-calendar"></i>

                        ${escapeHTML(
                            post.date || ""
                        )}

                    </span>

                </div>


                <p>

                    ${escapeHTML(
                        post.content ||
                        "No content available."
                    )}

                </p>


                <span class="blog-status">

                    ${escapeHTML(
                        post.status
                    )}

                </span>


                <br>
                <br>


                <a
                    href="post.html?id=${post.id}"
                    class="read-more"
                >

                    Read More

                    <i class="fa fa-arrow-right"></i>

                </a>

            `;


            // Add card to blog
            blogPosts.appendChild(card);

        });


        // ===============================
        // No Published Posts
        // ===============================

        if (publishedPosts === 0) {

            blogPosts.innerHTML = `

                <p class="loading">

                    No published posts available.

                </p>

            `;

        }


        // ===============================
        // Console Information
        // ===============================

        console.log(
            "Published posts:",
            publishedPosts
        );


    } catch (error) {


        // ===============================
        // Error Handling
        // ===============================

        console.error(
            "Error loading posts:",
            error
        );


        blogPosts.innerHTML = `

            <p style="color:red;">

                Error loading posts.

            </p>

        `;

    }

}


// ===============================
// Start
// ===============================

loadBlogPosts();