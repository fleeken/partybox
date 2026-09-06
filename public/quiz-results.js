(()=>{
  let tick=null,lastKey='';
  function escQ(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function clearOverlay(){document.querySelector('.quizBetweenOverlay')?.remove();if(tick){clearInterval(tick);tick=null}lastKey=''}
  function renderQuizResults(){
    const g=typeof currentRoom!=='undefined'?currentRoom?.game:null;
    if(!g||g.name!=='Quiz Battle'||g.status!=='questionResults'){clearOverlay();return}
    const root=document.querySelector('#app > section');if(!root)return;
    const key=`${g.questionIndex}-${g.resultUntil}`;
    let overlay=document.querySelector('.quizBetweenOverlay');
    if(!overlay||lastKey!==key){
      clearOverlay();
      const sorted=[...(currentRoom.players||[])].sort((a,b)=>(b.roundScore||0)-(a.roundScore||0));
      overlay=document.createElement('div');overlay.className='quizBetweenOverlay';
      overlay.innerHTML=`<div class="quizBetweenCard"><div class="quizBetweenTitle">RESULTAT FRÅGA ${g.questionIndex}/${g.questionTotal}</div><div class="quizBetweenSub">POÄNGSTÄLLNING</div><div class="quizBetweenList">${sorted.map((p,i)=>`<div class="quizBetweenRow"><span class="quizPlace">${i+1}</span><span class="quizName">${escQ(p.avatar)} ${escQ(p.name)}</span><b>${Math.round(p.roundScore||0)} p</b></div>`).join('')}</div><div class="quizNextIn" id="quizNextIn"></div></div>`;
      root.appendChild(overlay);lastKey=key;
      const update=()=>{const live=typeof currentRoom!=='undefined'?currentRoom?.game:null;if(!live||live.status!=='questionResults')return;const left=Math.max(0,Math.ceil(((live.resultUntil||Date.now())-Date.now())/1000));const el=document.querySelector('#quizNextIn');if(el)el.textContent=live.questionIndex>=live.questionTotal?`SLUTRESULTAT OM ${left}`:`FRÅGA ${live.questionIndex+1}/${live.questionTotal} OM ${left}`};
      update();tick=setInterval(update,200);
    }
  }
  const style=document.createElement('style');
  style.textContent='.quizBetweenOverlay{position:fixed;inset:0;z-index:5000;background:#080b15f5;display:flex;align-items:center;justify-content:center;padding:24px}.quizBetweenCard{width:min(760px,100%);text-align:center}.quizBetweenTitle{font-size:clamp(26px,5vw,54px);font-weight:1000;color:#ffd32a}.quizBetweenSub{font-size:clamp(18px,3vw,30px);font-weight:900;margin:8px 0 18px}.quizBetweenList{display:grid;gap:9px}.quizBetweenRow{display:grid;grid-template-columns:50px 1fr auto;align-items:center;gap:12px;background:#151c36;border:2px solid #ffffff20;border-radius:16px;padding:13px 18px;text-align:left;font-size:clamp(18px,3vw,28px)}.quizPlace{font-weight:1000;color:#ffd32a}.quizName{font-weight:900}.quizBetweenRow b{color:#2ed573}.quizNextIn{margin-top:20px;font-size:clamp(22px,4vw,38px);font-weight:1000;color:#fff}.phone .quizBetweenOverlay{padding:16px}.phone .quizBetweenRow{font-size:18px;padding:11px 12px;grid-template-columns:36px 1fr auto}.phone .quizBetweenTitle{font-size:28px}.phone .quizBetweenSub{font-size:20px}';
  document.head.appendChild(style);
  setInterval(renderQuizResults,150);
  renderQuizResults();
})();