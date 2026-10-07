// La progressione è interamente client-side: ideale per GitHub Pages.
// Nota: un sito statico NON può nascondere davvero un segreto dal codice sorgente.
const screens=[...document.querySelectorAll('.screen')];
function go(id){screens.forEach(s=>s.classList.toggle('active',s.id===id));window.scrollTo(0,0)}
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
const hint=(btn,txt)=>document.getElementById(btn).addEventListener('click',()=>document.getElementById(txt).classList.toggle('hidden'));
hint('hint1','hintText1');hint('hint2','hintText2');hint('hint3','hintText3');
function check(input,answer,error,next,success){const v=document.getElementById(input).value.trim().toUpperCase();if(v===answer){if(success)success();go(next)}else{document.getElementById(error).textContent='La serratura non si muove. Riprova.'}}
document.getElementById('check1').onclick=()=>check('answer1','MORSET','error1','scene2');
document.getElementById('answer1').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('check1').click()});
document.getElementById('check2').onclick=()=>check('answer2','8','error2','scene3');
document.getElementById('answer2').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('check2').click()});
const symbols=['☠️','🕷️','🦇','🩸','🕯️','☠️','🕷️','🦇','🩸'];
// La candela è l'unico simbolo singolo: il giocatore deve trovare quello che non ha coppia.
const grid=document.getElementById('symbolGrid');let chosen='';
symbols.forEach((s,i)=>{const b=document.createElement('button');b.className='symbol';b.textContent=s;b.setAttribute('aria-label','simbolo');b.onclick=()=>{document.querySelectorAll('.symbol').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');chosen=s;document.getElementById('selectedSymbol').textContent='Hai scelto: '+s;document.getElementById('check3').disabled=false};grid.appendChild(b)});
// Correzione: per mantenere l'enigma univoco, sostituiamo la quinta casella con la candela unica.
// Le coppie sono teschio, ragno, pipistrello e sangue; candela compare una sola volta.
document.getElementById('check3').onclick=()=>{if(chosen==='🕯️'){go('scene4')}else document.getElementById('error3').textContent='Non è questo il simbolo solitario.'};
document.getElementById('check4').onclick=()=>check('answer4','M7☠','error4','finale',()=>revealFinal());
document.getElementById('answer4').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('check4').click()});
function revealFinal(){
  // Offuscamento leggero per evitare che l'indirizzo sia visibile a colpo d'occhio.
  const p=[86,105,97,32,67,97,100,111,108,105,110,111,44,32,78,101,116,116,117,110,111];
  document.getElementById('address').textContent=String.fromCharCode(...p).toUpperCase();
}
document.getElementById('saveName').onclick=()=>{const n=document.getElementById('nickname').value.trim();if(n){document.getElementById('saved').textContent='☠ '+n+' — sopravvissuto alla notte. Non condividere il luogo prima che tutti abbiano giocato.';localStorage.setItem('halloweenNickname',n)}};
