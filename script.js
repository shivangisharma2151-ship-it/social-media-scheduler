  // ===== ELEMENTS =====
const caption = document.getElementById("caption");
const platform = document.getElementById("platform");
const scheduleTime = document.getElementById("scheduleTime");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const postList = document.getElementById("postList");
const toast = document.getElementById("toast");
const charCount = document.getElementById("charCount");

const addPostBtn = document.getElementById("addPostBtn");
const draftBtn = document.getElementById("draftBtn");
const exportBtn = document.getElementById("exportBtn");
const darkToggle = document.getElementById("darkToggle");

// ===== STATE =====
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let currentTab = "Scheduled";

// ===== TOAST =====
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// ===== CHARACTER COUNT =====
caption.addEventListener("input", () => {
  charCount.textContent = caption.value.length;
});

// ===== IMAGE PREVIEW =====
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
});

// ===== SAVE POST =====
function savePost(status) {
  if (!caption.value.trim() || !platform.value) {
    showToast("Please fill required fields ❌");
    return;
  }

  const newPost = {
    id: Date.now(),
    caption: caption.value,
    platform: platform.value,
    time: scheduleTime.value,
    image: preview.src || "",
    status
  };

  posts.push(newPost);
  updateStorage();
  resetForm();
  renderPosts();
  showToast(`${status} saved ✅`);
}

// ===== BUTTON EVENTS =====
addPostBtn.addEventListener("click", () => savePost("Scheduled"));
draftBtn.addEventListener("click", () => savePost("Draft"));

// ===== RENDER POSTS =====
function renderPosts() {
  postList.innerHTML = "";

  const filtered = posts.filter(post => post.status === currentTab);

  if (filtered.length === 0) {
    postList.innerHTML = `<p style="text-align:center;">No posts here 📭</p>`;
    return;
  }

  filtered.forEach(post => {
    const li = document.createElement("li");
    li.className = "post";

    li.innerHTML = `
      <strong>${post.platform}</strong>
      <span class="badge ${post.status.toLowerCase()}">${post.status}</span>
      <p>${post.caption}</p>
      ${post.image ? `<img src="${post.image}">` : ""}
      ${post.time ? `<small>⏰ ${post.time}</small>` : ""}
      <br><br>
      <button onclick="deletePost(${post.id})">🗑 Delete</button>
    `;

    postList.appendChild(li);
  });
}

// ===== DELETE POST =====
function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  updateStorage();
  renderPosts();
  showToast("Post deleted 🗑️");
}

// ===== STORAGE =====
function updateStorage() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// ===== RESET FORM =====
function resetForm() {
  caption.value = "";
  platform.value = "";
  scheduleTime.value = "";
  imageInput.value = "";
  preview.style.display = "none";
  charCount.textContent = "0";
}

// ===== TABS =====
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.status;
    renderPosts();
  });
});

// ===== AUTO-PUBLISH =====
setInterval(() => {
  const now = new Date();

  posts.forEach(post => {
    if (
      post.status === "Scheduled" &&
      post.time &&
      new Date(post.time) <= now
    ) {
      post.status = "Published";
    }
  });

  updateStorage();
  renderPosts();
}, 60000);

// ===== EXPORT =====
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(posts, null, 2)], {
    type: "application/json"
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "scheduled-posts.json";
  a.click();
});

// ===== DARK MODE =====
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ===== INITIAL LOAD =====
renderPosts();
 
 
