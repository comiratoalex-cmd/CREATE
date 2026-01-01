const state = {
  neon:'#00eaff',
  glow:80,
  speed:3,

  strokeMin:3,
  strokeMax:6,

  glowMin:0.6,
  glowMax:1.2,

  pulse:true,
  obs:false
};

const root = document.documentElement;
const overlay = document.getElementById('overlay');

const colorPicker = document.getElementById('colorPicker');
const glowRange = document.getElementById('glowRange');
const speedRange = document.getElementById('speedRange');
const btnPulse = document.getElementById('btnPulse');
const btnOBS = document.getElementById('btnOBS');

function apply(){
  root.style.setProperty('--neon',state.neon);
  root.style.setProperty('--glow',state.glow+'px');
  root.style.setProperty('--pulseSpeed',state.speed+'s');

  root.style.setProperty('--strokeMin',state.strokeMin+'px');
  root.style.setProperty('--strokeMax',state.strokeMax+'px');

  root.style.setProperty('--glowMin',state.glowMin);
  root.style.setProperty('--glowMax',state.glowMax);

  overlay.classList.toggle('pulse-on',state.pulse);
  document.body.classList.toggle('obs-mode',state.obs);

  localStorage.setItem('comial-pro',JSON.stringify(state));
}

colorPicker.oninput = e=>{
  state.neon = e.target.value;
  apply();
};

glowRange.oninput = e=>{
  state.glow = e.target.value;
  apply();
};

speedRange.oninput = e=>{
  state.speed = e.target.value;
  apply();
};

btnPulse.onclick = ()=>{
  state.pulse = !state.pulse;
  apply();
};

btnOBS.onclick = ()=>{
  state.obs = !state.obs;
  apply();
};

document.querySelectorAll('[data-preset]').forEach(btn=>{
  btn.onclick = ()=>{
    Object.assign(state, PRESETS[btn.dataset.preset]);
    colorPicker.value = state.neon;
    glowRange.value = state.glow;
    speedRange.value = state.speed;
    apply();
  };
});

const saved = localStorage.getItem('comial-pro');
if(saved) Object.assign(state, JSON.parse(saved));

colorPicker.value = state.neon;
glowRange.value = state.glow;
speedRange.value = state.speed;

apply();
