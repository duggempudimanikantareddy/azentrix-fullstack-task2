// ================================================
//  news.js  —  GNews fetch + category filter
// ================================================
import { CONFIG } from "../utils/config.js";

const categoryTabs = document.getElementById("categoryTabs");
const newsFeed     = document.getElementById("newsFeed");
const newsSkeleton = document.getElementById("newsSkeleton");
const newsEmpty    = document.getElementById("newsEmpty");
const newsError    = document.getElementById("newsError");
const newsErrorMsg = document.getElementById("newsErrorMsg");

let activeCategory = CONFIG.DEFAULT_NEWS_CATEGORY;

function showSkeleton() {
  newsSkeleton.classList.remove("hidden");
  newsFeed.innerHTML = "";
  newsEmpty.classList.add("hidden");
  newsError.classList.add("hidden");
}
function showFeed()  {
  newsSkeleton.classList.add("hidden");
  newsEmpty.classList.add("hidden");
  newsError.classList.add("hidden");
}
function showEmpty() {
  newsSkeleton.classList.add("hidden");
  newsFeed.innerHTML = "";
  newsEmpty.classList.remove("hidden");
  newsError.classList.add("hidden");
}
function showError(msg) {
  newsSkeleton.classList.add("hidden");
  newsFeed.innerHTML = "";
  newsEmpty.classList.add("hidden");
  newsError.classList.remove("hidden");
  newsErrorMsg.textContent = msg;
}

function timeAgo(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function esc(str) {
  return String(str)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

async function fetchNews(category) {
  const url = `${CONFIG.GNEWS_BASE_URL}/top-headlines?category=${category}&lang=en&max=${CONFIG.NEWS_PAGE_SIZE}&apikey=${CONFIG.GNEWS_API_KEY}`;
  const res = await fetch(url);
  if (res.status === 403 || res.status === 401) throw new Error("Invalid GNews API key. Check config.js → GNEWS_API_KEY");
  if (res.status === 429)                        throw new Error("Rate limit reached (100 req/day on free tier).");
  if (!res.ok)                                   throw new Error("News service error. Try again.");
  const data = await res.json();
  return data.articles || [];
}

function renderArticle(article, i) {
  const a = document.createElement("a");
  a.className = "news-article";
  a.href      = article.url;
  a.target    = "_blank";
  a.rel       = "noopener noreferrer";
  a.style.animationDelay = `${i * 0.04}s`;

  const source = article.source?.name || "Unknown";
  const time   = article.publishedAt ? timeAgo(article.publishedAt) : "";

  a.innerHTML = `
    <div class="n-num">${i + 1}</div>
    <div class="n-body">
      <div class="n-title">${esc(article.title || "No title")}</div>
      <div class="n-meta">
        <span class="n-source">${esc(source)}</span>
        <span class="n-dot"></span>
        <span class="n-time">${time}</span>
      </div>
    </div>
    <span class="n-arrow">↗</span>
  `;
  return a;
}

async function loadNews(category) {
  activeCategory = category;
  showSkeleton();
  try {
    const articles = await fetchNews(category);
    if (!articles.length) { showEmpty(); return; }
    showFeed();
    newsFeed.innerHTML = "";
    articles.forEach((a, i) => newsFeed.appendChild(renderArticle(a, i)));
  } catch (err) {
    showError(err.message);
  }
}

// Tab clicks
categoryTabs.addEventListener("click", e => {
  const btn = e.target.closest(".tab-btn");
  if (!btn) return;
  categoryTabs.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  loadNews(btn.dataset.category);
});

// Auto-load
loadNews(CONFIG.DEFAULT_NEWS_CATEGORY);
export { loadNews };
