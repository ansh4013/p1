/* ============================================================
   senior/ch02-algebra.js  –  Basic Algebra
   ============================================================ */
SeniorChapters.push({
  name:'Basic Algebra', icon:'🔡', boardTitle:'ax + b = c',
  theory(){return`<h4>🔡 Basic Algebra</h4><p>Algebra uses <b>variables</b> (like x, y) to represent unknown numbers.</p><div class="formula">Expression: 3x + 5 &nbsp;|&nbsp; Equation: 3x + 5 = 20</div><ul><li>To <b>solve</b> an equation, isolate the variable on one side.</li><li>Whatever you do to one side, do to the other!</li><li>Like terms: 3x + 5x = 8x (combine coefficients)</li></ul>`;},
  renderForm(c){c.innerHTML=`<p style="color:rgba(255,255,255,.6);font-size:.85rem;margin-bottom:10px">Solve: <b>ax + b = c</b></p><div class="input-row"><div><label>a (coefficient)</label><input type="number" id="sabA" value="3" step="any"/></div><div><label>b (constant)</label><input type="number" id="sabB" value="7" step="any"/></div><div><label>c (RHS)</label><input type="number" id="sabC" value="22" step="any"/></div></div><button class="solve-btn" onclick="SeniorCh02.solve()">🔡 Solve for x!</button>`;}
});
const SeniorCh02={solve(){
  const a=parseFloat(document.getElementById('sabA').value)||1;
  const b=parseFloat(document.getElementById('sabB').value)||0;
  const c=parseFloat(document.getElementById('sabC').value)||0;
  if(a===0){Teacher.say("If a=0, there's no x to solve for! 😅",2500);return;}
  const x=parseFloat(((c-b)/a).toFixed(6));
  const steps=[
    {type:'teacher-say',speak:`We're solving ${a}x + ${b} = ${c}. Let's isolate x!`,html:`🎤 Equation: <b>${a}x + ${b} = ${c}</b>`,delay:0,board:`${a}x + ${b} = ${c}`},
    {type:'highlight',speak:`Step 1: Subtract ${b} from both sides.`,html:`<b>Step 1 – Subtract ${b}:</b><br>${a}x + ${b} − ${b} = ${c} − ${b}<br><span class="math">${a}x = ${c-b}</span>`,delay:900,board:`${a}x = ${c-b}`},
    {type:'highlight',speak:`Step 2: Divide both sides by ${a}.`,html:`<b>Step 2 – Divide by ${a}:</b><br>${a}x ÷ ${a} = ${c-b} ÷ ${a}<br><span class="math">x = ${x}</span>`,delay:1800,board:`x = ${x}`},
    {type:'teacher-say',speak:`Let's verify: ${a}×${x}+${b} = ${parseFloat((a*x+b).toFixed(4))}. ${Math.abs(a*x+b-c)<0.001?'Correct! ✅':'Double-check!'}`,html:`<b>Verification:</b> ${a}×(${x}) + ${b} = <span class="math">${parseFloat((a*x+b).toFixed(4))}</span> ≈ ${c} ✓`,delay:2700},
    {type:'result',html:`🎉 <b>x = ${x}</b>`,speak:`x equals ${x}. Superb algebra! 🌟`,delay:3400,board:`x = ${x} ✓`}
  ];
  App.showSteps(steps);
}};
