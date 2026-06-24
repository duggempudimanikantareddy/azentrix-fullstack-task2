// ================================================
//  app.js — Small dot cursor (blue → red on hover)
// ================================================

const dot  = document.createElement("div");
const ring = document.createElement("div");
dot.id  = "cursor-dot";
ring.id = "cursor-ring";
document.body.appendChild(dot);
document.body.appendChild(ring);

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top  = my + "px";
});

(function trailLoop() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + "px";
  ring.style.top  = ry + "px";
  requestAnimationFrame(trailLoop);
})();

// Hover — blue → red
const HOVER = "a, button, .tab-btn, .forecast-card, .city-card, .news-article, input";
document.addEventListener("mouseover", e => {
  if (e.target.closest(HOVER)) {
    dot.classList.add("hover");
    ring.classList.add("hover");
  }
});
document.addEventListener("mouseout", e => {
  if (e.target.closest(HOVER)) {
    dot.classList.remove("hover");
    ring.classList.remove("hover");
  }
});

// Click pop
document.addEventListener("mousedown", () => {
  ring.classList.add("click");
  ring.addEventListener("animationend", () => ring.classList.remove("click"), { once: true });
});

// "/" shortcut
document.addEventListener("keydown", e => {
  if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
    e.preventDefault();
    document.getElementById("cityInput").focus();
  }
});