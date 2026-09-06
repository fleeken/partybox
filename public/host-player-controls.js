(()=>{
  const SAFE=new Set(['lobby','voting','selected','choosing','results']);
  function addButtons(){
    if(typeof role==='undefined'||role!=='host'||typeof currentRoom==='undefined'||!currentRoom||!SAFE.has(currentRoom.phase))return;
    const cards=[...document.querySelectorAll('.lobby .player')];
    cards.forEach((card,i)=>{
      const p=currentRoom.players?.[i];if(!p||card.querySelector('.removePlayerBtn'))return;
      const b=document.createElement('button');
      b.className='dangerButton removePlayerBtn';b.textContent='TA BORT SPELARE';b.dataset.playerId=p.id;
      b.onclick=e=>{e.stopPropagation();if(!confirm(`Ta bort ${p.name} från matchen?`))return;socket.emit('host:removePlayer',{playerId:p.id},r=>{if(!r?.ok)alert(r?.error||'Kunde inte ta bort spelaren.')})};
      card.appendChild(b);
    });
  }
  socket.on('player:removed',()=>{try{localStorage.removeItem('partybox.session.v1')}catch{} alert('Spelledaren tog bort dig från matchen.');location.reload()});
  new MutationObserver(()=>queueMicrotask(addButtons)).observe(document.querySelector('#app'),{childList:true,subtree:true});
  setInterval(addButtons,300);addButtons();
})();