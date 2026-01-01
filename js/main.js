/* =====================================================
   COMIAL PRO — MAIN (INDEX NÃO MUDA)
   ===================================================== */

/* ---------- HELPERS ---------- */
function clamp(v,min,max){return Math.min(max,Math.max(min,v))}

/* curva orgânica */
function ease(x){
  return x < .5
    ? 2 * x * x
    : 1 - Math.pow(-2 * x + 2, 2) / 2
}

/* HEX → RGB */
function hexToRgb(hex){
  hex = hex.replace('#','')
  if(hex.length === 3){
    hex = hex.split('').map(c=>c+c).join('')
  }
  const num = parseInt(hex,16)
  return {
    r:(num>>16)&255,
    g:(num>>8)&255,
    b:num&255
  }
}

/* RGB → HEX */
function rgbToHex(r,g,b){
  return '#'+[r,g,b].map(x=>{
    const h=x.toString(16)
    return h.length===1?'0'+h:h
  }).join('')
}

/* gerar 4 cores a partir da cor principal */
function generateFromMainColor(hex){
  const {r,g,b} = hexToRgb(hex)

  return [
    rgbToHex(clamp(r+20,0,255), clamp(g+20,0,255), clamp(b+20,0,255)), // C1 claro
    hex,                                                            // C2 base
    rgbToHex(clamp(r-15,0,255), clamp(g-15,0,255), clamp(b-15,0,255)), // C3 médio
    rgbToHex(clamp(r-40,0,255), clamp(g-40,0,255), clamp(b-40,0,255))  // C4 escuro
  ]
}

/* BPM → VISUAL */
function mapBPM(bpm,preset){
  const n = clamp((bpm-50)/90,0,1)
  const c = ease(n)

  return {
    speed: clamp(preset.baseSpeed - c*preset.speedRange, 0.6, 6),
    glow:  clamp(preset.baseGlow  + c*preset.glowRange,  30, 220)
  }
}

/* ---------- STATE ---------- */
const state = {
  glow: 90,
  speed: 2.8,
  pulse: true,
  obs: false,
  mode: 'hybrid',       // manual | pulsoid | hybrid
  manualInfluence: 0.35,
  preset: 'pastel',
  mainColor: '#00eaff'
}

/* ---------- DOM ---------- */
const root = document.documentElement
const overlay = document.getElementById('overlay')

const mainColorInput = document.querySelector('input[type="color"]')
const glowRange = document.getElementById('glowRange')
const speedRange = document.getElementById('speedRange')
const btnPulse = document.getElementById('btnPulse')
const btnOBS = document.getElementById('btnOBS')

/* ---------- APPLY VISUAL ---------- */
function applyVisual(colors){
  colors.forEach((c,i)=>{
    root.style.setProperty(`--c${i+1}`, c)
  })

  root.style.setProperty('--glow', state.glow + 'px')
  root.style.setProperty('--pulseSpeed', state.speed + 's')

  overlay.classList.toggle('pulse-on', state.pulse)
  document.body.classList.toggle('obs-mode', state.obs)

  localStorage.setItem('comial-pro', JSON.stringify(state))
}

/* ---------- APPLY BPM ---------- */
function applyBPM(){
  if(state.mode === 'manual') return

  const preset = PRESETS[state.preset]
  const bpmVisual = mapBPM(currentBPM, preset)

  if(state.mode === 'pulsoid'){
    state.speed = bpmVisual.speed
    state.glow  = bpmVisual.glow
  }

  if(state.mode === 'hybrid'){
    state.speed =
      state.speed * state.manualInfluence +
      bpmVisual.speed * (1 - state.manualInfluence)

    state.glow =
      state.glow * state.manualInfluence +
      bpmVisual.glow * (1 - state.manualInfluence)
  }
}

/* ---------- LOOP ---------- */
setInterval(()=>{
  applyBPM()
  const colors = generateFromMainColor(state.mainColor)
  applyVisual(colors)
},120)

/* ---------- EVENTS ---------- */
mainColorInput.oninput = e=>{
  state.mainColor = e.target.value
  state.mode = 'manual'
}

glowRange.oninput = e=>{
  state.glow = +e.target.value
  state.mode = 'manual'
}

speedRange.oninput = e=>{
  state.speed = +e.target.value
  state.mode = 'manual'
}

btnPulse.onclick = ()=>{
  state.pulse = !state.pulse
}

btnOBS.onclick = ()=>{
  state.obs = !state.obs
}

/* presets */
document.querySelectorAll('[data-preset]').forEach(btn=>{
  btn.onclick = ()=>{
    state.preset = btn.dataset.preset
    state.mainColor = PRESETS[state.preset].colors[1] // cor base
    mainColorInput.value = state.mainColor
    state.mode = 'manual'
  }
})

/* ---------- LOAD ---------- */
const saved = localStorage.getItem('comial-pro')
if(saved){
  Object.assign(state, JSON.parse(saved))
  mainColorInput.value = state.mainColor
  glowRange.value = state.glow
  speedRange.value = state.speed
}

applyVisual(generateFromMainColor(state.mainColor))
