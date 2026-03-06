const themeBtn = document.getElementById("themeBtn");
const yearEl = document.getElementById("year");
const burger = document.getElementById("burger");
const drawer = document.getElementById("drawer");
const profilePhoto = document.getElementById("profilePhoto");
const photoModal = document.getElementById("photoModal");
const copyEmailLinks = document.querySelectorAll("[data-copy-email]");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

function setThemeIcon() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  themeBtn.textContent = currentTheme === "light" ? "☀" : "☾";
}
setThemeIcon();

themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  setThemeIcon();
});

// Mobile drawer
function toggleDrawer(forceClose = false) {
  const isOpen = drawer.style.display === "flex";
  const open = forceClose ? false : !isOpen;

  drawer.style.display = open ? "flex" : "none";
  drawer.setAttribute("aria-hidden", String(!open));
  burger.setAttribute("aria-expanded", String(open));
}

burger.addEventListener("click", () => toggleDrawer());
drawer.addEventListener("click", () => toggleDrawer(true));

// Profile photo zoom
function openPhotoModal() {
  if (!photoModal) return;
  photoModal.classList.add("open");
  photoModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePhotoModal() {
  if (!photoModal) return;
  photoModal.classList.remove("open");
  photoModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (profilePhoto && photoModal) {
  profilePhoto.addEventListener("click", openPhotoModal);

  photoModal.addEventListener("click", (event) => {
    if (event.target === photoModal) {
      closePhotoModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && photoModal.classList.contains("open")) {
      closePhotoModal();
    }
  });
}

// Copy email only (no mail app opening)
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

copyEmailLinks.forEach((link) => {
  link.addEventListener("click", async (event) => {
    event.preventDefault();
    const email = link.getAttribute("data-copy-email");
    if (!email) return;

    const originalText = link.textContent;

    try {
      await copyText(email);
      link.textContent = "Copied!";
      setTimeout(() => {
        link.textContent = originalText;
      }, 1300);
    } catch {
      link.textContent = "Copy failed";
      setTimeout(() => {
        link.textContent = originalText;
      }, 1300);
    }
  });
});