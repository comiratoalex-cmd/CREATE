const state = {
  neon:'#00eaff',
  glow:60,
  speed:3,
  pulse:true,
  pulseMax:2.4,
  obs:false
};

const root = document.documentElement;
const overlay = document.getElementById('overlay');

const glowRange = document.getElementById('glowRange');
const speedRange = document.getElementById('speedRange');
const btnPulse = document.getElementById('btnPulse');
const btnOBS = document.getElementById('btnOBS');

function apply(){
  root.style.setProperty('--neon',state.neon);
  root.style.setProperty('--glow',state.glow+'px');
  root.style.setProperty('--pulseSpeed',state.speed+'s');
  root.style.setProperty('--pulseMax',state.pulseMax);

  overlay.classList.toggle('pulse-on',state.pulse);
  document.body.classList.toggle('obs-mode',state.obs);

  localStorage.setItem('comial-pro',JSON.stringify(state));
}

glowRange.oninput=e=>{
  state.glow=e.target.value;
  apply();
};

speedRange.oninput=e=>{
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

document.querySelectorAll('[data-preset]').forEach(btn=>{
  btn.onclick=()=>{
    Object.assign(state,PRESETS[btn.dataset.preset]);
    glowRange.value=state.glow;
    speedRange.value=state.speed;
    apply();
  };
});

const saved = localStorage.getItem('comial-pro');
if(saved) Object.assign(state,JSON.parse(saved));

glowRange.value=state.glow;
speedRange.value=state.speed;
apply();
