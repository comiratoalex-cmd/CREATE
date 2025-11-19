/* PREVIEW ELEMENT */
const preview = document.getElementById("preview");

/* COLOR INPUTS */
const cols = [c1, c2, c3, c4, c5, c6];

/* SMOOTH ANIMATION ENGINE */
let animOffset = 0;

function animateGradient() {
  const speed = parseFloat(speedRange.value) || 6;

  // movimento suave contínuo
  animOffset += 0.001 / speed;
  if (animOffset > 1) animOffset = 0;

  preview.style.backgroundPosition = `${animOffset * 400}% 50%`;

  requestAnimationFrame(animateGradient);
}

/* UPDATE FILTERS */
function updateFilters() {
  preview.style.filter = `
    opacity(${opacity.value}%)
    brightness(${brightness.value}%)
    saturate(${saturation.value}%)
    blur(${blur.value}px)
  `;
}

/* UPDATE APPEARANCE */
function updatePreview() {
  const colors = cols.map((c) => c.value);
  const dir = direction.value;
  const gl = glow.value;
  const h = height.value;

  preview.style.height = h + "px";

  preview.style.background = `linear-gradient(${dir}, ${colors.join(", ")})`;

  preview.style.backgroundSize = "400% 400%";
  preview.style.boxShadow = `0 0 ${gl}px ${colors[2]}`;

  updateFilters();
}

/* EVENT LISTENERS */
cols.forEach((el) => el.addEventListener("input", updatePreview));
direction.addEventListener("input", updatePreview);
glow.addEventListener("input", updatePreview);
height.addEventListener("input", updatePreview);
opacity.addEventListener("input", updateFilters);
brightness.addEventListener("input", updateFilters);
saturation.addEventListener("input", updateFilters);
blur.addEventListener("input", updateFilters);

/* PRESET SYSTEM */
preset.addEventListener("change", () => {
  const sets = {
    aurora: ["#00ffe7", "#0095ff", "#7f2bff", "#ff4fd8", "#ffbd39", "#ff5e5e"],
    pastel: ["#ffbfd4", "#ff9cf4", "#c484ff", "#8ac6ff", "#a8fff1", "#fff0b5"],
    cyber: ["#ff0062", "#c800ff", "#5200ff", "#00c8ff", "#00ffea", "#ffea00"],
    pride: ["#ff0018", "#ffa52c", "#ffff41", "#008018", "#0000f9", "#86007d"],
    fog: ["#6d7eff", "#c95bff", "#ff4fab", "#ff7361", "#ffd16b", "#aafff4"],
    vaporwave: ["#ff71ce", "#f4f4f4", "#01cdfe", "#05ffa1", "#b967ff", "#fffb96"],
    galaxy: ["#7f00ff", "#e100ff", "#00c3ff", "#009aff", "#008cff", "#3300ff"],
    inferno: ["#f83600", "#fe8c00", "#ff2200", "#ff0058", "#ff0022", "#ff6b00"],
    ice: ["#00faff", "#00d0ff", "#00aaff", "#2989ff", "#6ecbff", "#ffffff"],
    toxic: ["#39ff14", "#0aff02", "#91ff00", "#ccff00", "#f5ff00", "#ffea00"],
  };

  if (sets[preset.value]) {
    [c1, c2, c3, c4, c5, c6].forEach(
      (c, i) => (c.value = sets[preset.value][i])
    );
  }

  updatePreview();
});

/* PNG EXPORT */
downloadPNG.onclick = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = parseInt(height.value);
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  const colors = cols.map((x) => x.value);
  colors.forEach((col, i) =>
    gradient.addColorStop(i / (colors.length - 1), col)
  );

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.height);

  const a = document.createElement("a");
  a.download = "neon.png";
  a.href = canvas.toDataURL();
  a.click();
};

/* COPY CSS */
copyCSS.onclick = () => {
  navigator.clipboard.writeText(preview.style.background);
  alert("CSS copied!");
};

/* OBS MODE BUTTON */
obsMode.onclick = () => {
  const base = window.location.origin + window.location.pathname;
  window.open(base + "?obs=1", "_blank");
};

/* FULLSCREEN BUTTON */
function toggleFullscreen() {
  if (!document.fullscreenElement)
    document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

/* INITIALIZE */
updatePreview();
animateGradient();
