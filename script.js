const preview = document.getElementById('preview');
const cols = [c1,c2,c3,c4,c5,c6];

/* ================
   MOVIMENTO SUAVE
   ================ */
let animOffset = 0;

function animateGradient() {
    const speed = parseFloat(speedRange.value) || 6;

    // velocidade suave, contínua
    animOffset += (0.0008 / speed);  

    if (animOffset > 1) animOffset = 0;

    preview.style.backgroundPosition = `${animOffset * 400}% 50%`;

    requestAnimationFrame(animateGradient);
}

/* =======================
   ATUALIZA A APARÊNCIA
   ======================= */
function updatePreview(){
  const colors = cols.map(c => c.value);
  const dir = direction.value;
  const gl = glow.value;
  const h  = height.value;

  preview.style.height = h + 'px';

  preview.style.background = `linear-gradient(${dir}, ${colors.join(', ')})`;
  preview.style.backgroundSize = "400% 400%";

  preview.style.boxShadow = `0 0 ${gl}px ${colors[2]}`;
}

/* EVENTOS */
cols.forEach(el => el.addEventListener('input', updatePreview));
direction.addEventListener('input', updatePreview);
glow.addEventListener('input', updatePreview);
height.addEventListener('input', updatePreview);

preset.addEventListener('change',()=>{
  const sets={
    aurora:['#00ffe7','#0095ff','#7f2bff','#ff4fd8','#ffbd39','#ff5e5e'],
    pastel:['#ffbfd4','#ff9cf4','#c484ff','#8ac6ff','#a8fff1','#fff0b5'],
    cyber:['#ff0062','#c800ff','#5200ff','#00c8ff','#00ffea','#ffea00'],
    pride:['#ff0018','#ffa52c','#ffff41','#008018','#0000f9','#86007d'],
    fog:['#6d7eff','#c95bff','#ff4fab','#ff7361','#ffd16b','#aafff4']
  };

  if(sets[preset.value]) {
    [c1,c2,c3,c4,c5,c6].forEach((c,i)=>c.value = sets[preset.value][i]);
  }
  updatePreview();
});

/* PNG EXPORT */
downloadPNG.onclick = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = parseInt(height.value);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0,0,canvas.width,0);
  const colors = cols.map(x => x.value);
  colors.forEach((col,i) =>
    gradient.addColorStop(i/(colors.length - 1), col)
  );

  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,canvas.height);

  const a = document.createElement('a');
  a.download = 'neon.png';
  a.href = canvas.toDataURL();
  a.click();
};

/* FULLSCREEN */
function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

/* CSS COPY */
copyCSS.onclick = () => {
  navigator.clipboard.writeText(preview.style.background);
  alert("CSS copied!");
};

/* INICIAR */
updatePreview();
animateGradient();
