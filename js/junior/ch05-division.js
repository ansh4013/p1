/* ============================================================
   junior/ch05-division.js
   ============================================================ */
JuniorChapters.push({
  name:'Division', icon:'➗', boardTitle:'A ÷ B = Q rem R',
  theory(){return`<h4>➗ Division</h4><p>Division means <b>splitting</b> a number into equal groups.</p><div class="formula">Dividend ÷ Divisor = Quotient (remainder R)</div><ul><li>Check: Quotient × Divisor + Remainder = Dividend ✓</li><li>Cannot divide by <b>zero</b>!</li><li>If remainder = 0, division is <b>exact</b>.</li></ul>`;},
  renderForm(c){c.innerHTML=`<div class="input-row"><div><label>Dividend (A)</label><input type="number" id="jdA" value="73" min="1"/></div><div><label>Divisor (B)</label><input type="number" id="jdB" value="6" min="1"/></div></div><button class="solve-btn" onclick="JuniorCh05.solve()">➗ Divide!</button>`;}
});
const JuniorCh05={solve(){
  const a=parseInt(document.getElementById('jdA').value)||1;
  const b=parseInt(document.getElementById('jdB').value)||1;
  if(b===0){Teacher.say("Oops! We can't divide by zero! 😬",2500);return;}
  const q=Math.floor(a/b), r=a%b;
  const steps=[
    {type:'teacher-say',speak:`Let's divide ${a} by ${b}! 🧮`,html:`🎤 We want <b>${a} ÷ ${b}</b>. How many times does ${b} fit into ${a}?`,delay:0,board:`${a} ÷ ${b} = ?`},
    {type:'highlight',speak:`${b} fits into ${a} exactly ${q} times with ${r} left over.`,html:`<b>Step 1:</b> ${b} × ${q} = <span class="math">${b*q}</span> (closest multiple ≤ ${a})`,delay:900},
    {type:'highlight',speak:`Remainder: ${a} minus ${b*q} equals ${r}.`,html:`<b>Step 2 – Remainder:</b> ${a} − ${b*q} = <span class="math">${r}</span>`,delay:1800},
    {type:'result',html:`🎉 <b>${a} ÷ ${b} = ${q}</b>${r>0?` remainder <b>${r}</b>`:'  (exact)'}`,speak:`So ${a} divided by ${b} is ${q}${r>0?' with a remainder of '+r:'exactly'}. Great job! 🌟`,delay:2600,board:`${a}÷${b}=${q} R${r}`},
    {type:'teacher-say',speak:`Verify: ${q} × ${b} + ${r} = ${q*b+r}. ${q*b+r===a?'Correct! ✅':'Check again!'}`,html:`✅ Verify: ${q} × ${b} + ${r} = <span class="math">${q*b+r}</span> = ${a} ✓`,delay:3600}
  ];
  App.showSteps(steps);
}};
