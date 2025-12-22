 
 // ====== ELEMENTS ======
const titleInput = document.querySelector('input[placeholder="Enter post title"]');
const contentInput = document.querySelector('textarea');
const dateInput = document.querySelector('input[type="date"]');
const timeInput = document.querySelector('input[type="time"]');
const scheduleBtn = document.querySelector('.schedule-btn');
const scheduledPostsCard = document.querySelectorAll('.card')[1];
const platformButtons = document.querySelectorAll('.platforms button');

// ====== STATE ======
let selectedPlatform = "";
let posts = JSON.parse(localStorage.getItem("scheduledPosts")) || [];

// ====== PLATFORM SELECTION ======
platformButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    platformButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedPlatform = btn.innerText;
  });
});

// ====== SAVE TO LOCAL STORAGE ======
function savePosts() {
  localStorage.setItem("scheduledPosts", JSON.stringify(posts));
}

// ====== GENERATE ID ======
function generateId() {
  return Date.now().toString();
}

// ====== RENDER POSTS ======
function renderPosts() {
  scheduledPostsCard.innerHTML = `<h3>Scheduled Posts</h3>`;

  if (posts.length === 0) {
    scheduledPostsCard.innerHTML +=
      `<p class="empty">No posts scheduled. Create your first post!</p>`;
    return;
  }

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post-item";

    div.innerHTML = `
      <p><strong>${post.title}</strong></p>
      <p>${post.content}</p>
      <small>
        ${post.platform} • ${new Date(post.datetime).toLocaleString()}
      </small>
      <button class="delete-btn">Delete</button>
    `;

    div.querySelector(".delete-btn").addEventListener("click", () => {
      deletePost(post.id);
    });

    scheduledPostsCard.appendChild(div);
  });
}

// ====== DELETE POST ======
function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  savePosts();
  renderPosts();
}

// ====== ADD POST ======
scheduleBtn.addEventListener("click", () => {
  if (
    !titleInput.value.trim() ||
    !contentInput.value.trim() ||
    !dateInput.value ||
    !timeInput.value ||
    !selectedPlatform
  ) {
    alert("Please fill all fields and select a platform");
    return;
  }

  const newPost = {
    id: generateId(),
    title: titleInput.value,
    content: contentInput.value,
    platform: selectedPlatform,
    datetime: `${dateInput.value}T${timeInput.value}`
  };

  posts.push(newPost);
  savePosts();
  renderPosts();

  // Reset form
  titleInput.value = "";
  contentInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
  selectedPlatform = "";
  platformButtons.forEach(b => b.classList.remove("active"));
});

// ====== INITIAL LOAD ======
renderPosts();
