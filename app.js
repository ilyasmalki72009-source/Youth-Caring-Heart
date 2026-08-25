/* =====================================================
   YOUTH CARING HEART - FRONTEND SCRIPT (BASEROW DIRECT)
===================================================== */

const BASEROW_URL = "https://api.baserow.io";
const BASEROW_TOKEN = "XSNPRFPOx48LLUWIS5aRB688ilj7Gfq";
const MEMBERS_TABLE_ID = "1154776";
const POSTER_TABLE_ID = "1154793";

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initRegistrationForm();
  initPoster();
  initAI();
  initAdmin();
});

/* ================= NAV MOBILE ================= */
function initMobileMenu() {
  const menuButton = document.getElementById("menuButton");
  const mainNav = document.getElementById("mainNav");
  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });
  }
}

/* ================= BASEROW API HELPER ================= */
async function baserowFetch(endpoint, options = {}) {
  const response = await fetch(`${BASEROW_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${BASEROW_TOKEN}`,
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { detail: text };
  }

  if (!response.ok) {
    throw new Error(data.detail || `Error: ${response.status}`);
  }
  return data;
}

/* ================= 1. REGISTER MEMBER ================= */
function initRegistrationForm() {
  const form = document.getElementById("registrationForm");
  const msg = document.getElementById("registrationMessage");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "⏳ Processing registration...";
    msg.style.color = "#1f2937";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const city = document.getElementById("city").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const interest = document.getElementById("interest").value;
    const skills = document.getElementById("skills").value.trim();
    const motivation = document.getElementById("motivation").value.trim();

    const memberId = "YCH-" + Date.now().toString().slice(-8);

    const payload = {
      "Member ID": memberId,
      "Name": name,
      "Email": email,
      "City": city,
      "Phone": phone,
      "Interest": interest,
      "Skills": skills,
      "Motivation": motivation,
      "Created At": new Date().toISOString()
    };

    try {
      await baserowFetch(`/api/database/rows/table/${MEMBERS_TABLE_ID}/?user_field_names=true`, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      // Show success section
      document.getElementById("register").classList.add("hidden");
      const successSection = document.getElementById("profileSuccess");
      document.getElementById("memberId").textContent = memberId;
      successSection.classList.remove("hidden");
      successSection.scrollIntoView({ behavior: "smooth" });

    } catch (err) {
      console.error(err);
      msg.textContent = "❌ Failed to register. Please check your network connection.";
      msg.style.color = "#dc2626";
    }
  });
}

/* ================= 2. PUBLIC ANNOUNCEMENT / POSTER ================= */
async function initPoster() {
  const titleEl = document.getElementById("publicPosterTitle");
  const textEl = document.getElementById("publicPosterText");

  try {
    const data = await baserowFetch(`/api/database/rows/table/${POSTER_TABLE_ID}/?user_field_names=true&size=1`);
    if (data.results && data.results.length > 0) {
      const poster = data.results[0];
      if (titleEl && poster.Title) titleEl.textContent = poster.Title;
      if (textEl && poster.Text) textEl.textContent = poster.Text;
    }
  } catch (err) {
    console.error("Could not load poster from Baserow:", err);
  }
}

/* ================= 3. AI CHAT SIMULATOR ================= */
function initAI() {
  const aiInput = document.getElementById("aiInput");
  const aiButton = document.getElementById("aiButton");
  const aiMessages = document.getElementById("aiMessages");

  if (!aiButton || !aiInput) return;

  const sendMessage = () => {
    const text = aiInput.value.trim();
    if (!text) return;

    // User Message
    const userDiv = document.createElement("div");
    userDiv.className = "ai-message user-message";
    userDiv.innerHTML = `<p>${text}</p>`;
    aiMessages.appendChild(userDiv);

    aiInput.value = "";
    aiMessages.scrollTop = aiMessages.scrollHeight;

    // Bot Response
    setTimeout(() => {
      const botDiv = document.createElement("div");
      botDiv.className = "ai-message bot-message";
      botDiv.innerHTML = `<strong>Youth Caring Heart AI</strong><p>Thank you for asking! Youth Caring Heart is dedicated to volunteer activities, helping children, and community progress. Submit your registration above to join us! ❤️</p>`;
      aiMessages.appendChild(botDiv);
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }, 600);
  };

  aiButton.addEventListener("click", sendMessage);
  aiInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}

/* ================= 4. ADMIN DASHBOARD ================= */
function initAdmin() {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  const adminLogin = document.getElementById("adminLogin");
  const adminDashboard = document.getElementById("adminDashboard");
  const logoutButton = document.getElementById("logoutButton");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("adminEmail").value;
      const pass = document.getElementById("adminPassword").value;

      // Basic local check for quick admin interface access
      if (email && pass) {
        adminLogin.classList.add("hidden");
        adminDashboard.classList.remove("hidden");
        loadAdminData();
      } else {
        loginMessage.textContent = "Please enter valid credentials.";
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      adminDashboard.classList.add("hidden");
      adminLogin.classList.remove("hidden");
    });
  }

  // Admin Poster Submit
  const posterForm = document.getElementById("posterForm");
  if (posterForm) {
    posterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("posterTitle").value;
      const text = document.getElementById("posterText").value;
      const msg = document.getElementById("posterMessage");

      msg.textContent = "Publishing poster...";

      try {
        const existing = await baserowFetch(`/api/database/rows/table/${POSTER_TABLE_ID}/?user_field_names=true&size=1`);
        const payload = { Title: title, Text: text, "Updated At": new Date().toISOString() };

        if (existing.results && existing.results.length > 0) {
          const id = existing.results[0].id;
          await baserowFetch(`/api/database/rows/table/${POSTER_TABLE_ID}/${id}/?user_field_names=true`, {
            method: "PATCH",
            body: JSON.stringify(payload)
          });
        } else {
          await baserowFetch(`/api/database/rows/table/${POSTER_TABLE_ID}/?user_field_names=true`, {
            method: "POST",
            body: JSON.stringify(payload)
          });
        }

        msg.textContent = "✅ Poster updated successfully!";
        msg.style.color = "#10b981";
        initPoster();
      } catch (err) {
        console.error(err);
        msg.textContent = "❌ Failed to publish poster.";
        msg.style.color = "#ef4444";
      }
    });
  }
}

async function loadAdminData() {
  const memberList = document.getElementById("memberList");
  const memberCount = document.getElementById("memberCount");

  try {
    const data = await baserowFetch(`/api/database/rows/table/${MEMBERS_TABLE_ID}/?user_field_names=true&size=100`);
    const members = data.results || [];

    if (memberCount) memberCount.textContent = members.length;

    if (memberList) {
      if (members.length === 0) {
        memberList.innerHTML = "<p>No members registered yet.</p>";
        return;
      }

      memberList.innerHTML = members.map(m => `
        <div class="member-card">
          <h3>${m.Name || 'Anonymous'} (${m["Member ID"] || 'No ID'})</h3>
          <p><strong>Email:</strong> ${m.Email || '-'}</p>
          <p><strong>City:</strong> ${m.City || '-'}</p>
          <p><strong>Interest:</strong> ${m.Interest || '-'}</p>
          <p><strong>Motivation:</strong> ${m.Motivation || '-'}</p>
        </div>
      `).join('');
    }
  } catch (err) {
    if (memberList) memberList.innerHTML = "<p>Error loading members from Baserow.</p>";
  }
}
