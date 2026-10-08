(() => {
  const screens = [...document.querySelectorAll('.screen')];
  const ids = ['intro','enigma-1','enigma-2','enigma-3','enigma-4','enigma-5','finale'];
  const normalize = v => String(v ?? '').trim().toUpperCase().replace(/\s+/g,'');
  let current = 0;
  const solved = new Set();
  const show = id => {
    screens.forEach(s => s.classList.toggle('active', s.id === id));
    current = ids.indexOf(id);
    document.querySelectorAll('.back-button').forEach(b => b.hidden = current <= 1 || current === 6);
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const feedback = (screen,msg,ok=false) => { const el=screen.querySelector('.feedback'); if(el){el.textContent=msg;el.className=`feedback${ok?' success':''}`;} };
  const advance = () => { if(current>=1 && current<=5) solved.add(current); show(current<6?ids[current+1]:'finale'); };
  // Navigazione indietro senza azzerare risposte o enigmi già risolti.
  screens.forEach(screen => { if(screen.id!=='intro' && screen.id!=='finale'){ const b=document.createElement('button'); b.className='back-button'; b.type='button'; b.textContent='← TORNA INDIETRO'; b.addEventListener('click',()=>show(ids[Math.max(1,ids.indexOf(screen.id)-1)])); screen.prepend(b); } });
  document.getElementById('enterButton').addEventListener('click',()=>show('enigma-1'));
  const forms=[...document.querySelectorAll('.answer-form')];
  const answers=['MORSET','7','', 'MORSET7V|||'];
  forms.forEach((form,i)=>form.addEventListener('submit',e=>{
    e.preventDefault(); const screen=form.closest('.screen'); const value=normalize(form.querySelector('input').value);
    const expected= i===0?'MORSET':i===1?'7':i===2?null:'MORSET7V|||';
    if(expected && value===normalize(expected)){feedback(screen,'✓ Il sigillo ha riconosciuto la risposta.',true);form.querySelector('input').disabled=true;form.querySelector('button').disabled=true;setTimeout(advance,500);}
    else feedback(screen,'✕ Non è la chiave. Riprova.');
  }));
  const selectChoice=(button,selector)=>{const screen=button.closest('.screen');screen.querySelectorAll(`${selector}.selected`).forEach(x=>x.classList.remove('selected'));button.classList.add('selected');if(button.dataset.answer==='YES'){feedback(screen,'✓ Il sigillo ha riconosciuto il segno.',true);screen.querySelectorAll(selector).forEach(x=>x.disabled=true);setTimeout(advance,500);}else feedback(screen,'✕ Questo non è il segno corretto.');};
  document.querySelectorAll('.symbol-choice').forEach(b=>b.addEventListener('click',()=>selectChoice(b,'.symbol-choice')));
  document.querySelectorAll('.door-choice').forEach(b=>b.addEventListener('click',()=>selectChoice(b,'.door-choice')));
  const candle=document.getElementById('hiddenCandle'), inscription=document.getElementById('hiddenInscription');
  let dragging=false, startX=0;
  candle.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;candle.setPointerCapture(e.pointerId);});
  candle.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;if(Math.abs(e.clientX-startX)>12 || e.pointerType==='touch'){candle.classList.add('moved');inscription.classList.add('revealed');}});
  candle.addEventListener('click',()=>{candle.classList.add('moved');inscription.classList.add('revealed');});
  candle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();candle.classList.add('moved');inscription.classList.add('revealed');}});
  const address='Via Cadolino 6, Nettuno';
  document.getElementById('mapButton').href=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  document.getElementById('copyAddress').addEventListener('click',async()=>{const status=document.getElementById('copyStatus');try{await navigator.clipboard.writeText(`${address} — ore 22:00`);status.textContent='✓ INDIRIZZO COPIATO';}catch{status.textContent=`${address} — ore 22:00`;}});
})();
