const preview = document.getElementById('preview');
const cols = [c1,c2,c3,c4,c5,c6];

function updatePreview(){
  const colors = cols.map(c=>c.value);
  const dir = direction.value;
  const sp = speed.value;
  const gl = glow.value;
  const h  = height.value;

  preview.style.height = h+'px';
  preview.style.animationDuration = sp+'s';
  preview.style.boxShadow = `0 0 ${gl}px ${colors[2]}`;
  preview.style.background = `linear-gradient(${dir}, ${colors.join(', ')})`;
}

cols.forEach(el => el.addEventListener('input', updatePreview));
direction.addEventListener('input', updatePreview);
speed.addEventListener('input', updatePreview);
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

updatePreview();

copyCSS.onclick = () => {
  navigator.clipboard.writeText(preview.style.background);
  alert("CSS copied!");
};

downloadPNG.onclick = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = parseInt(height.value);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  const colors = cols.map(x => x.value);
  colors.forEach((col, i) =>
      gradient.addColorStop(i / (colors.length - 1), col)
  );

  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  const a = document.createElement('a');
  a.download = 'neon.png';
  a.href = canvas.toDataURL();
  a.click();
};

function toggleFullscreen(){
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

downloadWEBM.onclick = () => {
  alert("WEBM export coming soon!");
};
