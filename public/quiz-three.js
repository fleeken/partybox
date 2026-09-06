(()=>{
  function updateQuizCounter(){
    const g=typeof currentRoom!=='undefined'?currentRoom?.game:null;
    const section=document.querySelector('#app > section');
    const existing=document.querySelector('.quizQuestionCounter');
    if(!g||g.name!=='Quiz Battle'||!g.questionIndex||!g.questionTotal||!section){
      if(existing)existing.remove();
      return;
    }
    const text=`FRÅGA ${g.questionIndex}/${g.questionTotal}`;
    if(existing&&existing.closest('#app > section')===section){
      if(existing.textContent!==text)existing.textContent=text;
      return;
    }
    if(existing)existing.remove();
    const el=document.createElement('div');
    el.className='quizQuestionCounter';
    el.textContent=text;
    const live=section.querySelector('.liveBanner');
    if(live)live.insertAdjacentElement('afterend',el);else section.prepend(el);
  }
  const style=document.createElement('style');
  style.textContent='.quizQuestionCounter{margin:12px auto 4px;padding:10px 18px;border-radius:999px;background:#ffd32a;color:#111;font-size:clamp(20px,4vw,42px);font-weight:1000;letter-spacing:.06em;text-align:center;width:max-content;max-width:90%}.phone .quizQuestionCounter{font-size:clamp(20px,7vw,34px);margin:8px auto}';
  document.head.appendChild(style);
  setInterval(updateQuizCounter,150);
  updateQuizCounter();
})();