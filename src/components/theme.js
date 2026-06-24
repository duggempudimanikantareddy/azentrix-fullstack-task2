// ================================================
//  theme.js  —  Dark / Light mode + localStorage
// ================================================

const STORAGE_KEY = "wn_theme";
const themeToggle = document.getElementById("themeToggle");
const themeIcon   = document.getElementById("themeIcon");
const themeLabel  = document.getElementById("themeLabel");

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  themeIcon.textContent  = t === "dark" ? "🌙" : "☀️";
  themeLabel.textContent = t === "dark" ? "Dark" : "Light";
}

function toggleTheme() {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
}

applyTheme(localStorage.getItem(STORAGE_KEY) || "dark");
themeToggle.addEventListener("click", toggleTheme);
