(()=>{
  const oldPracticeHost=typeof practiceHost==='function'?practiceHost:null;
  const oldPracticePhone=typeof practicePhone==='function'?practicePhone:null;
  if(!oldPracticeHost||!oldPracticePhone)return;

  function demoControls(name){
    if(name==='Quiz Battle')return '<div class="controlGrid"><button>SVAR A</button><button>SVAR B</button><button>SVAR C</button><button>SVAR D</button></div>';
    if(name==='Färgfeed')return '<div class="controlGrid"><button class="ffRed">RÖD</button><button class="ffBlue">BLÅ</button><button class="ffGreen">GRÖN</button><button class="ffYellow">GUL</button></div>';
    if(name==='Copycat')return '<div class="controlGrid"><button>⬆️</button><button>➡️</button><button>⬇️</button><button>⬅️</button></div>';
    if(name==='Väggen')return '<div class="controlGrid"><button>1</button><button>2</button><button>3</button></div>';
    if(name==='Hal is')return '<div class="controlGrid"><button>⬅️ VÄNSTER</button><button>HÖGER ➡️</button></div>';
    if(name==='Radiobilsfotboll')return '<div class="controlGrid"><button>⬅️</button><button>BOOST</button><button>➡️</button></div>';
    if(name==='Helikoptern')return '<button class="actionButton">HÅLL / TAPPA UPP</button>';
    if(name==='Rött ljus / grönt ljus')return '<button class="actionButton">RÖR DIG!</button>';
    if(name==='Växla!')return '<button class="actionButton">VÄXLA!</button>';
    if(name==='Mini-race')return '<button class="actionButton">GASA!</button>';
    if(name==='Hajen kommer')return '<button class="actionButton">SIMMA!</button>';
    const text=name==='Chicken'?'BROMSA!':name==='Prickskytten'?'SKJUT!':name==='Kanonduell'?'ELD!':name==='Stoppa på 10.00'?'STOPP!':'TRYCK!';
    return `<button class="actionButton">${text}</button>`;
  }

  practiceHost=function(){
    const g=currentRoom.game,ready=currentRoom.players.filter(p=>p.ready).length;
    app.innerHTML=`<section class="game generic practiceMatch"><div class="practiceBanner">ÖVNINGSLÄGE</div><div class="gameIcon">${g.icon}</div><h1>${esc(g.name)}</h1><div class="bigPrompt">${esc(g.prompt||g.hint||'KÖR!')}</div><div class="roundClock practiceInfinity">∞</div><div class="raceBoard">${currentRoom.players.map(p=>`<div class="raceRow" style="opacity:${p.connected===false?.55:1}"><span>${p.avatar} ${esc(p.name)}</span><div class="bar"><i style="width:${p.ready?100:35}%;background:${p.color}"></i></div><b>${p.connected===false?'–':p.ready?'✓':'ÖVAR'}</b></div>`).join('')}</div><div class="readyCount">${ready}/${currentRoom.players.length} REDO</div></section>`;
  };

  practicePhone=function(){
    const g=currentRoom.game,p=own();
    app.innerHTML=`<section class="phone gamePhone practiceMatch" style="--c:${me.color}"><div class="practiceBanner">ÖVNINGSLÄGE</div><div class="gameIcon">${g.icon}</div><h1>${esc(g.name)}</h1><div class="phonePrompt">${esc(g.prompt||g.hint||'KÖR!')}</div><div class="smallClock practiceInfinity">∞</div><div class="practiceDemo">${demoControls(g.name)}</div><button id="readyGame" class="readyButton" ${p?.ready?'disabled':''}>${p?.ready?'JAG ÄR REDO ✓':'JAG ÄR REDO'}</button></section>`;
    document.querySelectorAll('.practiceDemo button').forEach(b=>b.onclick=()=>{b.classList.add('practicePressed');setTimeout(()=>b.classList.remove('practicePressed'),180)});
    document.querySelector('#readyGame').onclick=()=>socket.emit('player:ready',{});
  };

  const style=document.createElement('style');
  style.textContent='.practiceMatch .practiceInfinity{opacity:.45}.practiceMatch .practiceDemo{width:100%}.practiceMatch .practicePressed{transform:translateY(4px)!important;filter:brightness(1.25)}';
  document.head.appendChild(style);
})();