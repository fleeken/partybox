(()=>{
  let introTimer=null,lastKey='';
  function clockNow(){try{return typeof now==='function'?now():Date.now()}catch{return Date.now()}}
  function remove(){document.querySelector('#realRoundIntro')?.remove();lastKey='';if(introTimer){clearInterval(introTimer);introTimer=null}}
  function update(){
    const g=typeof currentRoom!=='undefined'?currentRoom?.game:null;
    if(!g||currentRoom?.phase!=='game'||!g.introUntil){remove();return}
    const left=g.introUntil-clockNow();
    if(left<=0){remove();return}
    const sec=Math.max(1,Math.ceil(left/1000)),key=`${g.name}:${g.introUntil}`;
    let el=document.querySelector('#realRoundIntro');
    if(!el){el=document.createElement('div');el.id='realRoundIntro';el.className='realRoundIntro';el.innerHTML='<div class="realRoundIntroText">NU STARTAR DEN RIKTIGA OMGÅNGEN!</div><div class="realRoundIntroCount"></div>';document.body.appendChild(el)}
    el.querySelector('.realRoundIntroCount').textContent=sec;
    lastKey=key;
  }
  const style=document.createElement('style');
  style.textContent='.realRoundIntro{position:fixed;inset:0;z-index:100000;background:#0b1020;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:7vw}.realRoundIntroText{font-size:clamp(30px,6vw,86px);font-weight:1000;line-height:1.05;max-width:1200px}.realRoundIntroCount{margin-top:clamp(24px,5vh,60px);font-size:clamp(110px,24vw,300px);font-weight:1000;line-height:.8;color:#ffd32a;font-variant-numeric:tabular-nums}@media(max-width:650px){.realRoundIntro{padding:28px}.realRoundIntroText{font-size:clamp(30px,10vw,52px)}.realRoundIntroCount{font-size:clamp(120px,45vw,220px)}}';
  document.head.appendChild(style);
  introTimer=setInterval(update,80);update();
})();