(()=>{
  const colorClass={RÖD:'ffRed',BLÅ:'ffBlue',GRÖN:'ffGreen',GUL:'ffYellow'};
  const colors=['RÖD','BLÅ','GRÖN','GUL'];
  function practice(){
    const g=typeof currentRoom!=='undefined'?currentRoom?.game:null;
    if(!g||g.name!=='Färgfeed'||currentRoom?.phase!=='practice')return;
    const demo=document.querySelector('.practiceDemo');
    if(!demo||demo.dataset.fargfeed==='1')return;
    demo.dataset.fargfeed='1';
    demo.innerHTML=`<div class="fargfeedPracticeTitle">TESTA FÄRGERNA</div><div class="controlGrid fargfeedGrid">${colors.map(c=>`<button type="button" class="fargfeedButton ${colorClass[c]}">${c}</button>`).join('')}</div>`;
    demo.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
      b.classList.add('ffPressed');
      setTimeout(()=>b.classList.remove('ffPressed'),180);
    }));
  }
  function game(){
    const g=typeof currentRoom!=='undefined'?currentRoom?.game:null;
    if(!g||g.name!=='Färgfeed'||currentRoom?.phase!=='game')return;
    document.querySelectorAll('.gamePhone .act').forEach(b=>{
      const c=String(b.dataset.a||b.textContent||'').trim().toUpperCase();
      const cls=colorClass[c];
      if(!cls)return;
      b.classList.add('fargfeedButton',cls);
    });
    const prompt=document.querySelector('#phonePrompt');
    if(prompt&&!prompt.dataset.ffStyled){
      prompt.dataset.ffStyled='1';
      prompt.classList.add('fargfeedPrompt');
    }
    const big=document.querySelector('#bigPrompt');
    if(big&&!big.dataset.ffStyled){
      big.dataset.ffStyled='1';
      big.classList.add('fargfeedPrompt');
    }
  }
  const style=document.createElement('style');
  style.textContent='.fargfeedPracticeTitle{font-size:clamp(16px,5vw,24px);font-weight:1000;letter-spacing:.08em;margin-bottom:12px}.fargfeedGrid{gap:12px}.fargfeedButton{color:#fff!important;text-shadow:0 2px 3px #0008;border:3px solid #ffffff55;box-shadow:0 7px 0 #0005!important;transition:transform .08s,filter .08s}.fargfeedButton.ffRed{background:#ff4757!important}.fargfeedButton.ffBlue{background:#1e90ff!important}.fargfeedButton.ffGreen{background:#2ed573!important;color:#082713!important;text-shadow:none}.fargfeedButton.ffYellow{background:#ffd32a!important;color:#2b2400!important;text-shadow:none}.fargfeedButton:active,.fargfeedButton.ffPressed{transform:translateY(5px)!important;box-shadow:0 2px 0 #0005!important;filter:brightness(1.15)}.fargfeedPrompt{letter-spacing:.04em}.gamePhone .fargfeedGrid,.gamePhone .controlGrid:has(.fargfeedButton){margin-top:6px}@media(max-width:700px){.fargfeedButton{min-height:92px!important;font-size:clamp(22px,7vw,32px)!important}.fargfeedPracticeTitle{margin-bottom:8px}}';
  document.head.appendChild(style);
  setInterval(()=>{practice();game()},120);
  practice();game();
})();