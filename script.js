/* ======================================================
   SUPER PRO MAX ENGINE
   Particles + Neon Gradient + RGB Engine + Border 360°
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
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(155, 100, 255, 0.7)";
  particles.forEach(p => {
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
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
};

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

/* -------------------------------
   BORDER TYPE (360°)
--------------------------------*/
function applyBorderType() {
  preview.className = "";

  switch (borderType.value) {
    case "bar":
      preview.style.position = "relative";
      break;

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

/* -------------------------------
   RGB ANIMATED MODES
--------------------------------*/
let rgbTick = 0;

function rgbEngine() {
  rgbTick += 0.01;

  if (rgbMode.value === "rainbow") {
    cols.forEach((c, i) => {
      c.value = `hsl(${(rgbTick * 80 + i * 40) % 360}, 100%, 55%)`;
    });
  }

  if (rgbMode.value === "rainbowFast") {
    cols.forEach((c, i) => {
      c.value = `hsl(${(rgbTick * 160 + i * 60) % 360}, 100%, 55%)`;
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

  if (rgbMode.value !== "off") update();

  requestAnimationFrame(rgbEngine);
}
rgbEngine();

/* -------------------------------
   PULSE EFFECTS
--------------------------------*/
let pulseTick = 0;

function pulseEngine() {
  pulseTick += 0.03;

  if (pulseMode.value === "breath") {
    const g = glow.value * (1 + Math.sin(pulseTick) * 0.4);
    preview.style.boxShadow = `0 0 ${g}px ${cols[2].value}`;
  }

  if (pulseMode.value === "pulse") {
    const g = glow.value * (1 + Math.sin(pulseTick * 2) * 0.7);
    preview.style.boxShadow = `0 0 ${g}px ${cols[3].value}`;
  }

  if (pulseMode.value === "wave") {
    const g = glow.value * (1 + Math.sin(pulseTick * 4) * 0.5);
    preview.style.boxShadow = `0 0 ${g}px ${cols[4].value}`;
  }

  requestAnimationFrame(pulseEngine);
}
pulseEngine();

/* -------------------------------
   MAIN UPDATE
--------------------------------*/
function update() {
  applyBorderType();

  const colors = cols.map(c => c.value);
  const dir = direction.value;
  const h = heightControl.value;
  const g = glow.value;

  preview.style.height = h + "px";
  preview.style.background = `linear-gradient(${dir}, ${colors.join(",")})`;
  preview.style.backgroundSize = "400% 400%";
  preview.style.boxShadow = `0 0 ${g}px ${colors[3]}`;
}

/* -------------------------------
   ANIMATION LOOP
--------------------------------*/
let gradientOffset = 0;

function animateGradient() {
  const speed = parseFloat(speedRange.value);
  gradientOffset += 0.002 * speed;
  if (gradientOffset > 1) gradientOffset = 0;

  preview.style.backgroundPosition = `${gradientOffset * 400}% 50%`;
  requestAnimationFrame(animateGradient);
}
animateGradient();

/* -------------------------------
   PRESETS
--------------------------------*/
const PRESETS = {
  aurora: ["#00ffe7","#0095ff","#7f2bff","#ff4fd8","#ffbd39","#ff5e5e"],
  cyber: ["#ff0062","#c800ff","#5200ff","#00c8ff","#00ffe7","#ffeb00"],
  vapor: ["#ff7edb","#b695ff","#7ad3ff","#8affda","#fff8a6","#ffc3b0"],
  pride: ["#ff0018","#ffa52c","#ffff41","#008018","#0000f9","#86007d"],
  galaxy: ["#120078","#9d0191","#fd3a69","#fecd1a","#00f7ff","#280aef"],
  inferno: ["#ff0000","#ff3b00","#ff8a00","#ffd500","#ff4800","#ff2200"],
  ice: ["#00eaff","#00cfff","#00b4ff","#569dff","#a9d6ff","#ffffff"]
};

preset.addEventListener("change", () => {
  if (PRESETS[preset.value]) {
    PRESETS[preset.value].forEach((color, i) => {
      cols[i].value = color;
    });
  }
  update();
});

/* -------------------------------
   EVENTS
--------------------------------*/
document.querySelectorAll("input,select").forEach(el => {
  el.addEventListener("input", update);
});

/* -------------------------------
   COPY CSS
--------------------------------*/
copyCSS.onclick = () => {
  navigator.clipboard.writeText(preview.style.background);
  alert("Copied!");
};

/* -------------------------------
   PNG EXPORT
--------------------------------*/
downloadPNG.onclick = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = Number(heightControl.value);

  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0,0,canvas.width,0);
  const colors = cols.map(c => c.value);

  colors.forEach((c,i)=>grad.addColorStop(i/colors.length, c));

  ctx.fillStyle = grad;
  ctx.fillRect(0,0,canvas.width, canvas.height);

  const link = document.createElement("a");
  link.download = "neon.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

/* -------------------------------
   WEBM EXPORT (TRANSPARENT)
--------------------------------*/
downloadWEBM.onclick = async () => {

  alert("⚠️ WEBM export is heavy. Recording 5 seconds…");

  const stream = preview.captureStream(60);
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9",
  });

  const chunks = [];
  recorder.ondataavailable = e => chunks.push(e.data);

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "neon.webm";
    a.click();
  };

  recorder.start();

  setTimeout(() => recorder.stop(), 5000);
};

/* -------------------------------
   OBS MODE
--------------------------------*/
obsMode.onclick = () => {
  const base = window.location.origin + window.location.pathname;
  window.open(base + "?obs=1", "_blank");
};

/* -------------------------------
   INIT
--------------------------------*/
update();
