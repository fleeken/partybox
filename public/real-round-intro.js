(()=>{
  let previousPhase=null,introUntil=0,roundKey='';
  function clockNow(){try{return typeof now==='function'?now():Date.now()}catch{return Date.now()}}
  function hide(){document.querySelector('#realRoundIntro')?.remove()}
  function begin(g){roundKey=`${g?.name||''}:${g?.startsAt||clockNow()}`;introUntil=clockNow()+5000}
  function update(){
    const room=typeof currentRoom!=='undefined'?currentRoom:null,g=room?.game,phase=room?.phase||null;
    if(phase==='game'&&previousPhase==='practice')begin(g);
    if(phase==='game'&&!roundKey)begin(g);
    previousPhase=phase;
    if(phase!=='game'||!introUntil){hide();if(phase!=='game'){roundKey='';introUntil=0}return}
    const left=introUntil-clockNow();
    if(left<=0){hide();return}
    const sec=Math.max(1,Math.ceil(left/1000));
    let el=document.querySelector('#realRoundIntro');
    if(!el){el=document.createElement('div');el.id='realRoundIntro';el.className='realRoundIntro';el.innerHTML='<div class="realRoundIntroText">NU STARTAR DEN RIKTIGA OMGÅNGEN!</div><div class="realRoundIntroCount"></div>';document.body.appendChild(el)}
    el.querySelector('.realRoundIntroCount').textContent=sec;
  }
  const style=document.createElement('style');
  style.textContent='.realRoundIntro{position:fixed;inset:0;z-index:100000;background:#0b1020;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:7vw}.realRoundIntroText{font-size:clamp(30px,6vw,86px);font-weight:1000;line-height:1.05;max-width:1200px}.realRoundIntroCount{margin-top:clamp(24px,5vh,60px);font-size:clamp(110px,24vw,300px);font-weight:1000;line-height:.8;color:#ffd32a;font-variant-numeric:tabular-nums}@media(max-width:650px){.realRoundIntro{padding:28px}.realRoundIntroText{font-size:clamp(30px,10vw,52px)}.realRoundIntroCount{font-size:clamp(120px,45vw,220px)}}';
  document.head.appendChild(style);
  setInterval(update,80);update();
})();