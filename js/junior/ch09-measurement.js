/* ============================================================
   junior/ch09-measurement.js
   ============================================================ */
JuniorChapters.push({
  name:'Measurement & Units', icon:'📏', boardTitle:'Convert Units',
  theory(){return`<h4>📏 Measurement</h4><p>Measurement is comparing a quantity to a <b>standard unit</b>.</p><div class="formula">Length: km → m → cm → mm</div><div class="formula">1 km = 1000 m &nbsp;|&nbsp; 1 m = 100 cm &nbsp;|&nbsp; 1 cm = 10 mm</div><div class="formula">Weight: 1 kg = 1000 g &nbsp;|&nbsp; Volume: 1 L = 1000 mL</div>`;},
  renderForm(c){c.innerHTML=`<label>Category</label><select id="jmuCat"><option value="length">Length</option><option value="weight">Weight</option><option value="volume">Volume</option></select><label>Value</label><input type="number" id="jmuVal" value="5" min="0" step="0.001"/><label>From Unit</label><select id="jmuFrom"><option>km</option><option>m</option><option>cm</option><option>mm</option></select><label>To Unit</label><select id="jmuTo"><option>m</option><option>km</option><option>cm</option><option>mm</option></select><button class="solve-btn" onclick="JuniorCh09.solve()">📏 Convert!</button>`;}
});
const JuniorCh09={
  factors:{km:1000,m:1,cm:0.01,mm:0.001,kg:1000,g:1,mg:0.001,L:1,mL:0.001},
  solve(){
    const val=parseFloat(document.getElementById('jmuVal').value)||1;
    const from=document.getElementById('jmuFrom').value;
    const to=document.getElementById('jmuTo').value;
    const toM=this.factors[from]||1, fromM=this.factors[to]||1;
    const result=parseFloat((val*toM/fromM).toFixed(6));
    const steps=[
      {type:'teacher-say',speak:`Converting ${val} ${from} to ${to}!`,html:`🎤 Let's convert <b>${val} ${from}</b> into <b>${to}</b>!`,delay:0,board:`${val} ${from} → ${to}`},
      {type:'highlight',speak:`First, convert to base unit: ${val} × ${toM} = ${val*toM}`,html:`<b>Step 1:</b> ${val} ${from} × ${toM} = <span class="math">${val*toM}</span> (base unit)`,delay:900},
      {type:'highlight',speak:`Then divide by ${fromM} to get ${to}.`,html:`<b>Step 2:</b> ${val*toM} ÷ ${fromM} = <span class="math">${result}</span> ${to}`,delay:1800},
      {type:'result',html:`🎉 <b>${val} ${from} = ${result} ${to}</b>`,speak:`So ${val} ${from} equals ${result} ${to}. Well done! 🌟`,delay:2700,board:`${val}${from} = ${result}${to}`}
    ];
    App.showSteps(steps);
  }
};
