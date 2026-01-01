
const state = {
  neon:'#9b6cff',
  glow:40,
  pulse:true,
  speed:2.5,
  obs:false
};

const root = document.documentElement;
const overlay = document.getElementById('overlay');

const glowRange = document.getElementById('glowRange');
const pulseSpeed = document.getElementById('pulseSpeed');
const btnPulse = document.getElementById('btnPulse');
const btnAI = document.getElementById('btnAI');
const btnOBS = document.getElementById('btnOBS');

function apply(){
  root.style.setProperty('--neon',state.neon);
  root.style.setProperty('--glow',state.glow+'px');
  root.style.setProperty('--pulseSpeed',state.speed+'s');

  overlay.classList.toggle('pulse-on',state.pulse);
  document.body.classList.toggle('obs-mode',state.obs);

  localStorage.setItem('comial-pro',JSON.stringify(state));
}

glowRange.oninput=e=>{
  state.glow=e.target.value;
  apply();
};

pulseSpeed.oninput=e=>{
  state.speed=e.target.value;
  apply();
};

btnPulse.onclick=()=>{
  state.pulse=!state.pulse;
  apply();
};

btnOBS.onclick=()=>{
  state.obs=!state.obs;
  apply();
};

btnAI.onclick=()=>{
  const colors=['#9b6cff','#00eaff','#ff4ecd','#7cff00','#ffaa00'];
  state.neon=colors[Math.floor(Math.random()*colors.length)];
  apply();
};

document.querySelectorAll('.presets button').forEach(btn=>{
  btn.onclick=()=>{
    const t=btn.dataset.theme;
    if(t==='tokyo') state.neon='#00eaff';
    if(t==='aurora') state.neon='#7cffc7';
    if(t==='pastel') state.neon='#ffb7ff';
    apply();
  };
});

const saved=localStorage.getItem('comial-pro');
if(saved) Object.assign(state,JSON.parse(saved));
apply();
