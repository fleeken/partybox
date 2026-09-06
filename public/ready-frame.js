(()=>{
  function updateReadyFrame(){
    if(typeof role==='undefined'||role!=='player'||typeof currentRoom==='undefined'||!currentRoom)return;
    const section=document.querySelector('#app > section.phone');
    if(!section)return;
    section.classList.remove('lobbyReady','lobbyNotReady');
    if(currentRoom.phase!=='lobby')return;
    const p=(currentRoom.players||[]).find(x=>x.id===me?.id)||(currentRoom.players||[]).find(x=>x.name===me?.name);
    section.classList.add(p?.ready?'lobbyReady':'lobbyNotReady');
  }
  new MutationObserver(()=>queueMicrotask(updateReadyFrame)).observe(document.querySelector('#app'),{childList:true,subtree:true});
  setInterval(updateReadyFrame,300);
  updateReadyFrame();
})();