/* ======================================================
   SUPER PRO MAX — FULL JAVASCRIPT ENGINE
   Particles • Neon • OBS Link • RGB • Presets
====================================================== */

/* -------------------------------
   PARTICLE BACKGROUND
--------------------------------*/
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resizeParticles() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeParticles();
window.onresize = resizeParticles;

const particles = [];
for (let i = 0; i < 70; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(155, 100, 255, 0.7)";
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* -------------------------------
   ELEMENTS
--------------------------------*/
const preview = document.getElementById("preview");

const cols = [c1, c2, c3, c4, c5, c6];

const speedRange = document.getElementById("speedRange");
const direction = document.getElementById("direction");
const heightControl = document.getElementById("height");
const glow = document.getElementById("glow");
const preset = document.getElementById("preset");
const rgbMode = document.getElementById("rgbMode");
const borderType = document.getElementById("borderType");
const pulseMode = document.getElementById("pulseMode");

const obsMode = document.getElementById("obsMode");
const downloadPNG = document.getElementById("downloadPNG");
const downloadWEBM = document.getElementById("downloadWEBM");
const copyCSS = document.getElementById("copyCSS");
const copyOBSLink = document.getElementById("copyOBSLink");
const obsLinkField = document.getElementById("obsLink");
const themeToggle = document.getElementById("themeToggle");

const sidebar = document.getElementById("sidebar");
const collapseBtn = document.getElementById("collapseBtn");

/* -------------------------------
   COLLAPSIBLE PANEL
--------------------------------*/
collapseBtn.onclick = () => {
  sidebar.classList.toggle("collapsed");
};

/* -------------------------------
   THEME MODE
--------------------------------*/
themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
};

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

/* ======================================================
   OBS LINK GENERATOR
====================================================== */
function generateOBSLink() {
  const base = window.location.origin + window.location.pathname;

  const params = new URLSearchParams({
    obs: "1",
    c1: c1.value,
    c2: c2.value,
    c3: c3.value,
    c4: c4.value,
    c5: c5.value,
    c6: c6.value,
    speed: speedRange.value,
    glow: glow.value,
    height: heightControl.value,
    direction: direction.value,
    rgbMode: rgbMode.value,
    pulseMode: pulseMode.value,
    borderType: borderType.value,
    preset: preset.value,
  });

  obsLinkField.value = `${base}?${params.toString()}`;
}
generateOBSLink();

copyOBSLink.onclick = () => {
  navigator.clipboard.writeText(obsLinkField.value);
  alert("OBS link copied!");
};

/* -------------------------------
   APPLY PARAMETERS ON OBS MODE
--------------------------------*/
if (window.location.search.includes("obs=1")) {
  const params = new URLSearchParams(window.location.search);

  const applyParam = (el, key) => {
    if (params.get(key)) el.value = params.get(key);
  };

  applyParam(c1, "c1");
  applyParam(c2, "c2");
  applyParam(c3, "c3");
  applyParam(c4, "c4");
  applyParam(c5, "c5");
  applyParam(c6, "c6");

  applyParam(speedRange, "speed");
  applyParam(glow, "glow");
  applyParam(heightControl, "height");
  applyParam(direction, "direction");
  applyParam(rgbMode, "rgbMode");
  applyParam(pulseMode, "pulseMode");
  applyParam(borderType, "borderType");
  applyParam(preset, "preset");

  update();
  applyBorderType();
}

/* ======================================================
   FIXED & SMOOTH GRADIENT SPEED
====================================================== */
let gradientOffset = 0;
function animateGradient() {
  const speed = parseFloat(speedRange.value) * 0.15;
  gradientOffset += 0.0015 * speed;
  if (gradientOffset > 1) gradientOffset = 0;

  preview.style.backgroundPosition = `${gradientOffset * 400}% 50%`;
  requestAnimationFrame(animateGradient);
}
animateGradient();

/* ======================================================
   PRESETS — includes PASTEL
====================================================== */
const PRESETS = {
  pastel: ["#FFB7E6", "#E7C6FF", "#C9E6FF", "#B1FFF0", "#FFF6A5", "#FFD6BA"],
  aurora: ["#00ffe7", "#0095ff", "#7f2bff", "#ff4fd8", "#ffbd39", "#ff5e5e"],
  cyber: ["#ff0062", "#c800ff", "#5200ff", "#00c8ff", "#00ffe7", "#ffeb00"],
  vapor: ["#ff7edb", "#b695ff", "#7ad3ff", "#8affda", "#fff8a6", "#ffc3b0"],
  pride: ["#ff0018", "#ffa52c", "#ffff41", "#008018", "#0000f9", "#86007d"],
  galaxy: ["#120078", "#9d0191", "#fd3a69", "#fecd1a", "#00f7ff", "#280aef"],
  inferno: ["#ff0000", "#ff3b00", "#ff8a00", "#ffd500", "#ff4800", "#ff2200"],
  ice: ["#00eaff", "#00cfff", "#00b4ff", "#569dff", "#a9d6ff", "#ffffff"],
};

preset.addEventListener("change", () => {
  if (PRESETS[preset.value]) {
    PRESETS[preset.value].forEach((color, i) => {
      cols[i].value = color;
    });
  }
  update();
  generateOBSLink();
});

/* ======================================================
   RGB MODES — NEW ULTRA SLOW + FIRESTORM
====================================================== */
let rgbTick = 0;

function rgbEngine() {
  rgbTick += 0.007;

  if (rgbMode.value === "rainbow") {
    cols.forEach((c, i) => {
      c.value = `hsl(${(rgbTick * 80 + i * 40) % 360}, 100%, 55%)`;
    });
  }

  if (rgbMode.value === "rainbowFast") {
    cols.forEach((c, i) => {
      c.value = `hsl(${(rgbTick * 180 + i * 50) % 360}, 100%, 55%)`;
    });
  }

  if (rgbMode.value === "gamer") {
    cols.forEach((c, i) => {
      c.value = `hsl(${(rgbTick * 300 + i * 30) % 360}, 100%, 50%)`;
    });
  }

  if (rgbMode.value === "aurora") {
    cols.forEach((c, i) => {
      c.value = `hsl(${(Math.sin(rgbTick + i) * 80 + 200) % 360}, 90%, 60%)`;
    });
  }

  if (rgbMode.value === "ultraSlow") {
    cols.forEach((c, i) => {
      c.value = `hsl(${(rgbTick * 20 + i * 25) % 360}, 100%, 60%)`;
    });
  }

  if (rgbMode.value === "firestorm") {
    cols.forEach((c, i) => {
      c.value = `hsl(${(rgbTick * 500 + i * 80) % 360}, 100%, ${
        40 + Math.sin(rgbTick * 8) * 20
      }%)`;
    });
  }

  if (rgbMode.value !== "off") {
    update();
    generateOBSLink();
  }

  requestAnimationFrame(rgbEngine);
}
rgbEngine();

/* ======================================================
   PULSE EFFECTS — Soft Waves / Double Glow
====================================================== */
let pulseTick = 0;

function pulseEngine() {
  pulseTick += 0.03;

  if (pulseMode.value === "softwaves") {
    const g = glow.value * (1 + Math.sin(pulseTick * 0.8) * 0.3);
    preview.style.boxShadow = `0 0 ${g}px ${cols[1].value}`;
  }

  if (pulseMode.value === "doubleglow") {
    const g1 = glow.value * (1 + Math.sin(pulseTick * 2) * 0.4);
    const g2 = glow.value * (1 + Math.cos(pulseTick * 3) * 0.3);

    preview.style.boxShadow = `
      0 0 ${g1}px ${cols[2].value},
      0 0 ${g2}px ${cols[4].value}
    `;
  }

  requestAnimationFrame(pulseEngine);
}
pulseEngine();

/* ======================================================
   UPDATE PREVIEW
====================================================== */
function update() {
  applyBorderType();
  generateOBSLink();

  const colors = cols.map((c) => c.value);
  const dir = direction.value;
  const h = heightControl.value;
  const g = glow.value;

  preview.style.height = h + "px";
  preview.style.background = `linear-gradient(${dir}, ${colors.join(",")})`;
  preview.style.backgroundSize = "400% 400%";
  preview.style.boxShadow = `0 0 ${g}px ${colors[3]}`;
}

/* ======================================================
   BORDERS 360°
====================================================== */
function applyBorderType() {
  preview.className = "";

  switch (borderType.value) {
    case "top":
      preview.classList.add("top");
      break;
    case "bottom":
      preview.classList.add("bottom");
      break;
    case "left":
      preview.classList.add("left");
      break;
    case "right":
      preview.classList.add("right");
      break;
    case "fullframe":
      preview.classList.add("fullframe");
      break;
  }
}

/* ======================================================
   EVENT LISTENERS
====================================================== */
document
  .querySelectorAll("input,select")
  .forEach((el) => el.addEventListener("input", update));

document
  .querySelectorAll("input,select")
  .forEach((el) => el.addEventListener("input", generateOBSLink));

/* ======================================================
   PNG EXPORT
====================================================== */
downloadPNG.onclick = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = Number(heightControl.value);

  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  const colors = cols.map((c) => c.value);

  colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.height);

  const a = document.createElement("a");
  a.download = "neon.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
};

/* ======================================================
   WEBM EXPORT (REAL)
====================================================== */
downloadWEBM.onclick = async () => {
  alert("Recording 4 seconds…");

  const stream = preview.captureStream(60);
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9",
  });

  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);

  recorder
