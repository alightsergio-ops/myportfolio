// ==========================================
// FIREBASE IMPORTS
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyAaHKvKOat8MEYEnr-f--T7ayCp6gJXVb0",
    authDomain: "portfolio-2b43f.firebaseapp.com",
    projectId: "portfolio-2b43f",
    storageBucket: "portfolio-2b43f.firebasestorage.app",
    messagingSenderId: "1076539748550",
    appId: "1:1076539748550:web:941501fcf32c1f5321e7c7",
    measurementId: "G-BGV8CN0KVD"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const userName = document.getElementById("user-name");

const userEmail = document.getElementById("user-email");

const profileName = document.querySelector(".profile span");

const postCount = document.getElementById("postCount");

const postTable = document.getElementById("postTable");

const searchInput = document.getElementById("searchInput");

const addBtn = document.getElementById("addBtn");

const postForm = document.getElementById("postForm");

const formTitle = document.getElementById("formTitle");

const postTitle = document.getElementById("postTitle");

const postContent = document.getElementById("postContent");

const postAuthor = document.getElementById("postAuthor");

const postStatus = document.getElementById("postStatus");

const saveBtn = document.getElementById("saveBtn");

const cancelBtn = document.getElementById("cancelBtn");

const logoutBtn = document.getElementById("logout-btn");

const darkBtn = document.getElementById("darkBtn");

const sidebar = document.getElementById("sidebar");


// ==========================================
// EDIT POST ID
// ==========================================

let editId = null;


// ==========================================
// AUTHENTICATION
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }


    console.log("Logged in user:", user.email);


    // Display user information
    if (userName) {
        userName.textContent =
            user.displayName || "User";
    }


    if (userEmail) {
        userEmail.textContent =
            user.email || "";
    }


    if (profileName) {
        profileName.textContent =
            user.displayName || "User";
    }


    // Load posts
    loadPosts();

});


// ==========================================
// LOAD POSTS
// ==========================================

async function loadPosts() {

    try {

        const postsQuery = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc")
        );


        const snapshot =
            await getDocs(postsQuery);


        const posts = [];


        snapshot.forEach((docSnapshot) => {

            posts.push({

                id: docSnapshot.id,

                ...docSnapshot.data()

            });

        });


        console.log(
            "Posts loaded:",
            posts.length
        );


        displayPosts(posts);


    } catch (error) {

        console.error(
            "Error loading posts:",
            error
        );


        if (postTable) {

            postTable.innerHTML = `
                <tr>
                    <td colspan="7">
                        Error loading posts.
                    </td>
                </tr>
            `;

        }

    }

}


// ==========================================
// DISPLAY POSTS
// ==========================================

function displayPosts(posts) {

    if (!postTable) {
        return;
    }


    postTable.innerHTML = "";


    // Update post count
    if (postCount) {

        postCount.textContent =
            posts.length;

    }


    // No posts
    if (posts.length === 0) {

        postTable.innerHTML = `
            <tr>
                <td colspan="7">
                    No posts available.
                </td>
            </tr>
        `;

        return;
    }


    posts.forEach((post, index) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                ${escapeHTML(
                    post.title || ""
                )}
            </td>

            <td class="post-content-cell">
                ${escapeHTML(
                    post.content || ""
                )}
            </td>

            <td>
                ${escapeHTML(
                    post.author || ""
                )}
            </td>

            <td>
                <span class="status ${String(
                    post.status || ""
                ).toLowerCase()}">

                    ${escapeHTML(
                        post.status || ""
                    )}

                </span>
            </td>

            <td>
                ${escapeHTML(
                    post.date || ""
                )}
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editPost('${post.id}')"
                >
                    <i class="fa fa-edit"></i>
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deletePost('${post.id}')"
                >
                    <i class="fa fa-trash"></i>
                    Delete
                </button>

            </td>

        `;


        postTable.appendChild(row);

    });

}


// ==========================================
// ADD POST BUTTON
// ==========================================

if (addBtn) {

    addBtn.addEventListener(
        "click",
        () => {

            editId = null;


            if (postForm) {
                postForm.classList.add("show");
            }


            if (formTitle) {
                formTitle.textContent =
                    "Add New Post";
            }


            if (saveBtn) {
                saveBtn.textContent =
                    "Save Post";
            }


            clearForm();

        }
    );

}


// ==========================================
// CANCEL BUTTON
// ==========================================

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        () => {

            editId = null;


            if (postForm) {
                postForm.classList.remove("show");
            }


            clearForm();

        }
    );

}


// ==========================================
// SAVE / UPDATE POST
// ==========================================

if (postForm) {

    postForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const user = auth.currentUser;


            if (!user) {

                alert(
                    "You must be logged in."
                );

                return;
            }


            const title =
                postTitle.value.trim();


            const content =
                postContent.value.trim();


            const author =
                postAuthor.value.trim();


            const status =
                postStatus.value;


            // Validate
            if (
                !title ||
                !content ||
                !author
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            try {

                saveBtn.disabled = true;


                // ==================================
                // CREATE NEW POST
                // ==================================

                if (!editId) {

                    await addDoc(
                        collection(db, "posts"),
                        {

                            title: title,

                            content: content,

                            author: author,

                            authorId: user.uid,

                            status: status,

                            date:
                                new Date()
                                .toISOString()
                                .split("T")[0],

                            createdAt:
                                new Date()

                        }
                    );


                    alert(
                        "Post created successfully!"
                    );

                }


                // ==================================
                // UPDATE EXISTING POST
                // ==================================

                else {

                    const postRef =
                        doc(
                            db,
                            "posts",
                            editId
                        );


                    await updateDoc(
                        postRef,
                        {

                            title: title,

                            content: content,

                            author: author,

                            status: status

                        }
                    );


                    alert(
                        "Post updated successfully!"
                    );

                }


                // Reset
                editId = null;


                postForm.classList.remove(
                    "show"
                );


                clearForm();


                // Reload
                await loadPosts();


            } catch (error) {

                console.error(
                    "Error saving post:",
                    error
                );


                alert(
                    "Error saving post: " +
                    error.message
                );


            } finally {

                saveBtn.disabled = false;

            }

        }
    );

}


// ==========================================
// EDIT POST
// ==========================================

window.editPost = async function (id) {

    try {

        const snapshot =
            await getDocs(
                collection(db, "posts")
            );


        let selectedPost = null;


        snapshot.forEach(
            (docSnapshot) => {

                if (
                    docSnapshot.id === id
                ) {

                    selectedPost = {

                        id:
                            docSnapshot.id,

                        ...docSnapshot.data()

                    };

                }

            }
        );


        if (!selectedPost) {

            alert(
                "Post not found."
            );

            return;
        }


        editId =
            selectedPost.id;


        postTitle.value =
            selectedPost.title || "";


        postContent.value =
            selectedPost.content || "";


        postAuthor.value =
            selectedPost.author || "";


        postStatus.value =
            selectedPost.status ||
            "Published";


        formTitle.textContent =
            "Edit Post";


        saveBtn.textContent =
            "Update Post";


        postForm.classList.add(
            "show"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Error editing post:",
            error
        );

        alert(
            "Error loading post."
        );

    }

};


// ==========================================
// DELETE POST
// ==========================================

window.deletePost = async function (id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this post?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const postRef =
            doc(
                db,
                "posts",
                id
            );


        await deleteDoc(postRef);


        alert(
            "Post deleted successfully!"
        );


        await loadPosts();


    } catch (error) {

        console.error(
            "Error deleting post:",
            error
        );


        alert(
            "Error deleting post: " +
            error.message
        );

    }

};


// ==========================================
// SEARCH POSTS
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        async () => {

            const search =
                searchInput.value
                .trim()
                .toLowerCase();


            try {

                const snapshot =
                    await getDocs(
                        collection(
                            db,
                            "posts"
                        )
                    );


                const posts = [];


                snapshot.forEach(
                    (docSnapshot) => {

                        posts.push({

                            id:
                                docSnapshot.id,

                            ...docSnapshot.data()

                        });

                    }
                );


                if (!search) {

                    displayPosts(posts);

                    return;
                }


                const filtered =
                    posts.filter(
                        (post) => {

                            return (

                                String(
                                    post.title || ""
                                )
                                .toLowerCase()
                                .includes(search)

                                ||

                                String(
                                    post.content || ""
                                )
                                .toLowerCase()
                                .includes(search)

                                ||

                                String(
                                    post.author || ""
                                )
                                .toLowerCase()
                                .includes(search)

                                ||

                                String(
                                    post.status || ""
                                )
                                .toLowerCase()
                                .includes(search)

                            );

                        }
                    );


                displayPosts(filtered);


            } catch (error) {

                console.error(
                    "Search error:",
                    error
                );

            }

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async (e) => {

            e.preventDefault();


            try {

                await signOut(auth);


                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Unable to logout."
                );

            }

        }
    );

}


// ==========================================
// DARK MODE
// ==========================================

if (darkBtn) {

    darkBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            localStorage.setItem(
                "darkMode",
                isDark
            );


            const icon =
                darkBtn.querySelector("i");


            if (icon) {

                icon.className =
                    isDark
                        ? "fa fa-sun-o"
                        : "fa fa-moon-o";

            }

        }
    );

}


// ==========================================
// LOAD SAVED DARK MODE
// ==========================================

if (
    localStorage.getItem(
        "darkMode"
    ) === "true"
) {

    document.body.classList.add(
        "dark"
    );


    if (darkBtn) {

        const icon =
            darkBtn.querySelector("i");


        if (icon) {

            icon.className =
                "fa fa-sun-o";

        }

    }

}


// ==========================================
// MOBILE SIDEBAR
// ==========================================

const menuBtn =
    document.getElementById(
        "menuBtn"
    );


if (menuBtn && sidebar) {

    menuBtn.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "show"
            );

        }
    );

}


// ==========================================
// CLOSE SIDEBAR WHEN LINK IS CLICKED
// ==========================================

if (sidebar) {

    const links =
        sidebar.querySelectorAll(
            "a"
        );


    links.forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                if (
                    window.innerWidth <= 768
                ) {

                    sidebar.classList.remove(
                        "show"
                    );

                }

            }
        );

    });

}


// ==========================================
// CLEAR FORM
// ==========================================

function clearForm() {

    if (postTitle) {
        postTitle.value = "";
    }


    if (postContent) {
        postContent.value = "";
    }


    if (postAuthor) {
        postAuthor.value = "";
    }


    if (postStatus) {

        postStatus.value =
            "Published";

    }

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}