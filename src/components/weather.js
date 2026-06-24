// ================================================
//  weather.js  —  Weather + Forecast + Cities
// ================================================
import { CONFIG } from "../utils/config.js";

// ── DOM refs ──────────────────────────────────
const cityInput       = document.getElementById("cityInput");
const searchBtn       = document.getElementById("searchBtn");
const phoneCard       = document.getElementById("phoneCard");
const weatherEmpty    = document.getElementById("weatherEmpty");
const weatherSkeleton = document.getElementById("weatherSkeleton");
const weatherError    = document.getElementById("weatherError");
const weatherErrorMsg = document.getElementById("weatherErrorMsg");
const forecastGrid    = document.getElementById("forecastGrid");
const forecastSkeleton= document.getElementById("forecastSkeleton");
const citiesGrid      = document.getElementById("citiesGrid");

// Phone card fields
const phoneDate       = document.getElementById("phoneDate");
const phoneCityName   = document.getElementById("phoneCityName");
const phoneSub        = document.getElementById("phoneSub");
const phoneTemp       = document.getElementById("phoneTemp");
const phoneIcon       = document.getElementById("phoneIcon");
const statWind        = document.getElementById("statWind");
const statHumidity    = document.getElementById("statHumidity");
const statAQ          = document.getElementById("statAQ");
const chartLeft       = document.getElementById("chartLeft");
const chartRight      = document.getElementById("chartRight");
const chartLabel      = document.getElementById("chartLabel");

// ── Emoji map ─────────────────────────────────
function getEmoji(code) {
  if (code >= 200 && code < 300) return "⛈️";
  if (code >= 300 && code < 400) return "🌦️";
  if (code >= 500 && code < 600) return "🌧️";
  if (code >= 600 && code < 700) return "❄️";
  if (code >= 700 && code < 800) return "🌫️";
  if (code === 800)               return "☀️";
  if (code === 801)               return "🌤️";
  if (code === 802)               return "⛅";
  if (code >= 803)               return "☁️";
  return "🌡️";
}

// Animated SVG weather cursor
const CURSORS = {
  sunny: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>
    <circle cx='20' cy='20' r='8' fill='%23FFD700'/>
    <line x1='20' y1='2'  x2='20' y2='8'  stroke='%23FFD700' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='20' y1='32' x2='20' y2='38' stroke='%23FFD700' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='2'  y1='20' x2='8'  y2='20' stroke='%23FFD700' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='32' y1='20' x2='38' y2='20' stroke='%23FFD700' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='6'  y1='6'  x2='10' y2='10' stroke='%23FFD700' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='30' y1='30' x2='34' y2='34' stroke='%23FFD700' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='34' y1='6'  x2='30' y2='10' stroke='%23FFD700' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='10' y1='30' x2='6'  y2='34' stroke='%23FFD700' stroke-width='2.5' stroke-linecap='round'/>
  </svg>`,
  cloudy: `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='32' viewBox='0 0 44 32'>
    <circle cx='16' cy='18' r='10' fill='%23cdd6f0'/>
    <circle cx='26' cy='14' r='12' fill='%23dde4f8'/>
    <circle cx='34' cy='18' r='8'  fill='%23cdd6f0'/>
    <rect x='6' y='18' width='32' height='10' rx='5' fill='%23cdd6f0'/>
  </svg>`,
  rainy: `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'>
    <circle cx='14' cy='16' r='9'  fill='%23a0aec0'/>
    <circle cx='24' cy='12' r='11' fill='%23b0bec5'/>
    <circle cx='32' cy='16' r='7'  fill='%23a0aec0'/>
    <rect x='6' y='16' width='30' height='9' rx='4' fill='%23a0aec0'/>
    <line x1='13' y1='30' x2='10' y2='40' stroke='%234fc3f7' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='21' y1='30' x2='18' y2='40' stroke='%234fc3f7' stroke-width='2.5' stroke-linecap='round'/>
    <line x1='29' y1='30' x2='26' y2='40' stroke='%234fc3f7' stroke-width='2.5' stroke-linecap='round'/>
  </svg>`,
  snowy: `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'>
    <circle cx='14' cy='16' r='9'  fill='%23cfd8dc'/>
    <circle cx='24' cy='12' r='11' fill='%23eceff1'/>
    <circle cx='32' cy='16' r='7'  fill='%23cfd8dc'/>
    <rect x='6' y='16' width='30' height='9' rx='4' fill='%23cfd8dc'/>
    <text x='10' y='42' font-size='13' fill='%2390caf9'>❄ ❄ ❄</text>
  </svg>`,
  stormy: `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='48' viewBox='0 0 44 48'>
    <circle cx='14' cy='16' r='9'  fill='%23546e7a'/>
    <circle cx='24' cy='12' r='11' fill='%23607d8b'/>
    <circle cx='32' cy='16' r='7'  fill='%23546e7a'/>
    <rect x='6' y='16' width='30' height='9' rx='4' fill='%23546e7a'/>
    <polyline points='24,26 19,36 23,36 18,48' fill='none' stroke='%23FFD700' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/>
  </svg>`,
  misty: `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='32' viewBox='0 0 44 32'>
    <line x1='4'  y1='8'  x2='40' y2='8'  stroke='%23b0bec5' stroke-width='3' stroke-linecap='round'/>
    <line x1='8'  y1='16' x2='36' y2='16' stroke='%23cfd8dc' stroke-width='3' stroke-linecap='round'/>
    <line x1='4'  y1='24' x2='40' y2='24' stroke='%23b0bec5' stroke-width='3' stroke-linecap='round'/>
  </svg>`,
};

function getCursorForCode(code) {
  if (code >= 200 && code < 300) return CURSORS.stormy;
  if (code >= 300 && code < 600) return CURSORS.rainy;
  if (code >= 600 && code < 700) return CURSORS.snowy;
  if (code >= 700 && code < 800) return CURSORS.misty;
  if (code === 800)               return CURSORS.sunny;
  if (code >= 801 && code < 803) return CURSORS.sunny;
  return CURSORS.cloudy;
}

function applyWeatherCursor(code) {
  const svg = getCursorForCode(code);
  const encoded = `data:image/svg+xml,${svg}`;
  document.body.style.cursor = `url("${encoded}") 20 20, auto`;
}

// ── Badge helper ──────────────────────────────
function aqi2badge(aqi) {
  if (!aqi) return { label: "N/A", cls: "badge-blue" };
  if (aqi <= 50)  return { label: `${aqi} Excellent`, cls: "badge-green" };
  if (aqi <= 100) return { label: `${aqi} Good`,      cls: "badge-blue"  };
  if (aqi <= 150) return { label: `${aqi} Moderate`,  cls: "badge-orange"};
  return             { label: `${aqi} Poor`,      cls: "badge-red"   };
}

// ── Day names ─────────────────────────────────
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function fmtDate(ts) {
  const d = new Date(ts * 1000);
  return `${DAYS[d.getDay()]}  ·  ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}
function fmtShortDate(ts) {
  const d = new Date(ts * 1000);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

// ── State helpers ─────────────────────────────
function showSkeleton() {
  weatherSkeleton.classList.remove("hidden");
  phoneCard.classList.add("hidden");
  weatherEmpty.classList.add("hidden");
  weatherError.classList.add("hidden");
  forecastSkeleton && forecastSkeleton.classList.remove("hidden");
  forecastGrid.innerHTML = "";
}
function showCard() {
  weatherSkeleton.classList.add("hidden");
  phoneCard.classList.remove("hidden");
  weatherEmpty.classList.add("hidden");
  forecastSkeleton && forecastSkeleton.classList.add("hidden");
}
function showEmpty() {
  weatherSkeleton.classList.add("hidden");
  phoneCard.classList.add("hidden");
  weatherEmpty.classList.remove("hidden");
  weatherError.classList.add("hidden");
  forecastSkeleton && forecastSkeleton.classList.add("hidden");
}
function showError(msg) {
  weatherSkeleton.classList.add("hidden");
  phoneCard.classList.add("hidden");
  weatherEmpty.classList.add("hidden");
  weatherError.classList.remove("hidden");
  weatherErrorMsg.textContent = msg;
  forecastSkeleton && forecastSkeleton.classList.add("hidden");
}

// ── API calls ─────────────────────────────────
async function fetchCurrent(city) {
  const url = `${CONFIG.OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric`;
  const res = await fetch(url);
  if (res.status === 401) throw new Error("Invalid API key. Check config.js → OPENWEATHER_API_KEY");
  if (res.status === 404) throw new Error(`"${city}" not found. Try a different name.`);
  if (!res.ok)           throw new Error("Weather service error. Try again later.");
  return res.json();
}

async function fetchForecast(city) {
  const url = `${CONFIG.OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric&cnt=32`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

// ── Render phone card ─────────────────────────
function renderCurrent(data) {
  const now = new Date();
  phoneDate.textContent     = `${now.getDate()} ${MONTHS[now.getMonth()]}, ${DAYS[now.getDay()]}  ${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`;
  phoneCityName.textContent = data.name;
  phoneSub.textContent      = `${data.sys.country}  ·  ${data.weather[0].description}`;
  phoneTemp.textContent     = Math.round(data.main.temp);
  phoneIcon.textContent     = getEmoji(data.weather[0].id);
  statWind.textContent      = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  statHumidity.textContent  = `${data.main.humidity}%`;
  statAQ.textContent        = "34";   // AQI needs separate Air Quality API call

  const t = Math.round(data.main.temp);
  const lo = Math.round(data.main.temp_min);
  const hi = Math.round(data.main.temp_max);
  chartLabel.textContent = `${t}°C`;
  chartLeft.textContent  = `${lo}°C`;
  chartRight.textContent = `${hi}°C`;
}

// ── Render 4-day forecast ─────────────────────
function renderForecast(data) {
  if (!data) { forecastGrid.innerHTML = ""; return; }

  // Pick one entry per day (noon ish)
  const seen = {};
  const days = [];
  for (const item of data.list) {
    const d = new Date(item.dt * 1000);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!seen[key]) { seen[key] = true; days.push(item); }
    if (days.length === 5) break;
  }
  // skip today (days[0])
  const forecast = days.slice(1, 5);

  forecastGrid.innerHTML = "";
  forecast.forEach((item, i) => {
    const d    = new Date(item.dt * 1000);
    const dayN = DAYS[d.getDay()];
    const date = fmtShortDate(item.dt);
    const icon = getEmoji(item.weather[0].id);
    const lo   = Math.round(item.main.temp_min);
    const hi   = Math.round(item.main.temp_max);
    const cond = item.weather[0].main.toUpperCase();
    const wind = `${(item.wind.speed * 3.6).toFixed(0)} km/h`;
    const aqiRand = [22, 50, 60, 80][i];
    const { label, cls } = aqi2badge(aqiRand);

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="fc-day">${dayN}</div>
      <div class="fc-date">${date}</div>
      <div class="fc-icon">${icon}</div>
      <div class="fc-range">${lo}~${hi}°C</div>
      <div class="fc-cond">${cond}</div>
      <div class="fc-wind">Wind: &lt;${wind}</div>
      <span class="fc-badge ${cls}">${label}</span>
    `;
    forecastGrid.appendChild(card);
  });
}

// ── Render nearby cities ──────────────────────
const CITY_ICONS = { tornado:"🌪️", rain:"🌧️", cloud:"⛅", sun:"☀️", snow:"❄️", storm:"⛈️", mist:"🌫️", default:"🌤️" };
function cityIcon(code) {
  if (code >= 200 && code < 300) return "⛈️";
  if (code >= 500 && code < 600) return "🌧️";
  if (code >= 600 && code < 700) return "❄️";
  if (code === 800)              return "☀️";
  if (code >= 801)               return "⛅";
  return "🌤️";
}

async function renderCities() {
  citiesGrid.innerHTML = "";
  const promises = CONFIG.NEARBY_CITIES.map(c => fetchCurrent(c).catch(() => null));
  const results  = await Promise.all(promises);

  results.forEach((data, i) => {
    const card = document.createElement("div");
    card.className = "city-card";
    card.style.animationDelay = `${i * 0.08}s`;

    if (!data) {
      card.innerHTML = `<div class="cc-icon">❓</div><div><div class="cc-name">${CONFIG.NEARBY_CITIES[i]}</div><div class="cc-temp">—</div></div>`;
    } else {
      card.innerHTML = `
        <div class="cc-icon">${cityIcon(data.weather[0].id)}</div>
        <div>
          <div class="cc-name">${data.name}</div>
          <div class="cc-temp">${Math.round(data.main.temp)}°C</div>
        </div>
      `;
      card.addEventListener("click", () => {
        cityInput.value = data.name;
        handleSearch();
      });
    }
    citiesGrid.appendChild(card);
  });
}

// ── Main search ───────────────────────────────
async function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) { showError("Please enter a city name."); return; }

  showSkeleton();

  try {
    const [current, forecast] = await Promise.all([
      fetchCurrent(city),
      fetchForecast(city),
    ]);
    renderCurrent(current);
    renderForecast(forecast);
    showCard();
  } catch (err) {
    showError(err.message);
  }
}

// ── Events ────────────────────────────────────
searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keydown", e => { if (e.key === "Enter") handleSearch(); });

// ── Init ──────────────────────────────────────
cityInput.value = CONFIG.DEFAULT_CITY;
handleSearch();
renderCities();

export { handleSearch };
