/* ch03-subtraction.js */
JuniorChapters.push({
  name:'Subtraction', icon:'➖', boardTitle:'A − B = ?',
  theory(){return`<h4>➖ Subtraction</h4><p>Subtraction means <b>taking away</b> from a number to find the difference.</p><div class="formula">Minuend − Subtrahend = Difference</div><ul><li>You <b>cannot</b> subtract a bigger number from a smaller one without going negative.</li><li><b>Borrowing:</b> if the top digit is smaller, borrow from the next column!</li><li>Check your answer: Difference + Subtrahend = Minuend ✓</li></ul>`;},
  renderForm(c){c.innerHTML=`<div class="input-row"><div><label>Minuend (A)</label><input type="number" id="jsA" value="85" min="0"/></div><div><label>Subtrahend (B)</label><input type="number" id="jsB" value="37" min="0"/></div></div><button class="solve-btn" onclick="JuniorCh03.solve()">➖ Subtract!</button>`;}
});
const JuniorCh03={solve(){
  const a=parseInt(document.getElementById('jsA').value)||0;
  const b=parseInt(document.getElementById('jsB').value)||0;
  const diff=a-b;
  const steps=[
    {type:'teacher-say',speak:`Let's subtract ${b} from ${a}! 🧮`,html:`🎤 We want to find <b>${a} − ${b}</b>. Let's think step by step!`,delay:0,board:`${a} − ${b} = ?`},
    {type:'highlight',speak:`First, is ${a} bigger than ${b}? ${a>=b?'Yes! Great, we can subtract directly.':'No! The answer will be negative.'}`,html:`<b>Step 1 – Compare:</b> Is ${a} ≥ ${b}? <span class="math">${a>=b?'Yes ✓':'No — result is negative'}</span>`,delay:900},
    {type:'highlight',speak:`Units: ${a%10} minus ${b%10}${a%10<b%10?' — we need to borrow!':', easy!'}`,html:`<b>Step 2 – Units column:</b> ${a%10} − ${b%10} ${a%10<b%10?'→ borrow from tens':'→ = '+(a%10-b%10)}`,delay:1800},
    {type:'result',html:`🎉 <b>${a} − ${b} = ${diff}</b>`,speak:`So ${a} minus ${b} equals ${diff}. Fantastic! 🌟`,delay:2800,board:`${a} − ${b} = ${diff}`},
    {type:'teacher-say',speak:`Let's verify: ${diff} + ${b} = ${diff+b}. ${diff+b===a?'Correct! ✅':'Hmm, double-check!'}`,html:`✅ Verify: ${diff} + ${b} = <span class="math">${diff+b}</span> ${diff+b===a?'= '+a+' ✓':'≠ '+a+' ✗'}`,delay:3600}
  ];
  App.showSteps(steps);
}};
