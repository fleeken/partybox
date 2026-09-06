(()=>{
  function clockNow(){try{return typeof now==='function'?now():Date.now()}catch{return Date.now()}}
  let lastHost='',lastPhone='',lastReadSecond=null;
  const flash=document.createElement('div');
  flash.className='quizSecondFlash';
  document.body.appendChild(flash);
  function pulse(second){
    if(second===lastReadSecond)return;
    lastReadSecond=second;
    flash.classList.remove('pulse');
    void flash.offsetWidth;
    flash.classList.add('pulse');
  }
  function showAnswers(show){
    document.querySelectorAll('.gamePhone .act').forEach(b=>{
      const grid=b.closest('.controlGrid');
      if(grid)grid.classList.toggle('quizAnswersHidden',!show);
    });
  }
  function updateQuizTiming(){
    const g=typeof currentRoom!=='undefined'?currentRoom?.game:null;
    if(!g||g.name!=='Quiz Battle'||currentRoom?.phase!=='game'||g.status==='questionResults'){
      lastReadSecond=null;
      flash.classList.remove('pulse');
      showAnswers(true);
      return;
    }
    const n=clockNow();
    const t=(g.startsAt||0)-n;
    const reading=t>0;
    const left=Math.max(0,Math.ceil(((g.endsAt||n)-n)/1000));
    const seconds=reading?Math.max(0,Math.ceil(t/1000)):left;
    const label=reading?'LÄS FRÅGAN':'SVARA';
    const markup=`<span class="quizClockLabel">${label}</span><strong class="quizClockSeconds">${seconds}</strong><span class="quizClockUnit">sek</span>`;
    const hostClock=document.querySelector('#countdown');
    const phoneClock=document.querySelector('#phoneClock');
    if(hostClock){hostClock.classList.add('quizClock');if(lastHost!==markup){hostClock.innerHTML=markup;lastHost=markup}}
    if(phoneClock){phoneClock.classList.add('quizClock');if(lastPhone!==markup){phoneClock.innerHTML=markup;lastPhone=markup}}
    const p=typeof own==='function'?own():null;
    showAnswers(!reading);
    document.querySelectorAll('.gamePhone .act').forEach(b=>{b.disabled=reading||Boolean(p?.done)});
    if(reading&&seconds>0)pulse(seconds);else lastReadSecond=null;
  }
  const style=document.createElement('style');
  style.textContent='.quizClock{display:flex!important;align-items:center;justify-content:center;gap:clamp(12px,2vw,28px);margin:clamp(18px,3vh,34px) 0!important;line-height:1!important}.quizClockLabel{font-size:.45em;font-weight:900;letter-spacing:.08em;opacity:.85}.quizClockSeconds{display:inline-flex;align-items:center;justify-content:center;min-width:1.6em;font-size:1.35em;color:#ffd32a}.quizClockUnit{font-size:.38em;font-weight:900;opacity:.65}.phone .quizClock{gap:14px;margin:20px 0!important;flex-wrap:wrap}.phone .quizClockLabel{font-size:.42em}.phone .quizClockSeconds{font-size:1.45em}.phone .quizClockUnit{font-size:.36em}.quizAnswersHidden{visibility:hidden!important;pointer-events:none!important}.quizSecondFlash{position:fixed;inset:0;z-index:9998;pointer-events:none;background:#fff;opacity:0}.quizSecondFlash.pulse{animation:quizSecondPulse .28s ease-out}@keyframes quizSecondPulse{0%{opacity:.28}100%{opacity:0}}';
  document.head.appendChild(style);
  setInterval(updateQuizTiming,100);
  updateQuizTiming();
})();