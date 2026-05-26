/* ============================================================
   senior/ch01-integers.js  –  Integers & Number Line
   ============================================================ */
SeniorChapters.push({
  name:'Integers & Number Line', icon:'🔢', boardTitle:'Integers: −∞ … 0 … +∞',
  theory(){return`<h4>🔢 Integers</h4><p>Integers include all <b>whole numbers</b> and their negatives: … −3, −2, −1, 0, 1, 2, 3 …</p><div class="formula">|a| = absolute value (distance from 0)</div><ul><li>Adding negatives = subtracting positives</li><li>(−) × (−) = (+) &nbsp;|&nbsp; (+) × (−) = (−)</li><li>On the number line, larger numbers are always to the <b>right</b>.</li></ul>`;},
  renderForm(c){c.innerHTML=`<div class="input-row"><div><label>Integer A</label><input type="number" id="siA" value="-15"/></div><div><label>Integer B</label><input type="number" id="siB" value="8"/></div></div><label>Operation</label><select id="siOp"><option>add</option><option>subtract</option><option>multiply</option><option>divide</option><option>compare</option></select><button class="solve-btn" onclick="SeniorCh01.solve()">Calculate!</button>`;}
});
const SeniorCh01={solve(){
  const a=parseInt(document.getElementById('siA').value)||0;
  const b=parseInt(document.getElementById('siB').value)||0;
  const op=document.getElementById('siOp').value;
  let result,sym,explain;
  if(op==='add'){result=a+b;sym='+';explain=`(${a}) + (${b}): ${a<0&&b<0?'Both negative, add magnitudes and keep − sign':a<0||b<0?'Different signs: subtract smaller magnitude from larger':' Both positive, simple addition'}`;}
  else if(op==='subtract'){result=a-b;sym='−';explain=`Subtracting (${b}) = Adding (${-b}). Rule: a−b = a+(−b)`;}
  else if(op==='multiply'){result=a*b;sym='×';explain=`Sign rule: ${a<0?'−':'+'} × ${b<0?'−':'+'} = ${result>=0?'+':'−'}`;}
  else if(op==='divide'){result=b!==0?parseFloat((a/b).toFixed(4)):'undefined';sym='÷';explain=b===0?`Cannot divide by zero!`:`Sign rule: ${a<0?'−':'+'} ÷ ${b<0?'−':'+'} = ${result>=0?'+':'−'}`;}
  else{sym='vs';result=a>b?`${a} > ${b}`:a<b?`${a} < ${b}`:`${a} = ${b}`;explain='On the number line, the number further right is greater.';}
  const steps=[
    {type:'teacher-say',speak:`Let's work with integers: ${a} and ${b}!`,html:`🎤 Integers: <b>(${a}) ${sym} (${b})</b>`,delay:0,board:`${a} ${sym} ${b}`},
    {type:'highlight',speak:explain,html:`<b>Key Concept:</b> ${explain}`,delay:900},
    {type:'highlight',speak:`|${a}| = ${Math.abs(a)}, |${b}| = ${Math.abs(b)}`,html:`<b>Absolute values:</b> |${a}| = <span class="math">${Math.abs(a)}</span> &nbsp;|&nbsp; |${b}| = <span class="math">${Math.abs(b)}</span>`,delay:1800},
    {type:'result',html:`🎉 <b>(${a}) ${sym} (${b}) = ${result}</b>`,speak:`The answer is ${result}. Excellent work! 🌟`,delay:2700,board:`= ${result}`}
  ];
  App.showSteps(steps);
}};
