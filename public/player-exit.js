(()=>{
  const SAFE_PHASES=new Set(['lobby','voting','selected','choosing','results']);
  function addExit(){
    if(typeof role==='undefined'||role!=='player'||typeof currentRoom==='undefined'||!currentRoom||!SAFE_PHASES.has(currentRoom.phase))return;
    if(document.querySelector('#playerExitGame'))return;
    const section=document.querySelector('#app > section');
    if(!section)return;
    const b=document.createElement('button');
    b.id='playerExitGame';b.className='dangerButton playerExitButton';b.textContent='AVSLUTA TILL STARTSIDAN';
    b.onclick=()=>{if(!confirm('Lämna matchen och gå till startsidan?'))return;socket.emit('player:leave',{},()=>{try{localStorage.removeItem('partybox.session.v1')}catch{} location.reload()})};
    section.appendChild(b);
  }
  new MutationObserver(()=>queueMicrotask(addExit)).observe(document.querySelector('#app'),{childList:true,subtree:true});
  setInterval(addExit,500);addExit();
})();