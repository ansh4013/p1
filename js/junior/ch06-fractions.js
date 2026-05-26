/* ============================================================
   junior/ch06-fractions.js
   ============================================================ */
JuniorChapters.push({
  name:'Fractions', icon:'½', boardTitle:'a/b + c/d',
  theory(){return`<h4>½ Fractions</h4><p>A fraction represents a <b>part of a whole</b>.</p><div class="formula">Numerator / Denominator</div><ul><li><b>Proper:</b> numerator < denominator (e.g. 3/4)</li><li><b>Improper:</b> numerator ≥ denominator (e.g. 7/3)</li><li>To add fractions, find a <b>common denominator</b> first!</li><li>Simplify by dividing by the <b>GCD</b>.</li></ul>`;},
  renderForm(c){c.innerHTML=`<label>Operation</label><select id="jfOp"><option value="add">Add (+)</option><option value="sub">Subtract (−)</option><option value="mul">Multiply (×)</option><option value="div">Divide (÷)</option></select><div class="input-row"><div><label>Numerator 1</label><input type="number" id="jfN1" value="3" min="1"/></div><div><label>Denominator 1</label><input type="number" id="jfD1" value="4" min="1"/></div></div><div class="input-row"><div><label>Numerator 2</label><input type="number" id="jfN2" value="2" min="1"/></div><div><label>Denominator 2</label><input type="number" id="jfD2" value="3" min="1"/></div></div><button class="solve-btn" onclick="JuniorCh06.solve()">Calculate!</button>`;}
});
const JuniorCh06={
  gcd(a,b){return b===0?a:this.gcd(b,a%b);},
  simplify(n,d){const g=this.gcd(Math.abs(n),Math.abs(d));return[n/g,d/g];},
  solve(){
    const op=document.getElementById('jfOp').value;
    const n1=parseInt(document.getElementById('jfN1').value)||1;
    const d1=parseInt(document.getElementById('jfD1').value)||1;
    const n2=parseInt(document.getElementById('jfN2').value)||1;
    const d2=parseInt(document.getElementById('jfD2').value)||1;
    let rn,rd,opSym,explain;
    if(op==='add'){rn=n1*d2+n2*d1;rd=d1*d2;opSym='+';explain=`Cross-multiply: (${n1}×${d2}) + (${n2}×${d1}) = ${rn}, denominator: ${d1}×${d2} = ${rd}`;}
    else if(op==='sub'){rn=n1*d2-n2*d1;rd=d1*d2;opSym='−';explain=`Cross-multiply: (${n1}×${d2}) − (${n2}×${d1}) = ${rn}, denominator: ${d1}×${d2} = ${rd}`;}
    else if(op==='mul'){rn=n1*n2;rd=d1*d2;opSym='×';explain=`Multiply numerators: ${n1}×${n2} = ${rn}. Multiply denominators: ${d1}×${d2} = ${rd}.`;}
    else{rn=n1*d2;rd=d1*n2;opSym='÷';explain=`Flip second fraction and multiply: ${n1}×${d2} = ${rn}, ${d1}×${n2} = ${rd}.`;}
    const [sn,sd]=this.simplify(rn,rd);
    const steps=[
      {type:'teacher-say',speak:`Let's work with fractions! ${n1}/${d1} ${opSym} ${n2}/${d2}`,html:`🎤 We need to find: <b>${n1}/${d1} ${opSym} ${n2}/${d2}</b>`,delay:0,board:`${n1}/${d1} ${opSym} ${n2}/${d2}`},
      {type:'highlight',speak:explain,html:`<b>Step 1:</b> ${explain}`,delay:900},
      {type:'highlight',speak:`Raw answer: ${rn}/${rd}. Now let's simplify!`,html:`<b>Step 2 – Raw result:</b> <span class="math">${rn}/${rd}</span>`,delay:1800},
      {type:'highlight',speak:`GCD of ${Math.abs(rn)} and ${rd} is ${this.gcd(Math.abs(rn),rd)}. Divide both!`,html:`<b>Step 3 – Simplify:</b> GCD(${Math.abs(rn)}, ${rd}) = ${this.gcd(Math.abs(rn),rd)} → <span class="math">${sn}/${sd}</span>`,delay:2700},
      {type:'result',html:`🎉 <b>${n1}/${d1} ${opSym} ${n2}/${d2} = ${sn}/${sd}</b>${rd!==sd?` (simplified from ${rn}/${rd})`:''}`,speak:`The answer is ${sn} over ${sd}. Superb! 🌟`,delay:3600,board:`= ${sn}/${sd}`}
    ];
    App.showSteps(steps);
  }
};
