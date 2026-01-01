/* =====================================================
   PULSOID — REAL + FALLBACK
   ===================================================== */

let pulsoidEnabled = false;
let currentBPM = 72;
let pulsoidSocket = null;

/* ===============================
   MOCK BPM (fallback automático)
================================ */
setInterval(()=>{
  if(!pulsoidEnabled){
    currentBPM = 65 + Math.sin(Date.now()/700) * 25;
  }
},700);

/* ===============================
   CONEXÃO REAL COM PULSOID
================================ */
function connectPulsoid(token){
  try{
    pulsoidSocket = new WebSocket(
      `wss://dev.pulsoid.net/api/v1/data/heart_rate?access_token=${token}`
    );

    pulsoidSocket.onmessage = e=>{
      const data = JSON.parse(e.data);
      if(data.heart_rate){
        currentBPM = data.heart_rate;
        pulsoidEnabled = true;
      }
    };

    pulsoidSocket.onerror = ()=>{
      pulsoidEnabled = false;
    };

    pulsoidSocket.onclose = ()=>{
      pulsoidEnabled = false;
    };

  }catch(e){
    pulsoidEnabled = false;
  }
}
