/* ==================================================
   YOUTH CARING HEART
   FRONTEND JAVASCRIPT
   VERCEL API + BASEROW + GEMINI
================================================== */

/* ==================================================
   CONFIGURATION
   ONLY PUBLIC IDs BELONG HERE
================================================== */

const CONFIG = {
  membersTableId: "1154776",
  posterTableId: "1154793"
};


/* ==================================================
   MOBILE MENU
================================================== */

function toggleMenu() {
  const nav = document.getElementById("nav");

  if (!nav) return;

  nav.classList.toggle("mobile-open");
}

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    const nav = document.getElementById("nav");

    if (nav) {
      nav.classList.remove("mobile-open");
    }
  });
});


/* ==================================================
   DARK MODE
================================================== */

function toggleDark() {
  document.body.classList.toggle("dark");

  const isDark =
    document.body.classList.contains("dark");

  localStorage.setItem(
    "ych-dark-mode",
    isDark ? "true" : "false"
  );
}

if (
  localStorage.getItem("ych-dark-mode") === "true"
) {
  document.body.classList.add("dark");
}


/* ==================================================
   LANGUAGE
================================================== */

function setLanguage(language) {

  if (language === "ar") {

    document.documentElement.dir = "rtl";

    alert(
      "🇲🇦 العربية ستكون متاحة بشكل كامل في النسخة القادمة."
    );

    return;
  }

  if (language === "fr") {

    document.documentElement.dir = "ltr";

    alert(
      "🇫🇷 La version française complète sera ajoutée prochainement."
    );

    return;
  }

  document.documentElement.dir = "ltr";
}


/* ==================================================
   COUNTDOWN SYSTEM
================================================== */

function updateCountdowns() {

  const countdowns =
    document.querySelectorAll(".countdown");

  countdowns.forEach(counter => {

    const date =
      counter.dataset.date;

    if (!date) return;

    const target =
      new Date(date).getTime();

    const now =
      Date.now();

    let distance =
      target - now;

    if (distance <= 0) {

      distance = 0;

      const competition =
        counter.closest(".competition");

      if (competition) {

        const badge =
          competition.querySelector(".badge");

        if (badge) {

          badge.textContent =
            "REGISTRATION CLOSED";

          badge.style.background =
            "#f4d6d5";
        }
      }
    }

    const days =
      Math.floor(
        distance /
        (1000 * 60 * 60 * 24)
      );

    const hours =
      Math.floor(
        (distance %
          (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      );

    const minutes =
      Math.floor(
        (distance %
          (1000 * 60 * 60)) /
          (1000 * 60)
      );

    const seconds =
      Math.floor(
        (distance %
          (1000 * 60)) /
          1000
      );

    const daysElement =
      counter.querySelector(".days");

    const hoursElement =
      counter.querySelector(".hours");

    const minutesElement =
      counter.querySelector(".minutes");

    const secondsElement =
      counter.querySelector(".seconds");

    if (daysElement) {
      daysElement.textContent =
        String(days).padStart(2, "0");
    }

    if (hoursElement) {
      hoursElement.textContent =
        String(hours).padStart(2, "0");
    }

    if (minutesElement) {
      minutesElement.textContent =
        String(minutes).padStart(2, "0");
    }

    if (secondsElement) {
      secondsElement.textContent =
        String(seconds).padStart(2, "0");
    }

  });
}

updateCountdowns();

setInterval(
  updateCountdowns,
  1000
);


/* ==================================================
   COMPETITION APPLICATION
================================================== */

function joinCompetition(name) {

  const overlay =
    document.getElementById(
      "applicationOverlay"
    );

  const title =
    document.getElementById(
      "applicationCompetition"
    );

  if (!overlay || !title) return;

  title.textContent =
    "🏆 " + name + " Competition";

  overlay.classList.add("active");

  document.body.style.overflow =
    "hidden";

  const success =
    document.getElementById(
      "applicationSuccess"
    );

  const form =
    document.getElementById(
      "applicationForm"
    );

  if (success) {
    success.style.display =
      "none";
  }

  if (form) {
    form.style.display =
      "block";
  }
}


/* ==================================================
   CLOSE APPLICATION
================================================== */

function closeApplication() {

  const overlay =
    document.getElementById(
      "applicationOverlay"
    );

  if (!overlay) return;

  overlay.classList.remove("active");

  document.body.style.overflow =
    "";

  const form =
    document.getElementById(
      "applicationForm"
    );

  const success =
    document.getElementById(
      "applicationSuccess"
    );

  if (form) {

    form.reset();

    form.style.display =
      "block";
  }

  if (success) {

    success.style.display =
      "none";
  }
}


const applicationOverlay =
  document.getElementById(
    "applicationOverlay"
  );

if (applicationOverlay) {

  applicationOverlay.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        applicationOverlay
      ) {
        closeApplication();
      }

    }
  );
}


document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {
      closeApplication();
    }

  }
);


/* ==================================================
   SUBMIT COMPETITION APPLICATION
   FRONTEND → VERCEL → BASEROW
================================================== */

async function submitApplication(event) {

  event.preventDefault();

  const form =
    document.getElementById(
      "applicationForm"
    );

  const success =
    document.getElementById(
      "applicationSuccess"
    );

  if (!form || !success) return;

  const name =
    document.getElementById(
      "appName"
    )?.value.trim();

  const email =
    document.getElementById(
      "appEmail"
    )?.value.trim();

  const phone =
    document.getElementById(
      "appPhone"
    )?.value.trim();

  const competition =
    document.getElementById(
      "applicationCompetition"
    )?.textContent.trim();

  if (!name || !email || !phone) {

    alert(
      "Please complete all required fields."
    );

    return;
  }

  try {

    const response =
      await fetch(
        "/api/members",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            phone,
            competition
          })
        }
      );

    const data =
      await response.json()
        .catch(() => ({}));

    if (response.ok) {

      form.style.display =
        "none";

      success.style.display =
        "block";

      showNotification(
        "🎉 Application submitted successfully!"
      );

    } else {

      console.error(
        "Application error:",
        data
      );

      showNotification(
        data.error ||
        "❌ Submission failed. Please try again."
      );
    }

  } catch (error) {

    console.error(error);

    showNotification(
      "❌ Connection error. Please try again."
    );
  }
}


/* ==================================================
   PUBLISH ANNOUNCEMENT
   FRONTEND → VERCEL → BASEROW
================================================== */

async function publishAnnouncement() {

  const titleElement =
    document.getElementById(
      "announcementTitle"
    );

  const textElement =
    document.getElementById(
      "announcementText"
    );

  const categoryElement =
    document.getElementById(
      "announcementCategory"
    );

  if (
    !titleElement ||
    !textElement ||
    !categoryElement
  ) {
    return;
  }

  const title =
    titleElement.value.trim();

  const text =
    textElement.value.trim();

  const category =
    categoryElement.value;

  if (!title || !text) {

    alert(
      "Please complete the announcement."
    );

    return;
  }

  try {

    const response =
      await fetch(
        "/api/posters",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            title,
            text,
            category
          })
        }
      );

    const data =
      await response.json()
        .catch(() => ({}));

    if (!response.ok) {

      console.error(
        "Poster error:",
        data
      );

      showNotification(
        data.error ||
        "❌ Failed to publish announcement."
      );

      return;
    }

    const grid =
      document.getElementById(
        "announcementGrid"
      );

    if (grid) {

      const card =
        document.createElement(
          "article"
        );

      card.className =
        "announcement";

      const poster =
        document.createElement(
          "div"
        );

      poster.className =
        "announcement-poster";

      poster.textContent =
        "📢";

      const body =
        document.createElement(
          "div"
        );

      body.className =
        "announcement-body";

      const categoryElement =
        document.createElement(
          "div"
        );

      categoryElement.className =
        "announcement-date";

      categoryElement.textContent =
        category.toUpperCase();

      const heading =
        document.createElement(
          "h3"
        );

      heading.textContent =
        title;

      const description =
        document.createElement(
          "p"
        );

      description.className =
        "muted";

      description.textContent =
        text;

      body.appendChild(
        categoryElement
      );

      body.appendChild(
        heading
      );

      body.appendChild(
        description
      );

      card.appendChild(
        poster
      );

      card.appendChild(
        body
      );

      grid.prepend(
        card
      );
    }

    clearAnnouncementForm();

    showNotification(
      "📢 Announcement published successfully!"
    );

  } catch (error) {

    console.error(error);

    showNotification(
      "❌ Connection error. Please try again."
    );
  }
}


/* ==================================================
   CLEAR ANNOUNCEMENT FORM
================================================== */

function clearAnnouncementForm() {

  const title =
    document.getElementById(
      "announcementTitle"
    );

  const text =
    document.getElementById(
      "announcementText"
    );

  if (title) {
    title.value = "";
  }

  if (text) {
    text.value = "";
  }
}


/* ==================================================
   CREATE COMPETITION
================================================== */

function createCompetition() {

  const nameElement =
    document.getElementById(
      "competitionName"
    );

  const deadlineElement =
    document.getElementById(
      "competitionDeadline"
    );

  const typeElement =
    document.getElementById(
      "competitionType"
    );

  if (
    !nameElement ||
    !deadlineElement ||
    !typeElement
  ) {
    return;
  }

  const name =
    nameElement.value.trim();

  const deadline =
    deadlineElement.value;

  const type =
    typeElement.value;

  if (!name || !deadline) {

    alert(
      "Please complete the competition information."
    );

    return;
  }

  const competitions =
    JSON.parse(
      localStorage.getItem(
        "ych-competitions"
      ) || "[]"
    );

  competitions.push({
    name,
    type,
    deadline,
    created:
      new Date().toISOString()
  });

  localStorage.setItem(
    "ych-competitions",
    JSON.stringify(
      competitions
    )
  );

  showNotification(
    "🏆 Competition created successfully!"
  );

  nameElement.value =
    "";

  deadlineElement.value =
    "";
}


/* ==================================================
   REAL GEMINI AI
   FRONTEND → /api/ai → VERCEL → GEMINI
================================================== */

let aiBusy = false;

async function sendChat() {
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");

  if (!input || !messages) return;

  if (aiBusy) return;

  const text = input.value.trim();

  if (!text) return;

  aiBusy = true;

  /* =========================
     USER MESSAGE
  ========================= */

  const userMessage = document.createElement("div");
  userMessage.className = "message mine";

  const userLabel = document.createElement("small");
  userLabel.textContent = "You";

  const userContent = document.createElement("div");
  userContent.textContent = text;

  userMessage.appendChild(userLabel);
  userMessage.appendChild(userContent);

  messages.appendChild(userMessage);

  input.value = "";
  messages.scrollTop = messages.scrollHeight;


  /* =========================
     AI MESSAGE
  ========================= */

  const aiMessage = document.createElement("div");
  aiMessage.className = "message";

  const aiLabel = document.createElement("small");
  aiLabel.textContent = "Youth Caring Heart AI";

  const aiContent = document.createElement("div");
  aiContent.textContent = "Typing...";

  aiMessage.appendChild(aiLabel);
  aiMessage.appendChild(aiContent);

  messages.appendChild(aiMessage);

  messages.scrollTop = messages.scrollHeight;


  /* =========================
     CALL VERCEL API
  ========================= */

  try {
    const response = await fetch("/api/ai", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json().catch(() => null);

    console.log("AI API status:", response.status);
    console.log("AI API response:", data);

    if (response.ok && data && data.reply) {

      aiContent.textContent = data.reply;

    } else if (data && data.error) {

      aiContent.textContent =
        "❌ AI Error: " + data.error;

    } else {

      aiContent.textContent =
        "❌ AI request failed. Check Vercel Logs.";

    }

  } catch (error) {

    console.error("AI connection error:", error);

    aiContent.textContent =
      "❌ Cannot connect to /api/ai.";

  } finally {

    aiBusy = false;

  }

  messages.scrollTop = messages.scrollHeight;
}


/* ==================================================
   CHANNELS
================================================== */

document
  .querySelectorAll(".channel")
  .forEach(channel => {

    channel.addEventListener(
      "click",
      function() {

        document
          .querySelectorAll(
            ".channel"
          )
          .forEach(item => {

            item.classList.remove(
              "active"
            );

          });

        this.classList.add(
          "active"
        );

        const chatHeader =
          document.querySelector(
            ".chat-header"
          );

        if (chatHeader) {

          const channelName =
            this.textContent.trim();

          chatHeader.textContent =
            channelName;

          const members =
            document.createElement(
              "span"
            );

          members.textContent =
            "24 members";

          chatHeader.appendChild(
            members
          );
        }
      }
    );
  });


/* ==================================================
   ADMIN LOGIN
   FRONTEND → /api/admin/login
================================================== */

async function loginAdmin(event) {

  event.preventDefault();

  const form =
    document.getElementById(
      "adminLoginForm"
    );

  const codeInput =
    document.getElementById(
      "adminCode"
    );

  const message =
    document.getElementById(
      "adminLoginMessage"
    );

  const adminPanel =
    document.getElementById(
      "adminPanel"
    );

  if (
    !codeInput ||
    !adminPanel
  ) {
    return;
  }

  const code =
    codeInput.value.trim();

  if (!code) {

    if (message) {
      message.textContent =
        "Please enter the admin code.";
    }

    return;
  }

  if (message) {
    message.textContent =
      "Checking...";
  }

  try {

    const response =
      await fetch(
        "/api/admin/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            code
          })
        }
      );

    const data =
      await response.json()
        .catch(() => ({}));

    if (
      response.ok &&
      data.success === true
    ) {

      sessionStorage.setItem(
        "ych-admin",
        "true"
      );

      if (form) {
        form.classList.add(
          "hidden"
        );
      }

      adminPanel.classList.remove(
        "hidden"
      );

      if (message) {
        message.textContent =
          "";
      }

      showNotification(
        "👑 Admin access granted!"
      );

    } else {

      if (message) {
        message.textContent =
          data.error ||
          "❌ Invalid admin code.";
      }

      codeInput.value =
        "";

    }

  } catch (error) {

    console.error(
      "Admin login error:",
      error
    );

    if (message) {
      message.textContent =
        "❌ Connection error. Please try again.";
    }
  }
}


/* ==================================================
   ADMIN LOGOUT
================================================== */

function logoutAdmin() {

  sessionStorage.removeItem(
    "ych-admin"
  );

  const form =
    document.getElementById(
      "adminLoginForm"
    );

  const adminPanel =
    document.getElementById(
      "adminPanel"
    );

  if (form) {
    form.classList.remove(
      "hidden"
    );
  }

  if (adminPanel) {
    adminPanel.classList.add(
      "hidden"
    );
  }

  const codeInput =
    document.getElementById(
      "adminCode"
    );

  if (codeInput) {
    codeInput.value =
      "";
  }
}


/* ==================================================
   RESTORE ADMIN SESSION
================================================== */

function restoreAdminSession() {

  const isAdmin =
    sessionStorage.getItem(
      "ych-admin"
    ) === "true";

  const form =
    document.getElementById(
      "adminLoginForm"
    );

  const adminPanel =
    document.getElementById(
      "adminPanel"
    );

  if (!form || !adminPanel) {
    return;
  }

  if (isAdmin) {

    form.classList.add(
      "hidden"
    );

    adminPanel.classList.remove(
      "hidden"
    );
  }
}

restoreAdminSession();


/* ==================================================
   NOTIFICATION SYSTEM
================================================== */

function showNotification(message) {

  const notification =
    document.createElement(
      "div"
    );

  notification.textContent =
    message;

  Object.assign(
    notification.style,
    {
      position: "fixed",
      bottom: "25px",
      right: "25px",
      zIndex: "5000",
      background: "#173f2a",
      color: "white",
      padding: "14px 20px",
      borderRadius: "14px",
      fontWeight: "800",
      boxShadow:
        "0 10px 30px rgba(0,0,0,.2)"
    }
  );

  document.body.appendChild(
    notification
  );

  setTimeout(() => {

    notification.remove();

  }, 3000);
}


/* ==================================================
   DEADLINE WARNING
================================================== */

function checkDeadlines() {

  document
    .querySelectorAll(
      ".countdown"
    )
    .forEach(counter => {

      const date =
        counter.dataset.date;

      if (!date) {
        return;
      }

      const target =
        new Date(date).getTime();

      const remaining =
        target - Date.now();

      if (
        remaining > 0 &&
        remaining <=
          1000 * 60 * 60 * 24
      ) {

        const competition =
          counter.closest(
            ".competition"
          );

        if (competition) {

          competition.dataset.warning =
            "true";
        }
      }
    });
}

checkDeadlines();

setInterval(
  checkDeadlines,
  60000
);


/* ==================================================
   CLEANUP
================================================== */

window.addEventListener(
  "beforeunload",
  () => {

    document.body.style.overflow =
      "";
  }
);


console.log(
  "❤️ Youth Caring Heart platform loaded successfully."
);
