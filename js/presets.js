/* =========================================================
   COMIAL PRO — MAIN CONTROLLER (FULL)
   ========================================================= */

/* -----------------------------
   HELPERS
----------------------------- */
function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

// curva orgânica (ease in/out)
function easeCurve(x) {
  return x < 0.5
    ? 2 * x * x
    : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

/* -----------------------------
   BPM → VISUAL (ORGÂNICO)
----------------------------- */
function mapBPM(bpm, preset) {
  const norm = clamp((bpm - 50) / 90, 0, 1);
  const curve = easeCurve(norm);

  return {
    speed: clamp(
      preset.baseSpeed - curve * preset.speedRange,
      0.6,
      6
    ),
    glow: clamp(
      preset.baseGlow + curve * preset.glowRange,
      30,
      220
    )
  };
}

/* -----------------------------
   STATE
----------------------------- */
const state = {
  // visual manual
  glow: 90,
  speed: 2.8,

  // modo
  mode: 'manual', // manual | pulsoid | hybrid
  manualInfluence: 0.35,

  // preset ativo
  preset: 'pastel',

  // pulso
  pulse: true,

  // OBS
  obs: false
};

/* -----------------------------
   DOM ELEMENTS
----------------------------- */
const root = document.documentElement;
const overlay = document.getElementById('overlay');

const pickers = [
  document.getElementById('c1'),
  document.getElementById('c2'),
  document.getElementById('c3'),
  document.getElementById('c4')
];

const glowRange = document.getElementById('glowRange');
const speedRange = document.getElementById('speedRange');
const btnOBS = document.getElementById('btnOBS');
const btnGenerate = document.getElementById('btnGenerate');
const promptInput = document.getElementById('prompt');

/* -----------------------------
   PULSOID STATE
----------------------------- */
let pulsoidEnabled = false;
let currentBPM = 72;

/* MOCK BPM (fallback automático) */
setInterval(() => {
  if (!pulsoidEnabled || state.mode === 'manual') {
    currentBPM = 60 + Math.sin(Date.now() / 800) * 25;
  }
}, 800);

/* -----------------------------
   APPLY VISUAL STATE
----------------------------- */
function applyVisual() {
  // cores
  pickers.forEach((p, i) => {
    root.style.setProperty(`--c${i + 1}`, p.value);
  });

  root.style.setProperty('--glow', state.glow + 'px');
  root.style.setProperty('--pulseSpeed', state.speed + 's');

  overlay.classList.toggle('pulse-on', state.pulse);
  document.body.classList.toggle('obs-mode', state.obs);

  localStorage.setItem('comial-pro', JSON.stringify(state));
}

/* -----------------------------
   APPLY BPM (MODOS)
----------------------------- */
function applyBPM() {
  if (state.mode === 'manual') return;

  const preset = PRESETS[state.preset];
  const bpmVisual = mapBPM(currentBPM, preset);

  if (state.mode === 'pulsoid') {
    state.speed = bpmVisual.speed;
    state.glow = bpmVisual.glow;
  }

  if (state.mode === 'hybrid') {
    state.speed =
      state.speed * state.manualInfluence +
      bpmVisual.speed * (1 - state.manualInfluence);

    state.glow =
      state.glow * state.manualInfluence +
      bpmVisual.glow * (1 - state.manualInfluence);
  }
}

/* -----------------------------
   MAIN LOOP (SUAVE)
----------------------------- */
setInterval(() => {
  applyBPM();
  applyVisual();
}, 120);

/* -----------------------------
   UI EVENTS
----------------------------- */

// color pickers
pickers.forEach(p => {
  p.oninput = () => {
    state.mode = 'manual';
    applyVisual();
  };
});

// glow manual
glowRange.oninput = e => {
  state.glow = Number(e.target.value);
  state.mode = 'manual';
  applyVisual();
};

// speed manual
speedRange.oninput = e => {
  state.speed = Number(e.target.value);
  state.mode = 'manual';
  applyVisual();
};

// presets
document.querySelectorAll('[data-preset]').forEach(btn => {
  btn.onclick = () => {
    state.preset = btn.dataset.preset;

    PRESETS[state.preset].colors.forEach((c, i) => {
      pickers[i].value = c;
    });

    state.mode = 'manual';
    applyVisual();
  };
});

// geração por texto
btnGenerate.onclick = () => {
  const colors = generatePaletteFromText(promptInput.value);
  colors.forEach((c, i) => (pickers[i].value = c));
  state.mode = 'manual';
  applyVisual();
};

// OBS MODE
btnOBS.onclick = () => {
  state.obs = !state.obs;
  applyVisual();
};

/* -----------------------------
   LOAD SAVED STATE
----------------------------- */
const saved = localStorage.getItem('comial-pro');
if (saved) {
  Object.assign(state, JSON.parse(saved));
}

// restaurar sliders
glowRange.value = state.glow;
speedRange.value = state.speed;

// restaurar cores do preset
if (PRESETS[state.preset]) {
  PRESETS[state.preset].colors.forEach((c, i) => {
    pickers[i].value = c;
  });
}

applyVisual();

/* =========================================================
   END — COMIAL PRO MAIN
   ========================================================= */
