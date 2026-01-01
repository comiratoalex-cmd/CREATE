function clamp(v,min,max){return Math.min(max,Math.max(min,v))}

// curva suave (ease in/out)
function easeCurve(x){
  return x < 0.5
    ? 2 * x * x
    : 1 - Math.pow(-2 * x + 2, 2) / 2
}

// BPM → visual (orgânico)
function mapBPM(bpm, preset){
  const norm = clamp((bpm - 50) / 90, 0, 1)
  const curve = easeCurve(norm)

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
  }
}
