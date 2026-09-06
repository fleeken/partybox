(()=>{
  function updateQuizTiming(){
    const g=typeof currentRoom!=='undefined'?currentRoom?.game:null;
    if(!g||g.name!=='Quiz Battle'||currentRoom?.phase!=='game'||g.status==='questionResults')return;
    const t=(g.startsAt||0)-Date.now();
    const left=Math.max(0,Math.ceil(((g.endsAt||Date.now())-Date.now())/1000));
    const text=t>0?`LÄS FRÅGAN ${Math.ceil(t/1000)}`:`SVARA ${left}s`;
    const hostClock=document.querySelector('#countdown');
    const phoneClock=document.querySelector('#phoneClock');
    if(hostClock)hostClock.textContent=text;
    if(phoneClock)phoneClock.textContent=text;
    document.querySelectorAll('.act').forEach(b=>{if(t>0)b.disabled=true});
  }
  setInterval(updateQuizTiming,100);
  new MutationObserver(()=>queueMicrotask(updateQuizTiming)).observe(document.querySelector('#app'),{childList:true,subtree:true});
  updateQuizTiming();
})();