
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
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

/* =============== CONFIG =============== */

const firebaseConfig = {
  apiKey: "AIzaSyAaHKvKOat8MEYEnr-f--T7ayCp6gJXVb0",
  authDomain: "portfolio-2b43f.firebaseapp.com",
  projectId: "portfolio-2b43f",
  storageBucket: "portfolio-2b43f.firebasestorage.app",
  messagingSenderId: "1076539748550",
  appId: "1:1076539748550:web:941501fcf32c1f5321e7c7",
  measurementId: "G-BGV8CN0KVD"
};

// Iyi email igomba guhura n'iya admin iri muri Firestore Rules.
const ADMIN_EMAIL = "alightsergio@gmail.com".toLowerCase();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* =============== ELEMENTS =============== */

const $ = (id) => document.getElementById(id);

const userName = $("user-name");
const userEmail = $("user-email");
const profileName = $("profile-name") ||
  document.querySelector(".profile span");

const userCount = $("userCount");
const postCount = $("postCount");
const messageCount = $("messageCount");

const postTable = $("postTable");
const searchInput = $("searchInput");
const addBtn = $("addBtn");
const postForm = $("postForm");
const formTitle = $("formTitle");
const postTitle = $("postTitle");
const postContent = $("postContent");
const postAuthor = $("postAuthor");
const postStatus = $("postStatus");
const saveBtn = $("saveBtn");
const cancelBtn = $("cancelBtn");
const logoutBtn = $("logout-btn");
const darkBtn = $("darkBtn");
const sidebar = $("sidebar");
const menuBtn = $("menuBtn");
const contactMessagesList = $("contactMessagesList");

let allPosts = [];
let editId = null;

/* =============== AUTH =============== */

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  try {
    await user.reload();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      window.location.replace("login.html");
      return;
    }

    if (userName) {
      userName.textContent = currentUser.displayName || "User";
    }

    if (userEmail) {
      userEmail.textContent = currentUser.email || "";
    }

    if (profileName) {
      profileName.textContent = currentUser.displayName || "User";
    }

    const isAdmin =
      currentUser.email?.toLowerCase() === ADMIN_EMAIL &&
      currentUser.emailVerified === true;

    console.log("Current email:", currentUser.email);
    console.log("Email verified:", currentUser.emailVerified);
    console.log("Is admin:", isAdmin);

    // Load blog posts.
    await loadPosts();

    // Only verified admin can read the contact inbox.
    if (isAdmin) {
      await loadContactMessages();
    } else {
      if (contactMessagesList) {
        contactMessagesList.textContent =
          "Admin access required. Check your email and verification.";
      }
      if (messageCount) messageCount.textContent = "—";
    }

  } catch (error) {
    console.error("Dashboard initialization failed:", error);
    showMessageError("Could not initialize dashboard. Check Console.");
  }
});

/* =============== BLOG POSTS =============== */

async function loadPosts() {
  if (!postTable) return;

  postTable.textContent = "Loading posts...";

  try {
    let snapshot;

    try {
      snapshot = await getDocs(
        query(collection(db, "posts"), orderBy("createdAt", "desc"))
      );
    } catch {
      // Fallback for older documents without createdAt.
      snapshot = await getDocs(collection(db, "posts"));
    }

    allPosts = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data()
    }));

    allPosts.sort((a, b) => {
      const dateA = a.createdAt?.toDate
        ? a.createdAt.toDate().getTime()
        : 0;
      const dateB = b.createdAt?.toDate
        ? b.createdAt.toDate().getTime()
        : 0;
      return dateB - dateA;
    });

    renderPosts(allPosts);
    console.log("Posts loaded:", allPosts.length);

  } catch (error) {
    console.error("Could not load posts:", error);
    postTable.textContent =
      "Could not load posts. Check Firestore Rules.";
  }
}

function renderPosts(posts) {
  if (!postTable) return;

  postTable.replaceChildren();

  if (postCount) postCount.textContent = String(allPosts.length);

  if (!posts.length) {
    postTable.textContent = allPosts.length
      ? "No matching posts."
      : "No posts yet.";
    return;
  }

  posts.forEach((post, index) => {
    const row = document.createElement("tr");

    const values = [
      String(index + 1),
      post.title || "",
      post.content || "",
      post.author || "",
      post.status || "Draft",
      post.date || ""
    ];

    values.forEach((value, i) => {
      const cell = document.createElement("td");

      if (i === 4) {
        const badge = document.createElement("span");
        badge.className = "status " + String(value).toLowerCase();
        badge.textContent = value;
        cell.appendChild(badge);
      } else {
        cell.textContent = value;
      }

      if (i === 2) cell.className = "post-content-cell";
      row.appendChild(cell);
    });

    const actions = document.createElement("td");

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "edit-btn";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => editPost(post.id));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-btn";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deletePost(post.id));

    actions.append(edit, remove);
    row.appendChild(actions);
    postTable.appendChild(row);
  });
}

function clearForm() {
  if (postTitle) postTitle.value = "";
  if (postContent) postContent.value = "";
  if (postAuthor) postAuthor.value = "";
  if (postStatus) postStatus.value = "Published";
}

function openNewPostForm() {
  editId = null;
  clearForm();

  if (formTitle) formTitle.textContent = "Add New Post";
  if (saveBtn) saveBtn.textContent = "Save Post";
  postForm?.classList.add("show");
  postTitle?.focus();
}

function editPost(id) {
  const post = allPosts.find((item) => item.id === id);
  if (!post) return alert("Post not found.");

  editId = id;
  if (postTitle) postTitle.value = post.title || "";
  if (postContent) postContent.value = post.content || "";
  if (postAuthor) postAuthor.value = post.author || "";
  if (postStatus) postStatus.value = post.status || "Published";

  if (formTitle) formTitle.textContent = "Edit Post";
  if (saveBtn) saveBtn.textContent = "Update Post";

  postForm?.classList.add("show");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deletePost(id) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    await deleteDoc(doc(db, "posts", id));
    await loadPosts();
    alert("Post deleted.");
  } catch (error) {
    console.error("Delete post error:", error);
    alert("Could not delete post: " + error.message);
  }
}

window.editPost = editPost;
window.deletePost = deletePost;

addBtn?.addEventListener("click", openNewPostForm);

cancelBtn?.addEventListener("click", () => {
  editId = null;
  clearForm();
  postForm?.classList.remove("show");
  if (formTitle) formTitle.textContent = "Add New Post";
  if (saveBtn) saveBtn.textContent = "Save Post";
});

postForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const user = auth.currentUser;
  if (!user) return alert("Please log in first.");

  const title = postTitle?.value.trim() || "";
  const content = postContent?.value.trim() || "";
  const author = postAuthor?.value.trim() || "";
  const status = postStatus?.value || "Published";

  if (!title || !content || !author) {
    return alert("Please fill in all required fields.");
  }

  const editingId = editId;

  try {
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = "Saving...";
    }

    if (editingId) {
      await updateDoc(doc(db, "posts", editingId), {
        title,
        content,
        author,
        status
      });
    } else {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        author,
        authorId: user.uid,
        status,
        date: new Date().toISOString().split("T")[0],
        createdAt: serverTimestamp()
      });
    }

    editId = null;
    postForm?.classList.remove("show");
    clearForm();
    await loadPosts();
    alert(editingId ? "Post updated." : "Post created.");

  } catch (error) {
    console.error("Save post error:", error);
    alert("Could not save post: " + error.message);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = editId ? "Update Post" : "Save Post";
    }
  }
});

searchInput?.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();

  renderPosts(allPosts.filter((post) =>
    [post.title, post.content, post.author, post.status]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(term)
  ));
});

/* =============== CONTACT MESSAGES =============== */

async function loadContactMessages() {
  if (!contactMessagesList) {
    console.error("Add id='contactMessagesList' to dashboard.html");
    return;
  }

  contactMessagesList.textContent = "Loading messages...";

  try {
    const snapshot = await getDocs(
      query(
        collection(db, "contactMessages"),
        orderBy("createdAt", "desc")
      )
    );

    console.log("Contact messages found:", snapshot.size);

    if (messageCount) {
      messageCount.textContent = String(snapshot.size);
    }

    contactMessagesList.replaceChildren();

    if (snapshot.empty) {
      contactMessagesList.textContent = "No contact messages yet.";
      return;
    }

    snapshot.forEach((item) => {
      const message = item.data();

      const card = document.createElement("article");
      card.className = "contact-message-card";

      const name = document.createElement("h3");
      name.textContent = message.name || "Unknown sender";

      const email = document.createElement("p");
      email.textContent = "Email: " + (message.email || "Not provided");

      const body = document.createElement("p");
      body.textContent = message.message || "Empty message";

      const status = document.createElement("p");
      status.textContent = "Status: " + (message.status || "new");

      const date = document.createElement("small");
      date.textContent = message.createdAt?.toDate
        ? message.createdAt.toDate().toLocaleString()
        : "Date unavailable";

      card.append(name, email, body, status, date);
      contactMessagesList.appendChild(card);
    });

  } catch (error) {
    console.error("Contact messages error:", error);
    if (messageCount) messageCount.textContent = "!";

    contactMessagesList.textContent =
      error.code === "permission-denied"
        ? "Firebase denied access. Check admin email and Firestore Rules."
        : "Could not load messages. Check the browser Console.";
  }
}

function showMessageError(message) {
  if (contactMessagesList) {
    contactMessagesList.textContent = message;
  }
}

/* =============== LOGOUT =============== */

logoutBtn?.addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    await signOut(auth);
    window.location.replace("login.html");
  } catch (error) {
    console.error("Logout error:", error);
    alert("Could not log out: " + error.message);
  }
});

/* =============== DARK MODE =============== */

function applyDarkMode(enabled) {
  document.body.classList.toggle("dark", enabled);

  const icon = darkBtn?.querySelector("i");
  if (icon) {
    icon.className = enabled ? "fa fa-sun-o" : "fa fa-moon-o";
  }
}

darkBtn?.addEventListener("click", () => {
  const enabled = !document.body.classList.contains("dark");
  localStorage.setItem("darkMode", String(enabled));
  applyDarkMode(enabled);
});

applyDarkMode(localStorage.getItem("darkMode") === "true");




const snapshot = await getDocs(
    query(
        collection(db, "contactMessages"),
        orderBy("createdAt", "desc")
    )
);

if (messageCount) {
    messageCount.textContent = String(snapshot.size);
}
/* =============== MOBILE SIDEBAR =============== */

menuBtn?.addEventListener("click", () => {
  sidebar?.classList.toggle("show");
});

sidebar?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 760) {
      sidebar.classList.remove("show");
    }
  });
});



