(()=>{
  function addReplayButton(){
    if(typeof role==='undefined'||role!=='host'||typeof currentRoom==='undefined'||!currentRoom||currentRoom.phase!=='results')return;
    if(document.querySelector('#replayRound'))return;
    const row=document.querySelector('.results .hostbuttons');
    if(!row)return;
    const b=document.createElement('button');
    b.id='replayRound';
    b.className='readyButton';
    b.textContent='EN TILL RUNDA';
    b.onclick=()=>{
      b.disabled=true;
      socket.emit('host:startSelected',{},r=>{
        if(!r?.ok){b.disabled=false}
      });
    };
    row.prepend(b);
  }
  new MutationObserver(()=>queueMicrotask(addReplayButton)).observe(document.querySelector('#app'),{childList:true,subtree:true});
  addReplayButton();
})();