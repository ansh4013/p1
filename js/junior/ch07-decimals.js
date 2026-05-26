/* ============================================================
   junior/ch07-decimals.js
   ============================================================ */
JuniorChapters.push({
  name:'Decimals', icon:'🔣', boardTitle:'0.__ + 0.__',
  theory(){return`<h4>🔣 Decimals</h4><p>Decimals are numbers with a <b>decimal point</b> that represent parts less than 1.</p><div class="formula">Ones . Tenths Hundredths Thousandths</div><ul><li>0.1 = 1/10 &nbsp;|&nbsp; 0.01 = 1/100 &nbsp;|&nbsp; 0.001 = 1/1000</li><li>Line up decimal points when adding or subtracting!</li><li>Multiply decimals like whole numbers, then place the point.</li></ul>`;},
  renderForm(c){c.innerHTML=`<label>Operation</label><select id="jdecOp"><option>add</option><option>subtract</option><option>multiply</option><option>divide</option></select><div class="input-row"><div><label>Number A</label><input type="number" id="jdecA" value="3.75" step="0.01"/></div><div><label>Number B</label><input type="number" id="jdecB" value="1.48" step="0.01"/></div></div><button class="solve-btn" onclick="JuniorCh07.solve()">Calculate!</button>`;}
});
const JuniorCh07={solve(){
  const op=document.getElementById('jdecOp').value;
  const a=parseFloat(document.getElementById('jdecA').value)||0;
  const b=parseFloat(document.getElementById('jdecB').value)||0;
  let result,sym;
  if(op==='add'){result=parseFloat((a+b).toFixed(10));sym='+';}
  else if(op==='subtract'){result=parseFloat((a-b).toFixed(10));sym='−';}
  else if(op==='multiply'){result=parseFloat((a*b).toFixed(10));sym='×';}
  else{result=b!==0?parseFloat((a/b).toFixed(6)):'undefined';sym='÷';}
  const steps=[
    {type:'teacher-say',speak:`Let's work with decimals: ${a} ${sym} ${b}!`,html:`🎤 Decimal operation: <b>${a} ${sym} ${b}</b>`,delay:0,board:`${a} ${sym} ${b} = ?`},
    {type:'highlight',speak:op==='add'||op==='subtract'?'Line up the decimal points carefully!':'Count decimal places in each number!',html:`<b>Key Rule:</b> ${op==='add'||op==='subtract'?'Align decimal points before computing.':'Count total decimal digits: both numbers combined.'}`,delay:900},
    {type:'result',html:`🎉 <b>${a} ${sym} ${b} = ${result}</b>`,speak:`The answer is ${result}. Brilliant! ✨`,delay:1800,board:`= ${result}`}
  ];
  App.showSteps(steps);
}};
