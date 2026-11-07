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
/* ---- sfxr-style samples: rendered once into AudioBuffers at init. Layer params: w wave (0 square,1 saw,2 sine,3 noise), f/fe start/end Hz (exp slide), a/s/d attack/sustain/decay s, p punch,
   du duty, ar/at arpeggio factor and time, vd/vs vibrato depth and Hz, lp/lpe lowpass 0..1 start/end, hp highpass 0..1, v volume. Played with ±7% pitch so repeats don't sound identical ---- */
const SR=22050,FX={
 swing:[{w:3,f:1800,fe:400,s:.02,d:.1,lp:.5,lpe:.15,v:.5}],
 heavy:[{w:3,f:600,fe:90,s:.04,d:.28,p:.6,lp:.35,v:.6},{w:2,f:110,fe:45,s:.05,d:.2,v:.55}],
 sling:[{w:3,f:3000,fe:1500,d:.08,hp:.3,v:.7}],
 hit:[{w:3,f:1000,fe:300,s:.01,d:.07,p:.6,lp:.6,v:.55},{w:0,f:220,fe:70,d:.07,v:.16}],
 kill:[{w:3,f:700,fe:60,s:.03,d:.22,p:.4,lp:.4,v:.6},{w:1,f:180,fe:40,d:.18,v:.18}],
 hurt:[{w:1,f:260,fe:70,s:.04,d:.2,p:.3,vd:.12,vs:22,v:.35},{w:3,f:400,fe:100,d:.12,lp:.3,v:.35}],
 dash:[{w:3,f:400,fe:2600,a:.03,s:.04,d:.12,lp:.25,lpe:.8,v:.4}],
 spit:[{w:2,f:260,fe:700,d:.13,vd:.1,vs:30,v:.3},{w:3,f:2000,fe:800,d:.06,lp:.4,v:.15}],
 boom:[{w:3,f:300,fe:30,s:.1,d:.6,p:.7,lp:.3,lpe:.05,v:.5},{w:2,f:80,fe:25,s:.1,d:.5,v:.45}],
 pop:[{w:3,f:400,fe:60,s:.02,d:.18,p:.6,lp:.35,v:.6},{w:2,f:120,fe:40,d:.15,v:.4}],
 spin:[{w:3,f:800,fe:2400,a:.02,s:.12,d:.15,lp:.5,vd:.3,vs:14,v:.35}],
 wood:[{w:3,f:1600,fe:500,d:.1,p:.5,lp:.7,hp:.2,v:.9},{w:0,f:200,fe:90,d:.06,du:.4,v:.14}],
 crash:[{w:3,f:1200,fe:150,s:.05,d:.3,p:.6,lp:.7,lpe:.2,v:.6},{w:0,f:160,fe:60,d:.12,v:.12}],
 zap:[{w:1,f:1600,fe:250,d:.1,vd:.4,vs:60,v:.14},{w:3,f:9000,d:.1,hp:.5,v:.25}],
 ignite:[{w:3,f:900,fe:300,a:.03,s:.05,d:.2,lp:.3,v:.4}],
 coin:[{w:0,f:988,ar:1.5,at:.05,s:.06,d:.15,v:.16}],
 ui:[{w:0,f:720,d:.05,v:.09}],
 heal:[{w:2,f:520,fe:1000,a:.02,s:.05,d:.2,vd:.05,vs:12,v:.25}]};
let FXB={};
function fxRender(L){const n=Math.ceil(Math.max(...L.map(l=>(l.a||0)+(l.s||0)+(l.d||.1)))*SR)+1,out=new Float32Array(n);
  for(const l of L){const a=l.a||0,su=l.s||0,de=l.d||.1,T=a+su+de,fe=l.fe||l.f,du=l.du||.5;let ph=0,nz=0,lo=0,hi=0,prev=0;
    for(let i=0;i<T*SR;i++){const t=i/SR;let fr=l.f*Math.pow(fe/l.f,t/T);if(l.ar&&t>l.at)fr*=l.ar;if(l.vd)fr*=1+l.vd*Math.sin(6.283*l.vs*t);
      const p0=ph;ph=(ph+fr/SR)%1;let x;if(l.w===0)x=ph<du?1:-1;else if(l.w===1)x=1-2*ph;else if(l.w===2)x=Math.sin(6.283*ph);else{if(ph<p0)nz=Math.random()*2-1;x=nz;}
      if(l.lp!=null){const c=l.lp+((l.lpe!=null?l.lpe:l.lp)-l.lp)*t/T;lo+=(x-lo)*c*c;x=lo;}if(l.hp){hi=l.hp*(hi+x-prev);prev=x;x=hi;}
      const e=t<a?t/a:t<a+su?1+(l.p||0)*(1-(t-a)/Math.max(su,.001)):Math.max(0,1-(t-a-su)/de);out[i]+=x*e*l.v;}}
  const b=AC.createBuffer(1,n,SR);b.copyToChannel?b.copyToChannel(out,0):b.getChannelData(0).set(out);return b;}
function fxPlay(k){const b=FXB[k]||(FXB[k]=fxRender(FX[k])),s=AC.createBufferSource();s.buffer=b;s.playbackRate.value=R(.93,1.07);s.connect(master);s.start();}
// melodic cues stay on the synth
const SFX={
 pick:r=>{if(r===3)[523,659,784,1047].forEach((f,i)=>tone(f,.3,'triangle',.14,0,i*.08));else{const b=[440,520,660][r];tone(b,.1,'triangle',.14);if(r>=1)tone(b*1.5,.14,'triangle',.11,0,.07);}},
 lvl:()=>[392,494,587,784].forEach((f,i)=>tone(f,.32,'triangle',.12,0,i*.07)),horn:()=>{tone(98,1.3,'sawtooth',.1,92);tone(147,1.3,'sawtooth',.05,139);},beat:()=>{tone(55,.12,'sine',.35,40);tone(50,.12,'sine',.25,36,.16);},legend:()=>{[523,659,784,1047,1319].forEach((f,i)=>tone(f,.6,'triangle',.1,0,i*.09));noise(.6,4000,1,.08,'highpass');},
 bell:()=>{tone(1320,.25,'triangle',.08);tone(1760,.3,'triangle',.06,0,.08);},
 win:()=>[262,330,392,523,659].forEach((f,i)=>tone(f,.5,'triangle',.12,0,i*.12))};
function sfx(n,a){if(!AC||S.mute)return;if(n==='hit'||n==='pop'||n==='wood'||n==='zap'||n==='ignite'){const now=performance.now();if(now-lastHit<45)return;lastHit=now;}try{if(FX[n])fxPlay(n);else SFX[n](a);}catch(e){}}
function setMute(m){S.mute=m;save();if(master)master.gain.value=m?0:.5;if(m)stopMusic();else startMusic();}
let mus=null;const CH=[[220,261.6,329.6],[174.6,220,261.6],[261.6,329.6,392],[196,246.9,293.7]];
// progressions and melody scales per district (falls back to CH)
const CHS=[CH,[[196,233.1,293.7],[174.6,207.7,261.6],[155.6,196,233.1],[174.6,220,261.6]],[[146.8,174.6,220],[130.8,164.8,196],[110,130.8,164.8],[116.5,146.8,174.6]],[[220,277.2,329.6],[246.9,293.7,370],[196,246.9,293.7],[220,277.2,329.6]],
 [[164.8,196,246.9],[146.8,185,220],[130.8,164.8,196],[146.8,174.6,220]],[[261.6,311.1,392],[233.1,293.7,349.2],[207.7,261.6,311.1],[196,246.9,293.7]],[[110,138.6,164.8],[123.5,146.8,185],[98,123.5,146.8],[110,130.8,164.8]],[[130.8,155.6,196],[116.5,146.8,174.6],[103.8,130.8,155.6],[98,123.5,146.8]]];
const MEL=[[440,523.3,587.3,659.3,784],[392,466.2,523.3,587.3,698.5],[293.7,349.2,392,440,523.3],[440,493.9,554.4,659.3,740],[329.6,392,440,493.9,587.3],[523.3,622.3,698.5,784,932.3],[220,261.6,293.7,329.6,392],[261.6,311.1,349.2,392,466.2]];
function startMusic(){if(!AC||mus||S.mute||!S.music)return;const g=AC.createGain(),f=AC.createBiquadFilter();g.gain.value=0;g.gain.linearRampToValueAtTime(.06,AC.currentTime+4);f.type='lowpass';f.frequency.value=650;f.connect(g);g.connect(master);mus={g,f,i:0};chord();mus.iv=setInterval(chord,8000);}
function chord(){if(!mus||!AC)return;const t=AC.currentTime,di=typeof D!=='undefined'?D.i:0,c=(CHS[di]||CH)[mus.i++%4];
  if(run&&run.boss&&!S.mute)for(let i=0;i<16;i++){tone(58,.18,'sine',.22,34,i*.5);tone(6000,.03,'square',.012,null,i*.5+.25);}
  c.forEach(fr=>[-5,5].forEach(dt=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';o.frequency.value=fr/2;o.detune.value=dt;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.1,t+2.5);g.gain.linearRampToValueAtTime(0,t+8.4);o.connect(g);g.connect(mus.f);o.start(t);o.stop(t+8.6);}));
  for(let k=0;k<3;k++)if(Math.random()<.6){const n=pick(MEL[di]||MEL[0]),tt=t+1+k*2.4+Math.random(),o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=n;g.gain.setValueAtTime(0,tt);g.gain.linearRampToValueAtTime(.045,tt+.02);g.gain.exponentialRampToValueAtTime(.0001,tt+1.8);o.connect(g);g.connect(mus.g);o.start(tt);o.stop(tt+1.9);}}
function stopMusic(){if(!mus)return;clearInterval(mus.iv);try{mus.g.gain.cancelScheduledValues(AC.currentTime);mus.g.gain.setValueAtTime(mus.g.gain.value,AC.currentTime);mus.g.gain.linearRampToValueAtTime(0,AC.currentTime+1);}catch(e){}mus=null;}
function setEco(v){S.eco=v;save();resize();}
