(()=>{
  const RED='#ff4757',GREEN='#2ed573';
  function updateReadyFrame(){
    if(typeof currentRoom==='undefined'||!currentRoom)return;
    if(role==='player'){
      const section=document.querySelector('#app > section.phone');
      if(!section)return;
      section.classList.remove('lobbyReady','lobbyNotReady');
      if(currentRoom.phase!=='lobby')return;
      const p=(currentRoom.players||[]).find(x=>x.id===me?.id)||(currentRoom.players||[]).find(x=>x.name===me?.name);
      const ready=Boolean(p?.ready),c=ready?GREEN:RED;
      section.classList.add(ready?'lobbyReady':'lobbyNotReady');
      section.style.border=`6px solid ${c}`;
      section.style.borderRadius='24px';
      const av=section.querySelector('.avatarFace');if(av)av.style.borderColor=c;
      return;
    }
    if(role==='host'&&currentRoom.phase==='lobby'){
      document.querySelectorAll('.lobby .player').forEach((card,i)=>{
        const p=currentRoom.players?.[i];if(!p)return;
        const c=p.ready?GREEN:RED;
        card.style.borderColor=c;
        const av=card.querySelector('.avatarFace');if(av)av.style.borderColor=c;
      });
    }
  }
  new MutationObserver(()=>queueMicrotask(updateReadyFrame)).observe(document.querySelector('#app'),{childList:true,subtree:true});
  setInterval(updateReadyFrame,250);
  updateReadyFrame();
})();