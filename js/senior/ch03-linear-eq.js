/* ============================================================
   senior/ch03-linear-eq.js  –  Linear Equations (2 variables)
   ============================================================ */
SeniorChapters.push({
  name:'Linear Equations', icon:'📈', boardTitle:'ax+by=c system',
  theory(){return`<h4>📈 Linear Equations</h4><p>A linear equation forms a <b>straight line</b> on a graph. A system of two equations has one solution point.</p><div class="formula">a₁x + b₁y = c₁<br>a₂x + b₂y = c₂</div><p>Solve by <b>Substitution</b> or <b>Elimination</b> method.</p>`;},
  renderForm(c){c.innerHTML=`<p style="color:rgba(255,255,255,.6);font-size:.85rem">System: a₁x + b₁y = c₁ &nbsp;&nbsp; a₂x + b₂y = c₂</p><div class="input-row"><div><label>a₁</label><input type="number" id="sl1a" value="2"/></div><div><label>b₁</label><input type="number" id="sl1b" value="3"/></div><div><label>c₁</label><input type="number" id="sl1c" value="12"/></div></div><div class="input-row"><div><label>a₂</label><input type="number" id="sl2a" value="4"/></div><div><label>b₂</label><input type="number" id="sl2b" value="-1"/></div><div><label>c₂</label><input type="number" id="sl2c" value="5"/></div></div><button class="solve-btn" onclick="SeniorCh03.solve()">📈 Solve System!</button>`;}
});
const SeniorCh03={solve(){
  const a1=parseFloat(document.getElementById('sl1a').value)||0;
  const b1=parseFloat(document.getElementById('sl1b').value)||0;
  const c1=parseFloat(document.getElementById('sl1c').value)||0;
  const a2=parseFloat(document.getElementById('sl2a').value)||0;
  const b2=parseFloat(document.getElementById('sl2b').value)||0;
  const c2=parseFloat(document.getElementById('sl2c').value)||0;
  const det=a1*b2-a2*b1;
  const steps=[
    {type:'teacher-say',speak:`We have a system of two linear equations. Let's use Elimination!`,html:`🎤 System:<br><span class="math">${a1}x + ${b1}y = ${c1}</span><br><span class="math">${a2}x + ${b2}y = ${c2}</span>`,delay:0,board:`System of 2 Equations`},
  ];
  if(Math.abs(det)<1e-9){steps.push({type:'result',html:`⚠️ Determinant = 0. The system has <b>${Math.abs(a1*c2-a2*c1)<1e-9?'infinite solutions (same line)':'no solution (parallel lines)'}</b>`,speak:`The determinant is zero — no unique solution!`,delay:900});App.showSteps(steps);return;}
  const x=parseFloat(((c1*b2-c2*b1)/det).toFixed(4));
  const y=parseFloat(((a1*c2-a2*c1)/det).toFixed(4));
  steps.push({type:'highlight',speak:`Using Cramer's Rule: D = a1×b2 − a2×b1 = ${a1}×${b2} − ${a2}×${b1} = ${det}`,html:`<b>Determinant D</b> = ${a1}×${b2} − ${a2}×${b1} = <span class="math">${det}</span>`,delay:900,board:`D = ${det}`});
  steps.push({type:'highlight',speak:`x = (c1×b2 − c2×b1) / D = ${c1*b2-c2*b1} / ${det} = ${x}`,html:`<b>x</b> = (${c1}×${b2} − ${c2}×${b1}) / ${det} = <span class="math">${x}</span>`,delay:1800,board:`x = ${x}`});
  steps.push({type:'highlight',speak:`y = (a1×c2 − a2×c1) / D = ${a1*c2-a2*c1} / ${det} = ${y}`,html:`<b>y</b> = (${a1}×${c2} − ${a2}×${c1}) / ${det} = <span class="math">${y}</span>`,delay:2700,board:`y = ${y}`});
  steps.push({type:'result',html:`🎉 Solution: <b>x = ${x}, y = ${y}</b>`,speak:`x equals ${x} and y equals ${y}. The lines intersect at this point! 🌟`,delay:3600,board:`(${x}, ${y})`});
  App.showSteps(steps);
}};
