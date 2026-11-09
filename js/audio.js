/* ================= audio ================= */
let AC=null,master=null,rev=null,rvG=null,noiseBuf=null,lastHit=0,SR=44100,musT=0,musI=0;
/* v0.63 sound: everything runs into `master` -> compressor. `rev` is the send into a generated room (convolver, dark 1.6 s tail; louder in the tunnel),
   so hits sit in a space instead of sounding like dry synth blips. Effects are rendered once (three takes each), played with pitch spread, pan and volume. */
function initAudio(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();SR=AC.sampleRate;master=AC.createGain();master.gain.value=S.mute?0:.5;
  const cp=AC.createDynamicsCompressor();cp.threshold.value=-16;cp.knee.value=10;cp.ratio.value=4;cp.attack.value=.004;cp.release.value=.18;master.connect(cp);cp.connect(AC.destination);
  {const n=SR*1.6|0,ir=AC.createBuffer(2,n,SR);for(let c=0;c<2;c++){const d=ir.getChannelData(c);let lo=0;for(let i=0;i<n;i++){const t=i/n;lo+=((Math.random()*2-1)-lo)*(.5*Math.pow(1-t,1.5)+.04);d[i]=lo*Math.pow(1-t,3)*Math.min(1,i/(SR*.006));}}
    const cv=AC.createConvolver();cv.buffer=ir;rev=AC.createGain();rvG=AC.createGain();rvG.gain.value=.45;rev.connect(cv);cv.connect(rvG);rvG.connect(master);}
  noiseBuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const s=AC.createBufferSource();s.buffer=noiseBuf;s.loop=true;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=380;const g=AC.createGain();g.gain.value=.05;
  const lfo=AC.createOscillator();lfo.frequency.value=.13;const lg=AC.createGain();lg.gain.value=.03;lfo.connect(lg);lg.connect(g.gain);s.connect(f);f.connect(g);g.connect(master);s.start();lfo.start();startMusic();
  const ks=Object.keys(FX);let ki=0;const pre=()=>{if(ki<ks.length){fxBuf(ks[ki++]);setTimeout(pre,40);}};setTimeout(pre,300);}catch(e){AC=null;}}// takes are rendered in the background, so the first hit does not stall
function noise(dur,freq,q,gain,type,to,dl){const t=AC.currentTime+(dl||0),s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf;f.type=type||'bandpass';f.frequency.setValueAtTime(freq,t);f.Q.value=q;
  if(to)f.frequency.exponentialRampToValueAtTime(to,t+dur);g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(master);s.start(t,Math.random()*.5);s.stop(t+dur+.05);}
// lp: optional lowpass Hz (brass-like horn instead of a raw saw)
function tone(fr,dur,type,gain,to,delay,lp){const t=AC.currentTime+(delay||0),o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(fr,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+(lp?.08:.012));g.gain.exponentialRampToValueAtTime(.0001,t+dur);if(lp){const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;o.connect(f);f.connect(g);g.connect(rev);}else o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.05);}
// mallet voice for melodic cues: sine with two quieter, faster-dying partials, into the room. Replaces the bare triangle beeps
function mal(fr,dur,gain,delay){const t=AC.currentTime+(delay||0);for(const[m,gn,dc]of[[1,1,1],[2,.3,.5],[4.2,.1,.15]]){const o=AC.createOscillator(),g=AC.createGain(),e=t+dur*dc*1.7;o.frequency.value=fr*m;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain*gn,t+.006);g.gain.exponentialRampToValueAtTime(.0001,e);o.connect(g);g.connect(master);g.connect(rev);o.start(t);o.stop(e+.05);}}
/* ---- effect samples. Layer params: w wave (0 square,1 saw,2 sine,3 filtered noise,4 modal = struck object), f/fe start/end Hz (exp slide), a/s/d attack/sustain/decay s (decay is exponential),
   p punch (extra level in the first 20 ms), dl start delay s, v peak level of the layer. Noise: q resonance, nt:1 lowpass instead of bandpass, am/ams amplitude flutter depth and Hz.
   Modal: m [[freq ratio, decay factor, level],...] of damped partials. Also du duty, ar/at arpeggio, vd/vs vibrato, lp/lpe lowpass 0..1, hp highpass 0..1.
   Recipes: whoosh = swept band noise with a soft attack; impact = low noise thud + sine body drop; metal, wood, glass = modal with inharmonic ratios. No square or saw in impacts. ---- */
const BELL=[[1,1,1],[2.76,.6,.5],[5.4,.3,.25]],CLINK=[[1,1,1],[1.47,.8,.7],[2.09,.6,.5],[2.56,.5,.3]],KNOCK=[[1,1,1],[2.4,.5,.6],[4.1,.3,.3]],FX={
 swing:[{w:3,f:380,fe:1700,a:.05,s:.01,d:.09,q:1.6,v:.5}],
 heavy:[{w:3,f:220,fe:950,a:.07,s:.02,d:.16,q:1.4,v:.6},{w:2,f:95,fe:42,dl:.07,d:.22,v:.5}],
 sling:[{w:3,f:1800,fe:4200,a:.012,d:.07,q:2,v:.5},{w:4,f:430,m:[[1,1,1],[2.01,.6,.4]],d:.05,v:.25}],
 hit:[{w:3,nt:1,f:950,fe:240,d:.06,p:.8,v:.6},{w:2,f:160,fe:58,d:.09,v:.5},{w:3,f:3200,d:.012,q:.8,v:.2}],
 crit:[{w:3,nt:1,f:1300,fe:220,d:.08,p:1,v:.7},{w:2,f:130,fe:45,d:.14,v:.6},{w:4,f:1900,m:BELL,d:.22,v:.22}],
 kill:[{w:3,nt:1,f:1200,fe:110,d:.2,p:.6,v:.6},{w:2,f:120,fe:36,d:.24,v:.55},{w:3,f:2800,fe:1400,dl:.02,d:.06,q:.9,am:.8,ams:70,v:.2}],
 hurt:[{w:3,nt:1,f:520,fe:110,d:.14,p:.6,v:.55},{w:2,f:190,fe:70,s:.03,d:.2,vd:.06,vs:18,v:.45}],
 dash:[{w:3,f:400,fe:2200,a:.035,s:.03,d:.12,q:2,v:.45}],
 spit:[{w:2,f:280,fe:760,d:.11,vd:.1,vs:30,v:.3},{w:3,f:1800,fe:900,d:.07,q:4,v:.3}],
 boom:[{w:3,nt:1,f:420,fe:38,s:.06,d:.8,p:.8,v:.7},{w:2,f:72,fe:26,s:.06,d:.6,v:.6},{w:3,f:2600,fe:900,dl:.03,d:.3,q:.8,am:.9,ams:38,v:.2}],
 pop:[{w:3,nt:1,f:500,fe:70,s:.01,d:.2,p:.7,v:.6},{w:2,f:115,fe:40,d:.16,v:.45}],
 spin:[{w:3,f:600,fe:1700,a:.03,s:.12,d:.15,q:1.8,vd:.3,vs:11,v:.4}],
 wood:[{w:4,f:310,m:KNOCK,d:.07,v:.6},{w:3,f:2200,d:.035,q:.9,p:.5,v:.4}],
 crash:[{w:3,f:3600,fe:1500,d:.24,q:.8,p:.6,v:.5},{w:4,f:880,m:[[1,1,.6],[1.7,.8,.5],[2.9,.6,.4],[4.3,.4,.3]],d:.26,v:.35},{w:3,nt:1,f:600,fe:120,d:.12,v:.45}],
 zap:[{w:3,f:4200,fe:2600,d:.13,q:1,am:1,ams:92,v:.4},{w:2,f:2300,fe:500,d:.05,v:.12}],
 ignite:[{w:3,nt:1,f:280,fe:1300,a:.05,s:.04,d:.3,v:.45}],
 coin:[{w:4,f:2400,m:CLINK,d:.2,v:.22},{w:4,f:3050,m:CLINK,dl:.065,d:.24,v:.2}],
 ui:[{w:4,f:900,m:[[1,1,1],[2,.5,.3]],d:.04,v:.13},{w:3,f:2600,d:.008,q:.8,v:.05}],
 heal:[{w:2,f:520,fe:780,a:.05,s:.05,d:.28,v:.25},{w:4,f:1560,m:[[1,1,1],[1.5,.7,.5]],dl:.08,d:.35,v:.1}]};
let FXB={};
function fxRender(L){const len=l=>(l.dl||0)+(l.a||.002)+(l.s||0)+(l.d||.1)*(l.w===4?1.8:1.3),n=Math.ceil(Math.max(...L.map(len))*SR)+1,out=new Float32Array(n),dt_=R(.97,1.03);
  for(const l of L){const a=l.a||.002,su=l.s||0,de=l.d||.1,T=len(l)-(l.dl||0),fe=l.fe||l.f,du=l.du||.5,o=Math.floor((l.dl||0)*SR),q1=1/(l.q||1.3),N=Math.floor(T*SR),tmp=new Float32Array(N);let ph=0,lo=0,bd=0,lp=0,hi=0,prev=0,pk_=1e-6;
    for(let i=0;i<N;i++){const t=i/SR;let fr=l.f*Math.pow(fe/l.f,Math.min(1,t/(a+su+de)))*dt_;if(l.ar&&t>l.at)fr*=l.ar;if(l.vd)fr*=1+l.vd*Math.sin(6.283*l.vs*t);let x;
      if(l.w===4){x=0;for(const m of l.m)x+=m[2]*Math.sin(6.283*fr*m[0]*t)*Math.exp(-t*5/(de*m[1]));}
      else if(l.w===3){const f1=2*Math.sin(3.1416*Math.min(fr,SR/6.5)/SR);lo+=f1*bd;const h=Math.random()*2-1-lo-q1*bd;bd+=f1*h;x=l.nt?lo:bd;}
      else{ph=(ph+fr/SR)%1;x=l.w===0?(ph<du?1:-1):l.w===1?1-2*ph:Math.sin(6.283*ph);}
      if(l.lp!=null){const c=l.lp+((l.lpe!=null?l.lpe:l.lp)-l.lp)*t/T;lp+=(x-lp)*c*c;x=lp;}if(l.hp){hi=l.hp*(hi+x-prev);prev=x;x=hi;}if(l.am)x*=1-l.am*(.5+.5*Math.sin(6.283*l.ams*t));
      const e=(t<a?t/a:t<a+su||l.w===4?1:Math.exp(-5*(t-a-su)/de))*(1+(l.p||0)*Math.exp(-t*50));x*=e;tmp[i]=x;if(Math.abs(x)>pk_)pk_=Math.abs(x);}
    for(let i=0;i<N&&o+i<n;i++)out[o+i]+=tmp[i]/pk_*l.v;}
  for(let i=0;i<n;i++)out[i]=Math.tanh(out[i]*1.2)*Math.min(1,(n-i)/200);
  const b=AC.createBuffer(1,n,SR);b.copyToChannel?b.copyToChannel(out,0):b.getChannelData(0).set(out);return b;}
const fxBuf=k=>FXB[k]||(FXB[k]=[0,1,2].map(()=>fxRender(FX[k])));
function fxPlay(k,pan,vol){const s=AC.createBufferSource(),g=AC.createGain();s.buffer=pick(fxBuf(k));s.playbackRate.value=R(.94,1.06);g.gain.value=vol||1;let nd=g;if(pan&&AC.createStereoPanner){nd=AC.createStereoPanner();nd.pan.value=pan;g.connect(nd);}s.connect(g);nd.connect(master);nd.connect(rev);s.start();}
// every 0.5 s: room size by place, music follows the fight (musI 0 calm .. 1 crowded or boss): the pad filter opens, chord() adds a low pulse
function audioTick(dt){if(!AC||(musT-=dt)>0)return;musT=.5;const tg=run&&state==='play'?clamp(enemies.length/14+(run.boss?.5:0),0,1):0;musI+=(tg-musI)*.25;rvG.gain.value=D.tun?.85:.45;if(mus)mus.f.frequency.setTargetAtTime(420+musI*800,AC.currentTime,.6);}
// melodic cues stay on the synth
const SFX={
 pick:r=>{if(r===3)[523,659,784,1047].forEach((f,i)=>mal(f,.3,.14,i*.08));else{const b=[440,520,660][r];mal(b,.1,.14);if(r>=1)mal(b*1.5,.14,.11,.07);}},
 lvl:()=>[392,494,587,784].forEach((f,i)=>mal(f,.32,.12,i*.07)),horn:()=>{tone(98,1.5,'sawtooth',.16,92,0,520);tone(147,1.5,'sawtooth',.08,139,0,700);},beat:()=>{tone(55,.12,'sine',.35,40);tone(50,.12,'sine',.25,36,.16);},legend:()=>{[523,659,784,1047,1319].forEach((f,i)=>mal(f,.6,.1,i*.09));noise(.6,4000,1,.08,'highpass');},
 bell:()=>{mal(1320,.25,.08);mal(1760,.3,.06,.08);},
 win:()=>[262,330,392,523,659].forEach((f,i)=>mal(f,.5,.12,i*.12))};
// a: rarity for 'pick', or a world position {x,y} for stereo placement of an effect. v: volume factor
function sfx(n,a,v){if(!AC||S.mute)return;if(n==='hit'||n==='crit'||n==='pop'||n==='wood'||n==='zap'||n==='ignite'){const now=performance.now();if(now-lastHit<45)return;lastHit=now;}try{if(FX[n]){let dv=1;if(a&&a.x!=null){const q=Math.hypot(ix(a.x,a.y)-ix(P.x,P.y),(iy(a.x,a.y)-iy(P.x,P.y))*2);dv=clamp(1-q/650,0,1);dv*=dv;if(dv<.05)return;}fxPlay(n,a&&a.x!=null?clamp((scx(a.x,a.y)-VW/2)/(VW/2),-1,1)*.6:0,(v||1)*dv);}else SFX[n](a);}catch(e){}}
function setMute(m){S.mute=m;save();if(master)master.gain.value=m?0:.5;if(m)stopMusic();else startMusic();}
let mus=null;const CH=[[220,261.6,329.6],[174.6,220,261.6],[261.6,329.6,392],[196,246.9,293.7]];
// progressions and melody scales per district index D.i (falls back to CH). v0.49: Alexanderplatz in C major, a march
const CHS=[CH,[[196,233.1,293.7],[174.6,207.7,261.6],[155.6,196,233.1],[174.6,220,261.6]],[[261.6,329.6,392],[174.6,220,261.6],[196,246.9,293.7],[261.6,329.6,392]],[[146.8,174.6,220],[130.8,164.8,196],[110,130.8,164.8],[116.5,146.8,174.6]],[[220,277.2,329.6],[246.9,293.7,370],[196,246.9,293.7],[220,277.2,329.6]],[[110,138.6,164.8],[123.5,146.8,185],[98,123.5,146.8],[110,130.8,164.8]],[[130.8,155.6,196],[116.5,146.8,174.6],[103.8,130.8,155.6],[98,123.5,146.8]]];
const MEL=[[440,523.3,587.3,659.3,784],[392,466.2,523.3,587.3,698.5],[392,440,523.3,587.3,659.3],[293.7,349.2,392,440,523.3],[440,493.9,554.4,659.3,740],[220,261.6,293.7,329.6,392],[261.6,311.1,349.2,392,466.2]];
function startMusic(){if(!AC||mus||S.mute||!S.music)return;const g=AC.createGain(),f=AC.createBiquadFilter();g.gain.value=0;g.gain.linearRampToValueAtTime(.06,AC.currentTime+4);f.type='lowpass';f.frequency.value=650;f.connect(g);g.connect(master);g.connect(rev);mus={g,f,i:0};chord();mus.iv=setInterval(chord,8000);}
function chord(){if(!mus||!AC)return;const t=AC.currentTime,di=typeof D!=='undefined'?D.i:0,c=(CHS[di]||CH)[mus.i++%4];
  if(run&&run.boss&&!S.mute)for(let i=0;i<16;i++){tone(58,.18,'sine',.22,34,i*.5);noise(.03,7000,1,.03,'highpass',0,i*.5+.25);}
  else if(run&&D.cyber&&!S.mute)for(let i=0;i<16;i++){tone(52,.16,'sine',.13,32,i*.5);if(i%2)noise(.025,8000,1,.015,'highpass',0,i*.5+.25);}// Mitte: four-on-the-floor kick under the pads (bassline underworld)
  else if(run&&musI>.35&&!S.mute)for(let i=0;i<16;i++)tone(49,.22,'sine',.12*musI,34,i*.5);// fight: low pulse under the pads
  c.forEach(fr=>[-5,5].forEach(dt=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';o.frequency.value=fr/2;o.detune.value=dt;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.1,t+2.5);g.gain.linearRampToValueAtTime(0,t+8.4);o.connect(g);g.connect(mus.f);o.start(t);o.stop(t+8.6);}));
  for(let k=0;k<3;k++)if(Math.random()<.6){const n=pick(MEL[di]||MEL[0]),tt=t+1+k*2.4+Math.random(),o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=n;g.gain.setValueAtTime(0,tt);g.gain.linearRampToValueAtTime(.045,tt+.02);g.gain.exponentialRampToValueAtTime(.0001,tt+1.8);o.connect(g);g.connect(mus.g);o.start(tt);o.stop(tt+1.9);}}
function stopMusic(){if(!mus)return;clearInterval(mus.iv);try{mus.g.gain.cancelScheduledValues(AC.currentTime);mus.g.gain.setValueAtTime(mus.g.gain.value,AC.currentTime);mus.g.gain.linearRampToValueAtTime(0,AC.currentTime+1);}catch(e){}mus=null;}
function setEco(v){S.eco=v;save();resize();}
