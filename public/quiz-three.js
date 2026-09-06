(()=>{
  function updateQuizCounter(){
    const g=typeof currentRoom!=='undefined'?currentRoom?.game:null;
    document.querySelectorAll('.quizQuestionCounter').forEach(x=>x.remove());
    if(!g||g.name!=='Quiz Battle'||!g.questionIndex||!g.questionTotal)return;
    const section=document.querySelector('#app > section');
    if(!section)return;
    const el=document.createElement('div');
    el.className='quizQuestionCounter';
    el.textContent=`FRÅGA ${g.questionIndex}/${g.questionTotal}`;
    const live=section.querySelector('.liveBanner');
    if(live)live.insertAdjacentElement('afterend',el);else section.prepend(el);
  }
  const style=document.createElement('style');
  style.textContent='.quizQuestionCounter{margin:12px auto 4px;padding:10px 18px;border-radius:999px;background:#ffd32a;color:#111;font-size:clamp(20px,4vw,42px);font-weight:1000;letter-spacing:.06em;text-align:center;width:max-content;max-width:90%}.phone .quizQuestionCounter{font-size:clamp(20px,7vw,34px);margin:8px auto}';
  document.head.appendChild(style);
  new MutationObserver(()=>queueMicrotask(updateQuizCounter)).observe(document.querySelector('#app'),{childList:true,subtree:true});
  setInterval(updateQuizCounter,300);
  updateQuizCounter();
})();