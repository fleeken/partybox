(()=>{
  const KEY='partybox.session.v1';
  let busy=false,retries=0;
  const getSession=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}};
  const valid=s=>Boolean(s?.roomCode&&s?.role&&s?.sessionToken);
  const show=(text='ÅTERANSLUTER TILL MATCHEN…')=>{const root=document.querySelector('#app');if(root)root.innerHTML=`<section class="phone reconnectScreen"><div class="hostWaitBig">${text}</div></section>`};

  function resumeNow({quiet=false}={}){
    const s=getSession();
    if(!valid(s)||busy)return;
    if(!socket.connected){if(!quiet)show();return}
    busy=true;if(!quiet)show();
    socket.emit('session:resume',s,r=>{
      busy=false;
      if(r?.ok){
        retries=0;
        role=r.role;
        me=r.player||null;
        currentRoom=r.room;
        render();
        return;
      }
      if(quiet)return;
      retries++;
      if(retries<6){show('ÅTERANSLUTER TILL MATCHEN…');setTimeout(()=>resumeNow(),500);return}
      show('KUNDE INTE ÅTERANSLUTA. FÖRSÖKER IGEN…');
      retries=0;setTimeout(()=>resumeNow(),2500);
    });
  }

  if(valid(getSession()))show();
  if(socket.connected)resumeNow();
  socket.on('connect',()=>resumeNow());
  window.addEventListener('pageshow',()=>resumeNow());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)resumeNow()});

  document.addEventListener('click',e=>{
    const lobby=e.target.closest('#ready');
    const practice=e.target.closest('#readyGame');
    if(!lobby&&!practice)return;
    e.preventDefault();e.stopImmediatePropagation();
    const btn=lobby||practice;
    if(btn.disabled)return;
    btn.disabled=true;
    const old=btn.textContent;
    btn.textContent='SKICKAR…';
    const event=lobby?'player:lobbyReady':'player:ready';
    socket.emit(event,{},r=>{
      if(!r?.ok){btn.disabled=false;btn.textContent=old;resumeNow();return}
      if(practice){
        btn.textContent='JAG ÄR REDO ✓';
        // A room:update normally switches immediately to the game view. If a mobile
        // browser misses that update during a DOM redraw, refresh room state quietly.
        setTimeout(()=>{if(currentRoom?.phase==='practice')resumeNow({quiet:true})},350);
        setTimeout(()=>{if(currentRoom?.phase==='practice')resumeNow({quiet:true})},1100);
      }
    });
  },true);

  const originalSimplePhone=typeof simplePhone==='function'?simplePhone:null;
  if(originalSimplePhone){
    simplePhone=(title)=>{const root=document.querySelector('#app');if(root)root.innerHTML=`<section class="phone hostWaitScreen"><h1>${String(title??'')}</h1><div class="hostWaitBig">VÄNTAR PÅ SPELLEDARENS KOMMANDO!</div></section>`};
  }
})();