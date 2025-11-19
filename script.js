/* ----------------------------------
   PARTICLE BACKGROUND 
---------------------------------- */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

const particles = [];
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    dx: (Math.random() - 0.5) * 0.8,
    dy: (Math.random() - 0.5) * 0.8,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(150, 80, 255, 0.7)";
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

/* ----------------------------------
   NEON GENERATOR LOGIC
---------------------------------- */

const preview = document.getElementById("preview");
const cols = [c1, c2, c3, c4, c5, c6];

let offset = 0;

function animateBar() {
  const speed = speedRange.value;
  offset += 0.002 * speed;
  if (offset > 1) offset = 0;

  preview.style.backgroundPosition = `${offset * 400}% 50%`;

  requestAnimationFrame(animateBar);
}

/* UPDATE BAR */
function update() {
  const colors = cols.map(c => c.value);
  const dir = direction.value;
  const glow = glow.value;
  const height = height.value;

  preview.style.height = height + "px";

  preview.style.background = `linear-gradient(${dir}, ${colors.join(",")})`;
  preview.style.boxShadow = `0 0 ${glow}px ${colors[2]}`;
  preview.style.backgroundSize = "400% 400%";
}

/* PRESETS */
preset.addEventListener("change", () => {
  const sets = {
    aurora: ["#00ffe7","#0095ff","#7f2bff","#ff4fd8","#ffbd39","#ff5e5e"],
    cyber: ["#ff0062","#c800ff","#5200ff","#00c8ff","#00ffe7","#ffeb00"],
    vapor: ["#ff7edb","#b695ff","#7ad3ff","#8affda","#fff8a6","#ffc3b0"],
    pride: ["#ff0018","#ffa52c","#ffff41","#008018","#0000f9","#86007d"],
    galaxy: ["#120078","#9d0191","#fd3a69","#fecd1a","#00f7ff","#280aef"],
    inferno: ["#ff0000","#ff3b00","#ff8a00","#ffd500","#ff4800","#ff2200"],
    ice: ["#00eaff","#00cfff","#00b4ff","#569dff","#a9d6ff","#ffffff"]
  };

  if (sets[preset.value]) {
    [c1,c2,c3,c4,c5,c6].forEach((el,i)=>el.value = sets[preset.value][i]);
  }
  update();
});

/* UPDATE ON INPUT */
document.querySelectorAll("input,select")
  .forEach(el => el.addEventListener("input", update));

/* COPY CSS */
copyCSS.onclick = () => {
  navigator.clipboard.writeText(preview.style.background);
  alert("CSS Copied!");
};

/* PNG EXPORT */
downloadPNG.onclick = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = parseInt(height.value);
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0,0,1920,0);
  const colors = cols.map(c=>c.value);

  colors.forEach((c,i)=>grad.addColorStop(i/colors.length, c));

  ctx.fillStyle = grad;
  ctx.fillRect(0,0,1920, canvas.height);

  const a = document.createElement("a");
  a.download = "neon.png";
  a.href = canvas.toDataURL();
  a.click();
};

/* OBS MODE */
obsMode.onclick = () => {
  const base = window.location.origin + window.location.pathname;
  window.open(base + "?obs=1", "_blank");
};

/* INIT */
update();
animateBar();
