(()=>{
  function clockNow(){try{return typeof now==='function'?now():Date.now()}catch{return Date.now()}}
  function showAnswers(show){
    document.querySelectorAll('.gamePhone .act').forEach(b=>{
      const grid=b.closest('.controlGrid');
      if(grid)grid.classList.toggle('quizAnswersHidden',!show);
    });
  }
  function ensureQuizClock(source,id){
    if(!source)return null;
    source.classList.add('quizNativeClockHidden');
    let clock=document.getElementById(id);
    if(!clock){
      clock=document.createElement('div');
      clock.id=id;
      clock.className='quizClock';
      source.insertAdjacentElement('afterend',clock);
    }
    return clock;
  }
  function clearQuizClocks(){
    document.querySelectorAll('.quizNativeClockHidden').forEach(x=>x.classList.remove('quizNativeClockHidden'));
    document.querySelector('#quizHostClock')?.remove();
    document.querySelector('#quizPhoneClock')?.remove();
  }
  function updateQuizTiming(){
    const g=typeof currentRoom!=='undefined'?currentRoom?.game:null;
    if(!g||g.name!=='Quiz Battle'||currentRoom?.phase!=='game'||g.status==='questionResults'){
      showAnswers(true);
      clearQuizClocks();
      return;
    }
    const n=clockNow();
    const t=(g.startsAt||0)-n;
    const reading=t>0;
    const left=Math.max(0,Math.ceil(((g.endsAt||n)-n)/1000));
    const seconds=reading?Math.max(0,Math.ceil(t/1000)):left;
    const label=reading?'LÄS FRÅGAN':'SVARA';
    const markup=`<span class="quizClockLabel">${label}</span><strong class="quizClockSeconds">${seconds}</strong><span class="quizClockUnit">sek</span>`;
    const hostClock=ensureQuizClock(document.querySelector('#countdown'),'quizHostClock');
    const phoneClock=ensureQuizClock(document.querySelector('#phoneClock'),'quizPhoneClock');
    if(hostClock&&hostClock.dataset.value!==markup){hostClock.innerHTML=markup;hostClock.dataset.value=markup}
    if(phoneClock&&phoneClock.dataset.value!==markup){phoneClock.innerHTML=markup;phoneClock.dataset.value=markup}
    const p=typeof own==='function'?own():null;
    showAnswers(!reading);
    document.querySelectorAll('.gamePhone .act').forEach(b=>{b.disabled=reading||Boolean(p?.done)});
  }
  const style=document.createElement('style');
  style.textContent='.quizNativeClockHidden{display:none!important}.quizClock{display:flex;align-items:center;justify-content:center;gap:clamp(12px,2vw,28px);margin:clamp(18px,3vh,34px) 0;line-height:1;font-size:clamp(42px,7vw,86px);font-weight:1000}.quizClockLabel{font-size:.45em;font-weight:900;letter-spacing:.08em;opacity:.85}.quizClockSeconds{display:inline-flex;align-items:center;justify-content:center;min-width:1.6em;font-size:1.35em;color:#ffd32a}.quizClockUnit{font-size:.38em;font-weight:900;opacity:.65}.phone .quizClock{gap:14px;margin:20px 0;flex-wrap:wrap;font-size:clamp(42px,15vw,74px)}.phone .quizClockLabel{font-size:.42em}.phone .quizClockSeconds{font-size:1.45em}.phone .quizClockUnit{font-size:.36em}.quizAnswersHidden{visibility:hidden!important;pointer-events:none!important}';
  document.head.appendChild(style);
  setInterval(updateQuizTiming,100);
  updateQuizTiming();
})();