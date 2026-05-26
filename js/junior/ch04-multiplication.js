/* ch04-multiplication.js */
JuniorChapters.push({
  name:'Multiplication', icon:'✖️', boardTitle:'A × B = ?',
  theory(){return`<h4>✖️ Multiplication</h4><p>Multiplication is <b>repeated addition</b>. Instead of adding the same number many times, we multiply!</p><div class="formula">Multiplicand × Multiplier = Product</div><ul><li>3 × 4 means: 3 + 3 + 3 + 3 = 12</li><li><b>Commutative:</b> 4 × 6 = 6 × 4</li><li>Any number × 0 = 0 &nbsp;|&nbsp; Any number × 1 = itself</li><li>Learn your times tables up to 12 × 12!</li></ul>`;},
  renderForm(c){c.innerHTML=`<div class="input-row"><div><label>Number (A)</label><input type="number" id="jmA" value="7" min="0" max="999"/></div><div><label>Multiplier (B)</label><input type="number" id="jmB" value="8" min="0" max="999"/></div></div><button class="solve-btn" onclick="JuniorCh04.solve()">✖️ Multiply!</button>`;}
});
const JuniorCh04={solve(){
  const a=parseInt(document.getElementById('jmA').value)||0;
  const b=parseInt(document.getElementById('jmB').value)||0;
  const product=a*b;
  // Build repeated-addition string (only if small)
  const showRepeated = a<=12 && b<=12;
  const repeatedStr  = showRepeated ? Array(b).fill(a).join(' + ')+' = '+product : null;
  const steps=[
    {type:'teacher-say',speak:`Alright! Let's multiply ${a} by ${b}! 🌟`,html:`🎤 We need to find <b>${a} × ${b}</b>. Ready? Let's go!`,delay:0,board:`${a} × ${b} = ?`},
  ];
  if(showRepeated){
    steps.push({type:'highlight',speak:`Think of it as adding ${a}, ${b} times!`,html:`<b>Repeated Addition View:</b><br><span class="math">${repeatedStr}</span>`,delay:900});
  }
  // Times table row
  if(b<=12){
    const row=Array.from({length:12},(_,i)=>`${a}×${i+1}=${a*(i+1)}`).join('  ');
    steps.push({type:'',html:`<b>${a}'s Times Table (partial):</b><br><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">${Array.from({length:Math.min(b+2,12)},(_,i)=>`<span style="background:${i+1===b?'rgba(255,107,53,.3)':'rgba(255,255,255,.07)'};border:1px solid rgba(255,255,255,.15);border-radius:6px;padding:3px 9px;font-family:'Courier New';font-size:.85rem;color:var(--yellow);">${a}×${i+1}=${a*(i+1)}</span>`).join('')}</div>`,delay:1600});
  }
  steps.push({type:'result',html:`🎉 <b>${a} × ${b} = ${product}</b>`,speak:`So ${a} times ${b} equals ${product}. Excellent! 🎊`,delay:2600,board:`${a} × ${b} = ${product}`});
  App.showSteps(steps);
}};
