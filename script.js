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
const aiAssistBtn = document.getElementById("aiAssistBtn");
const profileNode = document.getElementById("profileNode");

// ===== STATE =====
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let currentTab = "Scheduled";

// AI Generator Logic
const aiContent = {
  Instagram: "Golden hour in India! ☀️ Loving the vibes today. #PostBloom #India #Aesthetic",
  Twitter: "Just shared a new update on my workflow. Efficiency is key! 🚀 #PostBloom #Growth",
  LinkedIn: "Excited to share my latest professional milestones from India. 📈 #CareerGrowth #PostBloom"
};

// ===== HELPERS =====
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// AI Assist
aiAssistBtn.addEventListener("click", () => {
  const plat = platform.value.split(" ")[0];
  if (!plat) {
    showToast("Please select a platform first! 🤖");
    return;
  }
  aiAssistBtn.textContent = "Writing...";
  setTimeout(() => {
    caption.value = aiContent[plat] || "Excited for what's next! #PostBloom";
    charCount.textContent = caption.value.length;
    aiAssistBtn.textContent = "✨ AI Generate";
    showToast("AI Generated Content! 🪄");
  }, 600);
});

// Character Counter
caption.addEventListener("input", () => {
  charCount.textContent = caption.value.length;
});

// Image Preview
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Save Function
function savePost(status) {
  if (!caption.value.trim() || !platform.value) {
    showToast("Please fill the caption and platform! ❌");
    return;
  }
  
  if (status === "Scheduled" && !scheduleTime.value) {
    showToast("Please pick a Date and Time! 📅");
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
  showToast(`${status} saved! ✅`);
}

// Render Logic
function renderPosts() {
  postList.innerHTML = "";
  const filtered = posts.filter(p => p.status === currentTab);

  if (filtered.length === 0) {
    postList.innerHTML = `<p style="text-align:center; padding:40px; color:var(--text-dim);">No ${currentTab} posts found. 🌸</p>`;
    return;
  }

  filtered.forEach(post => {
    const li = document.createElement("li");
    li.className = "post";
    li.innerHTML = `
      <span class="badge ${post.status.toLowerCase()}">${post.status}</span>
      <strong style="color:var(--primary)">${post.platform}</strong>
      <p style="margin: 15px 0;">${post.caption}</p>
      ${post.image ? `<img src="${post.image}" style="width:100%; border-radius:8px; margin-bottom:10px;">` : ""}
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px;">
        <small>📅 ${post.time ? post.time.replace('T', ' ') : 'Draft'}</small>
        <button onclick="deletePost(${post.id})" style="color:#ff7675; background:none; font-size:0.8rem;">Delete</button>
      </div>
    `;
    postList.appendChild(li);
  });
}

function deletePost(id) {
  posts = posts.filter(p => p.id !== id);
  updateStorage();
  renderPosts();
  showToast("Post removed 🗑️");
}

function updateStorage() { localStorage.setItem("posts", JSON.stringify(posts)); }

function resetForm() {
  caption.value = ""; platform.value = ""; scheduleTime.value = ""; 
  imageInput.value = ""; preview.style.display = "none"; charCount.textContent = "0";
}

// ===== EVENT LISTENERS =====
addPostBtn.addEventListener("click", () => savePost("Scheduled"));
draftBtn.addEventListener("click", () => savePost("Draft"));

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.status;
    renderPosts();
  });
});

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(posts, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "postbloom_backup.json";
  a.click();
});

profileNode.addEventListener("click", () => showToast("Shivangi Sharma - India 🇮🇳"));

// Auto-Publish (Every 30s)
setInterval(() => {
  const now = new Date();
  let changed = false;
  posts.forEach(p => {
    if (p.status === "Scheduled" && p.time && new Date(p.time) <= now) {
      p.status = "Published";
      changed = true;
    }
  });
  if (changed) { updateStorage(); renderPosts(); }
}, 30000);

renderPosts();
