/* ============================================================
   junior/ch10-patterns.js
   ============================================================ */
JuniorChapters.push({
  name:'Patterns & Sequences', icon:'🔁', boardTitle:'Find the Pattern!',
  theory(){return`<h4>🔁 Patterns & Sequences</h4><p>A pattern is a <b>rule</b> that repeats. In maths, sequences follow arithmetic or geometric rules.</p><div class="formula">Arithmetic: each term = previous + common difference (d)</div><div class="formula">Geometric: each term = previous × common ratio (r)</div><ul><li>Find the rule, then predict the next terms!</li><li>nth term of arithmetic: a + (n−1)d</li></ul>`;},
  renderForm(c){c.innerHTML=`<label>Sequence Type</label><select id="jpType"><option value="arith">Arithmetic</option><option value="geo">Geometric</option></select><div class="input-row"><div><label>First Term (a)</label><input type="number" id="jpA" value="2" min="-1000" step="any"/></div><div><label>d (difference) or r (ratio)</label><input type="number" id="jpD" value="3" step="any"/></div></div><label>How many terms to show?</label><input type="number" id="jpN" value="8" min="3" max="20"/><button class="solve-btn" onclick="JuniorCh10.solve()">🔁 Generate!</button>`;}
});
const JuniorCh10={solve(){
  const type=document.getElementById('jpType').value;
  const a=parseFloat(document.getElementById('jpA').value)||1;
  const d=parseFloat(document.getElementById('jpD').value)||2;
  const n=parseInt(document.getElementById('jpN').value)||8;
  const terms=[];
  for(let i=0;i<n;i++) terms.push(type==='arith'?a+i*d:a*Math.pow(d,i));
  const rule=type==='arith'?`Add ${d} each time (d = ${d})`:`Multiply by ${d} each time (r = ${d})`;
  const nthFormula=type==='arith'?`a + (n−1)×${d} = ${a} + (n−1)×${d}`:`${a} × ${d}^(n−1)`;
  const steps=[
    {type:'teacher-say',speak:`Let's find the pattern! ${type==='arith'?'Arithmetic':'Geometric'} sequence starting at ${a}!`,html:`🎤 <b>${type==='arith'?'Arithmetic':'Geometric'} Sequence</b> starting at ${a}`,delay:0,board:type==='arith'?`a, a+d, a+2d…`:`a, ar, ar²…`},
    {type:'highlight',speak:rule,html:`<b>The Rule:</b> ${rule}`,delay:900},
    {type:'',html:`<b>Sequence:</b><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">${terms.map((t,i)=>`<span style="background:rgba(123,79,224,.2);border:1px solid var(--purple);border-radius:8px;padding:5px 12px;font-family:'Courier New';color:var(--yellow);">T${i+1}: ${parseFloat(t.toFixed(4))}</span>`).join('')}</div>`,delay:1600},
    {type:'highlight',speak:`The formula for the nth term is: ${nthFormula}`,html:`<b>nth Term Formula:</b> <span class="math">${nthFormula}</span>`,delay:2400},
    {type:'result',html:`🎉 Next term after T${n}: <b>${parseFloat((type==='arith'?a+n*d:a*Math.pow(d,n)).toFixed(4))}</b>`,speak:`And the very next term would be ${parseFloat((type==='arith'?a+n*d:a*Math.pow(d,n)).toFixed(4))}! Fantastic! 🌟`,delay:3200,board:`T${n+1} = ${parseFloat((type==='arith'?a+n*d:a*Math.pow(d,n)).toFixed(4))}`}
  ];
  App.showSteps(steps);
}};
