const preview = document.getElementById("preview");
if (!preview) alert("ERRO: preview não encontrado!");

let animOffset = 0;

// UPDATE PREVIEW
function updatePreview() {
  const c = [
    c1?.value || "#ff6ad5",
    c2?.value || "#b96bff",
    c3?.value || "#6da6ff",
    c4?.value || "#3dfff2",
    c5?.value || "#ffec8a",
    c6?.value || "#ff9e7b"
  ];

  const dir = direction?.value || "90deg";
  const h = height?.value || 20;

  preview.style.height = h + "px";
  preview.style.background = `linear-gradient(${dir}, ${c.join(",")})`;
  preview.style.backgroundSize = "400% 400%";
}

// ANIMATION
function animate() {
  const speed = speedRange?.value || 6;
  animOffset += 0.001 / speed;
  if (animOffset > 1) animOffset = 0;

  preview.style.backgroundPosition = `${animOffset * 400}% 50%`;
  requestAnimationFrame(animate);
}

updatePreview();
animate();

// OBS MODE BUTTON
if (typeof obsMode !== "undefined") {
  obsMode.onclick = () => {
    const base = window.location.origin + window.location.pathname;
    window.open(base + "?obs=1", "_blank");
  };
}

// UPDATE ON INPUT
document.querySelectorAll("input,select").forEach(el => {
  el.addEventListener("input", updatePreview);
});
