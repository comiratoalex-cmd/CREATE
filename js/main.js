/* =====================================================
   COMIAL PRO — MAIN FINAL
   ===================================================== */

/* ---------- HELPERS ---------- */
function clamp(v,min,max){return Math.min(max,Math.max(min,v))}
function ease(x){
  return x<.5 ? 2*x*x : 1-Math.pow(-2*x+2,2)/2
}

/* ---------- BPM → VISUAL ---------- */
function mapBPM(bpm,preset){
  const n=clamp((bpm-50)/90,0,1)
  const c=ease(n)
  return{
    speed:clamp(preset.baseSpeed - c*preset.speedRange,0.6,6),
    glow:clamp(preset.baseGlow + c*preset.glowRange,30,220)
  }
}

/* ---------- STATE ---------- */
const state={
  glow:90,
  speed:2.8,
  mode:'hybrid', // manual | pulsoid | hybrid
  manualInfluence:.35,
  preset:'pastel',
  pulse:true,
  obs:false
}

/* ---------- DOM ---------- */
const root=document.documentElement
const overlay=document.getElementById('overlay')

const pickers=[c1,c2,c3,c4]
const glowRange=document.getElementById('glowRange')
const speedRange=document.getElementById('speedRange')
const btnOBS=document.getElementById('btnOBS')
const btnGenerate=document.getElementById('btnGenerate')
const promptInput=document.getElementById('prompt')

/* ---------- APPLY VISUAL ---------- */
function applyVisual(){
  pickers.forEach((p,i)=>{
    root.style.setProperty(`--c${i+1}`,p.value)
  })

  root.style.setProperty('--glow',state.glow+'px')
  root.style.setProperty('--pulseSpeed',state.speed+'s')

  overlay.classList.toggle('pulse-on',state.pulse)
  document.body.classList.toggle('obs-mode',state.obs)

  localStorage.setItem('comial-pro',JSON.stringify(state))
}

/* ---------- APPLY BPM ---------- */
function applyBPM(){
  if(state.mode==='manual') return

  const preset=PRESETS[state.preset]
  const bpmVisual=mapBPM(currentBPM,preset)

  if(state.mode==='pulsoid'){
    state.speed=bpmVisual.speed
    state.glow=bpmVisual.glow
  }

  if(state.mode==='hybrid'){
    state.speed=
      state.speed*state.manualInfluence +
      bpmVisual.speed*(1-state.manualInfluence)

    state.glow=
      state.glow*state.manualInfluence +
      bpmVisual.glow*(1-state.manualInfluence)
  }
}

/* ---------- LOOP ---------- */
setInterval(()=>{
  applyBPM()
  applyVisual()
},120)

/* ---------- UI EVENTS ---------- */
pickers.forEach(p=>{
  p.oninput=()=>{
    state.mode='manual'
    applyVisual()
  }
})

glowRange.oninput=e=>{
  state.glow=+e.target.value
  state.mode='manual'
}

speedRange.oninput=e=>{
  state.speed=+e.target.value
  state.mode='manual'
}

document.querySelectorAll('[data-preset]').forEach(btn=>{
  btn.onclick=()=>{
    state.preset=btn.dataset.preset
    PRESETS[state.preset].colors.forEach((c,i)=>pickers[i].value=c)
    state.mode='manual'
  }
})

btnGenerate.onclick=()=>{
  const colors=generatePaletteFromText(promptInput.value)
  colors.forEach((c,i)=>pickers[i].value=c)
  state.mode='manual'
}

btnOBS.onclick=()=>{
  state.obs=!state.obs
}

/* ---------- LOAD ---------- */
const saved=localStorage.getItem('comial-pro')
if(saved) Object.assign(state,JSON.parse(saved))

if(PRESETS[state.preset]){
  PRESETS[state.preset].colors.forEach((c,i)=>pickers[i].value=c)
}

glowRange.value=state.glow
speedRange.value=state.speed

applyVisual()
