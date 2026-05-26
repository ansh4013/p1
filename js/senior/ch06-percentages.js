/* ============================================================
   senior/ch06-percentages.js
   ============================================================ */
SeniorChapters.push({
  name:'Percentages', icon:'%', boardTitle:'% Calculations',
  theory(){return`<h4>% Percentages</h4><p>Percentage means "per hundred". It expresses a ratio out of 100.</p><div class="formula">P% of N = (P/100) × N</div><div class="formula">% Change = (Change/Original) × 100</div><ul><li>Profit% = (Profit/CP) × 100 &nbsp;|&nbsp; Loss% = (Loss/CP) × 100</li><li>Discount = Marked Price × Rate%</li></ul>`;},
  renderForm(c){c.innerHTML=`<label>Mode</label><select id="spcMode"><option value="of">Find P% of N</option><option value="what">What % is A of B?</option><option value="change">% Change (Old → New)</option><option value="profit">Profit / Loss</option></select><div class="input-row"><div><label>P / A / Old / CP</label><input type="number" id="spcX" value="25" step="any"/></div><div><label>N / B / New / SP</label><input type="number" id="spcY" value="200" step="any"/></div></div><button class="solve-btn" onclick="SeniorCh06.solve()">% Go!</button>`;}
});
const SeniorCh06={solve(){
  const mode=document.getElementById('spcMode').value;
  const x=parseFloat(document.getElementById('spcX').value)||0;
  const y=parseFloat(document.getElementById('spcY').value)||1;
  let steps=[];
  if(mode==='of'){
    const res=parseFloat((x/100*y).toFixed(4));
    steps=[
      {type:'teacher-say',speak:`${x}% of ${y}! Let's calculate!`,html:`🎤 Find <b>${x}% of ${y}</b>`,delay:0,board:`${x}% × ${y}`},
      {type:'highlight',speak:`${x}% = ${x}/100 = ${x/100}`,html:`<b>Convert:</b> ${x}% = <span class="math">${x/100}</span>`,delay:900},
      {type:'result',html:`🎉 ${x}% of ${y} = <b>${res}</b>`,speak:`${x} percent of ${y} is ${res}! 🌟`,delay:1800,board:`= ${res}`}
    ];
  } else if(mode==='what'){
    const pct=parseFloat((x/y*100).toFixed(4));
    steps=[
      {type:'teacher-say',speak:`What percent is ${x} of ${y}?`,html:`🎤 <b>${x}</b> is what % of <b>${y}</b>?`,delay:0},
      {type:'highlight',speak:`Divide and multiply by 100: (${x}/${y}) × 100 = ${pct}%`,html:`<b>Formula:</b> (${x} / ${y}) × 100 = <span class="math">${pct}%</span>`,delay:900},
      {type:'result',html:`🎉 ${x} is <b>${pct}%</b> of ${y}`,speak:`${x} is ${pct} percent of ${y}! 🌟`,delay:1800,board:`${pct}%`}
    ];
  } else if(mode==='change'){
    const change=parseFloat(((y-x)/x*100).toFixed(4));
    steps=[
      {type:'teacher-say',speak:`% change from ${x} to ${y}!`,html:`🎤 % Change: <b>${x} → ${y}</b>`,delay:0},
      {type:'highlight',speak:`Change = ${y-x}. Formula: (change/original) × 100 = ${change}%`,html:`<b>% Change</b> = (${y}-${x})/${x} × 100 = <span class="math">${change}%</span> ${change>=0?'(Increase ↑)':'(Decrease ↓)'}`,delay:900},
      {type:'result',html:`🎉 % Change = <b>${change}%</b> ${change>=0?'📈 Increase':'📉 Decrease'}`,speak:`There's a ${Math.abs(change)} percent ${change>=0?'increase':'decrease'}! 🌟`,delay:1800,board:`${change}%`}
    ];
  } else {
    const diff=y-x;
    const pct=parseFloat((Math.abs(diff)/x*100).toFixed(4));
    const kind=diff>=0?'Profit':'Loss';
    steps=[
      {type:'teacher-say',speak:`CP=${x}, SP=${y}. Let's find profit or loss!`,html:`🎤 CP = ${x}, SP = ${y} → Find ${kind}%`,delay:0},
      {type:'highlight',speak:`${kind} = SP − CP = ${y} − ${x} = ${diff}`,html:`<b>${kind}</b> = SP − CP = <span class="math">${diff}</span>`,delay:900},
      {type:'result',html:`🎉 ${kind}% = <b>${pct}%</b>`,speak:`The ${kind.toLowerCase()} percentage is ${pct} percent! 🌟`,delay:1800,board:`${kind}% = ${pct}%`}
    ];
  }
  App.showSteps(steps);
}};
