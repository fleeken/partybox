(()=>{
  const SESSION_KEY='partybox.session.v1';
  const hasSession=()=>{try{const s=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');return Boolean(s?.roomCode&&s?.role&&s?.sessionToken)}catch{return false}};
  const showReconnecting=()=>{if(!hasSession()||window.role||window.currentRoom)return;const root=document.querySelector('#app');if(root)root.innerHTML='<section class="phone reconnectScreen"><div class="hostWaitBig">ÅTERANSLUTER TILL MATCHEN…</div></section>'};
  const tryResume=()=>{if(hasSession()&&typeof window.resumeSession==='function')window.resumeSession()};
  showReconnecting();
  tryResume();
  setTimeout(tryResume,150);
  setTimeout(tryResume,500);
  window.addEventListener('pageshow',()=>{showReconnecting();tryResume()});
  if(typeof window.simplePhone==='function'){
    window.simplePhone=(title)=>{const root=document.querySelector('#app');if(root)root.innerHTML=`<section class="phone hostWaitScreen"><h1>${String(title??'')}</h1><div class="hostWaitBig">VÄNTAR PÅ SPELLEDARENS KOMMANDO!</div></section>`}
  }
})();