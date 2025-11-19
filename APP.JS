/* ===============================================================
   APP.JS — NÚCLEO PRINCIPAL DO SISTEMA
================================================================ */

/* ---------------------------------------------------------------
   ELEMENTOS
---------------------------------------------------------------- */
const preview = document.getElementById("preview");
const previewArea = document.getElementById("previewArea");
const pngCanvas = document.getElementById("pngCanvas");

const borderType = document.getElementById("borderType");

const colors = [
  document.getElementById("c1"),
  document.getElementById("c2"),
  document.getElementById("c3"),
  document.getElementById("c4"),
  document.getElementById("c5"),
  document.getElementById("c6"),
];

const presetSelect = document.getElementById("presetSelect");
const rgbMode = document.getElementById("rgbMode");

const speed = document.getElementById("speed");
const glow = document.getElementById("glow");

const pngUpload = document.getElementById("pngUpload");

const collapseBtn = document.getElementById("collapseBtn");
const sidebar = document.getElementById("sidebar");

const obsLinkInput = document.getElementById("obsLink");
const copyObsBtn = document.getElementById("copyObs");
const openOBS = document.getElementById("openOBS");

const toggleTheme = document.getElementById("toggleTheme");
const exportWebm = document.getElementById("exportWebm");

/* ---------------------------------------------------------------
   PAINEL LATERAL (COLLAPSE)
---------------------------------------------------------------- */
collapseBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

/* ---------------------------------------------------------------
   TEMA CLARO/ESCURO
---------------------------------------------------------------- */
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

/* ---------------------------------------------------------------
   GRADIENTE ANIMADO
---------------------------------------------------------------- */
let gradientOffset = 0;

function animateGradient() {
  const spd = Number(speed.value) * 0.15;

  gradientOffset += 0.002 * spd;
  if (gradientOffset > 1) gradientOffset = 0;

  preview.style.backgroundPosition = `${gradientOffset * 400}% 50%`;

  requestAnimationFrame(animateGradient);
}

animateGradient();

/* ---------------------------------------------------------------
   FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO
---------------------------------------------------------------- */
function updateBorder() {
  const cols = colors.map(c => c.value);
  const dir = "90deg";
  const gl = glow.value;

  preview.style.boxShadow = `0 0 ${gl}px ${cols[2]}`;

  // Aplicar gradiente
  preview.style.background = `linear-gradient(${dir}, ${cols.join(",")})`;

  // Aplicar formato
  applyShape(borderType.value);

  // Atualiza link OBS
  generateOBSLink();

  // Atualiza PNG se necessário
  if (borderType.value === "png" && currentPNGSrc) {
    drawPNGBorder(currentPNGSrc);
  }
}

/* ---------------------------------------------------------------
   PRESETS
---------------------------------------------------------------- */
presetSelect.addEventListener("change", () => {
  applyPreset(presetSelect.value);
  updateBorder();
});

/* ---------------------------------------------------------------
   RGB MODE
---------------------------------------------------------------- */
let rgbTick = 0;

function animateRGB() {
  const mode = rgbMode.value;

  rgbTick += 0.007;

  if (mode === "rainbow") {
    colors.forEach((c, i) => {
      c.value = `hsl(${(rgbTick * 200 + i * 40) % 360}, 100%, 55%)`;
    });
  }

  if (mode === "smooth") {
    colors.forEach((c, i) => {
      c.value = `hsl(${(rgbTick * 60 + Math.sin(i + rgbTick) * 80) % 360}, 90%, 60%)`;
    });
  }

  if (mode === "firestorm") {
    colors.forEach((c, i) => {
      c.value = `hsl(${(rgbTick * 300 + i * 80) % 360}, 100%, ${40 + Math.sin(rgbTick * 8) * 20}%)`;
    });
  }

  if (mode === "ultraSlow") {
    colors.forEach((c, i) => {
      c.value = `hsl(${(rgbTick * 10 + i * 30) % 360}, 100%, 65%)`;
    });
  }

  if (mode !== "off") updateBorder();

  requestAnimationFrame(animateRGB);
}

animateRGB();

/* ---------------------------------------------------------------
   PNG UPLOAD
---------------------------------------------------------------- */
let currentPNGSrc = null;

pngUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  currentPNGSrc = url;

  borderType.value = "png";

  drawPNGBorder(url);
});

/* ---------------------------------------------------------------
   GERAR LINK OBS
---------------------------------------------------------------- */
copyObsBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(obsLinkInput.value);
  alert("Link copiado!");
});

openOBS.addEventListener("click", () => {
  window.open(obsLinkInput.value, "_blank");
});

/* ---------------------------------------------------------------
   DETECTAR ALTERAÇÕES DE INPUT
---------------------------------------------------------------- */
document.querySelectorAll("input, select").forEach((el) => {
  el.addEventListener("input", updateBorder);
});

/* ---------------------------------------------------------------
   EXPORTAR WEBM
---------------------------------------------------------------- */
exportWebm.addEventListener("click", async () => {
  alert("Gravando 3 segundos…");

  const stream = previewArea.captureStream(60);
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "border.webm";
    a.click();
  };

  recorder.start();
  setTimeout(() => recorder.stop(), 3000);
});

/* ---------------------------------------------------------------
   INICIALIZAÇÃO
---------------------------------------------------------------- */
updateBorder();
