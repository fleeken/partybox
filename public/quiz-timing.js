(()=>{
  function updateQuizTiming(){
    const g=typeof currentRoom!=='undefined'?currentRoom?.game:null;
    if(!g||g.name!=='Quiz Battle'||currentRoom?.phase!=='game'||g.status==='questionResults')return;
    const t=(g.startsAt||0)-Date.now();
    const left=Math.max(0,Math.ceil(((g.endsAt||Date.now())-Date.now())/1000));
    const label=t>0?'LÄS FRÅGAN':'SVARA';
    const seconds=t>0?Math.max(0,Math.ceil(t/1000)):left;
    const markup=`<span class="quizClockLabel">${label}</span><strong class="quizClockSeconds">${seconds}</strong><span class="quizClockUnit">sek</span>`;
    const hostClock=document.querySelector('#countdown');
    const phoneClock=document.querySelector('#phoneClock');
    if(hostClock){hostClock.classList.add('quizClock');hostClock.innerHTML=markup}
    if(phoneClock){phoneClock.classList.add('quizClock');phoneClock.innerHTML=markup}
    document.querySelectorAll('.act').forEach(b=>{if(t>0)b.disabled=true});
  }
  const style=document.createElement('style');
  style.textContent='.quizClock{display:flex!important;align-items:center;justify-content:center;gap:clamp(12px,2vw,28px);margin:clamp(18px,3vh,34px) 0!important;line-height:1!important}.quizClockLabel{font-size:.45em;font-weight:900;letter-spacing:.08em;opacity:.85}.quizClockSeconds{display:inline-flex;align-items:center;justify-content:center;min-width:1.6em;font-size:1.35em;color:#ffd32a}.quizClockUnit{font-size:.38em;font-weight:900;opacity:.65}.phone .quizClock{gap:14px;margin:20px 0!important;flex-wrap:wrap}.phone .quizClockLabel{font-size:.42em}.phone .quizClockSeconds{font-size:1.45em}.phone .quizClockUnit{font-size:.36em}';
  document.head.appendChild(style);
  setInterval(updateQuizTiming,100);
  new MutationObserver(()=>queueMicrotask(updateQuizTiming)).observe(document.querySelector('#app'),{childList:true,subtree:true});
  updateQuizTiming();
})();