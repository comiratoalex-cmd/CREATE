let pulsoidEnabled = false
let pulsoidMode = 'hybrid' // manual | pulsoid | hybrid
let currentBPM = 72
let pulsoidSocket = null

// 🔁 MOCK automático
setInterval(()=>{
  if(!pulsoidEnabled){
    currentBPM = 60 + Math.sin(Date.now()/800) * 25
  }
},800)

// 🔌 Pulsoid real
function connectPulsoid(token){
  try{
    pulsoidSocket = new WebSocket(
      `wss://dev.pulsoid.net/api/v1/data/heart_rate?access_token=${token}`
    )

    pulsoidSocket.onmessage = e=>{
      const d = JSON.parse(e.data)
      if(d.heart_rate){
        currentBPM = d.heart_rate
      }
    }

    pulsoidSocket.onerror = ()=>{
      pulsoidEnabled = false
    }
  }catch(e){
    pulsoidEnabled = false
  }
}
