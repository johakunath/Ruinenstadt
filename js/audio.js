/* ================= audio ================= */
let AC=null,master=null,noiseBuf=null,lastHit=0;
function initAudio(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=S.mute?0:.5;master.connect(AC.destination);
  noiseBuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const s=AC.createBufferSource();s.buffer=noiseBuf;s.loop=true;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=380;const g=AC.createGain();g.gain.value=.05;
  const lfo=AC.createOscillator();lfo.frequency.value=.13;const lg=AC.createGain();lg.gain.value=.03;lfo.connect(lg);lg.connect(g.gain);s.connect(f);f.connect(g);g.connect(master);s.start();lfo.start();startMusic();}catch(e){AC=null;}}
function noise(dur,freq,q,gain,type,to){const t=AC.currentTime,s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf;f.type=type||'bandpass';f.frequency.setValueAtTime(freq,t);f.Q.value=q;
  if(to)f.frequency.exponentialRampToValueAtTime(to,t+dur);g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(master);s.start(t,Math.random()*.5);s.stop(t+dur+.05);}
function tone(fr,dur,type,gain,to,delay){const t=AC.currentTime+(delay||0),o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(fr,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.05);}
const SFX={swing:()=>noise(.13,2200,1.2,.22,'bandpass',600),heavy:()=>{noise(.28,600,1,.45,'lowpass',120);tone(90,.2,'sine',.2,50);},sling:()=>noise(.09,3000,2,.18,'highpass'),
 hit:()=>{noise(.08,900,1.5,.3);tone(150,.08,'square',.06,70);},kill:()=>noise(.22,500,1,.3,'lowpass',90),hurt:()=>{tone(120,.22,'sawtooth',.15,55);noise(.15,300,1,.3,'lowpass');},
 dash:()=>noise(.2,700,1,.3,'bandpass',3200),spit:()=>tone(260,.14,'sine',.12,620),boom:()=>{tone(64,.6,'sine',.5,28);noise(.55,220,1,.5,'lowpass',50);},
 pop:()=>{noise(.18,300,1,.35,'lowpass',80);tone(80,.15,'sine',.2,40);},spin:()=>noise(.3,1200,2,.2,'bandpass',2600),
 wood:()=>{noise(.12,1400,3,.3,'bandpass',500);tone(180,.06,'square',.05,90);},crash:()=>{noise(.3,900,1,.4,'lowpass',150);tone(140,.12,'square',.06,60);},
 pick:r=>{if(r===3)[523,659,784,1047].forEach((f,i)=>tone(f,.3,'triangle',.14,0,i*.08));else{const b=[440,520,660][r];tone(b,.1,'triangle',.14);if(r>=1)tone(b*1.5,.14,'triangle',.11,0,.07);}},
 lvl:()=>[392,494,587,784].forEach((f,i)=>tone(f,.32,'triangle',.12,0,i*.07)),horn:()=>{tone(98,1.3,'sawtooth',.1,92);tone(147,1.3,'sawtooth',.05,139);},heal:()=>tone(620,.22,'sine',.14,980),
 zap:()=>{tone(1400,.08,'square',.04,300);noise(.1,4000,2,.15,'highpass');},ignite:()=>noise(.25,900,1,.2,'bandpass',300),
 bell:()=>{tone(1320,.25,'triangle',.08);tone(1760,.3,'triangle',.06,0,.08);},
 ui:()=>tone(720,.05,'square',.04),coin:()=>{tone(880,.08,'square',.05);tone(1320,.1,'square',.04,0,.05);},win:()=>[262,330,392,523,659].forEach((f,i)=>tone(f,.5,'triangle',.12,0,i*.12))};
function sfx(n,a){if(!AC||S.mute)return;if(n==='hit'||n==='pop'||n==='wood'||n==='zap'||n==='ignite'){const now=performance.now();if(now-lastHit<45)return;lastHit=now;}try{SFX[n](a);}catch(e){}}
function setMute(m){S.mute=m;save();if(master)master.gain.value=m?0:.5;if(m)stopMusic();else startMusic();}
let mus=null;const CH=[[220,261.6,329.6],[174.6,220,261.6],[261.6,329.6,392],[196,246.9,293.7]];
function startMusic(){if(!AC||mus||S.mute||!S.music)return;const g=AC.createGain(),f=AC.createBiquadFilter();g.gain.value=0;g.gain.linearRampToValueAtTime(.06,AC.currentTime+4);f.type='lowpass';f.frequency.value=650;f.connect(g);g.connect(master);mus={g,f,i:0};chord();mus.iv=setInterval(chord,8000);}
function chord(){if(!mus||!AC)return;const t=AC.currentTime,c=CH[mus.i++%4];
  c.forEach(fr=>[-5,5].forEach(dt=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';o.frequency.value=fr/2;o.detune.value=dt;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.1,t+2.5);g.gain.linearRampToValueAtTime(0,t+8.4);o.connect(g);g.connect(mus.f);o.start(t);o.stop(t+8.6);}));
  for(let k=0;k<3;k++)if(Math.random()<.6){const n=pick([440,523.3,587.3,659.3,784]),tt=t+1+k*2.4+Math.random(),o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=n;g.gain.setValueAtTime(0,tt);g.gain.linearRampToValueAtTime(.045,tt+.02);g.gain.exponentialRampToValueAtTime(.0001,tt+1.8);o.connect(g);g.connect(mus.g);o.start(tt);o.stop(tt+1.9);}}
function stopMusic(){if(!mus)return;clearInterval(mus.iv);try{mus.g.gain.cancelScheduledValues(AC.currentTime);mus.g.gain.setValueAtTime(mus.g.gain.value,AC.currentTime);mus.g.gain.linearRampToValueAtTime(0,AC.currentTime+1);}catch(e){}mus=null;}
function setEco(v){S.eco=v;save();resize();}
