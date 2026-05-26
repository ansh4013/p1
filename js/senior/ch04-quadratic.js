/* ============================================================
   senior/ch04-quadratic.js  –  Quadratic Equations (FLAGSHIP)
   ============================================================ */
SeniorChapters.push({
  name:'Quadratic Equations', icon:'📉', boardTitle:'ax²+bx+c=0',
  theory(){return`<h4>📉 Quadratic Equations</h4><p>A quadratic equation has degree 2: it can have 0, 1, or 2 real solutions.</p><div class="formula">Standard: ax² + bx + c = 0</div><div class="formula">Quadratic Formula: x = (−b ± √(b²−4ac)) / 2a</div><div class="formula">Discriminant Δ = b² − 4ac</div><ul><li>Δ > 0 → Two distinct real roots</li><li>Δ = 0 → One repeated root</li><li>Δ < 0 → No real roots (complex)</li><li>Product of roots = c/a &nbsp;|&nbsp; Sum of roots = −b/a</li></ul>`;},
  renderForm(c){c.innerHTML=`
    <label>Equation Format</label>
    <select id="sqFormat" onchange="SeniorCh04.toggleFormat()">
      <option value="standard">ax² + bx + c = 0</option>
      <option value="rational">(ax²+bx+c) / (dx²+ex+f) = g</option>
    </select>
    <div id="sqStandard">
      <div class="input-row">
        <div><label>a</label><input type="number" id="sqA" value="1" step="any"/></div>
        <div><label>b</label><input type="number" id="sqB" value="-5" step="any"/></div>
        <div><label>c</label><input type="number" id="sqC" value="6" step="any"/></div>
      </div>
    </div>
    <div id="sqRational" style="display:none">
      <p style="color:rgba(255,255,255,.5);font-size:.8rem">Numerator: ax²+bx+c &nbsp;|&nbsp; Denominator: dx²+ex+f</p>
      <div class="input-row">
        <div><label>a (num)</label><input type="number" id="sqRA" value="1" step="any"/></div>
        <div><label>b (num)</label><input type="number" id="sqRB" value="-3" step="any"/></div>
        <div><label>c (num)</label><input type="number" id="sqRC" value="2" step="any"/></div>
      </div>
      <div class="input-row">
        <div><label>d (den)</label><input type="number" id="sqRD" value="1" step="any"/></div>
        <div><label>e (den)</label><input type="number" id="sqRE" value="0" step="any"/></div>
        <div><label>f (den)</label><input type="number" id="sqRF" value="-4" step="any"/></div>
      </div>
      <div><label>g (RHS value)</label><input type="number" id="sqRG" value="2" step="any"/></div>
    </div>
    <button class="solve-btn" onclick="SeniorCh04.solve()">📉 Solve!</button>
  `;}
});
const SeniorCh04={
  toggleFormat(){
    const f=document.getElementById('sqFormat').value;
    document.getElementById('sqStandard').style.display=f==='standard'?'':'none';
    document.getElementById('sqRational').style.display=f==='rational'?'':'none';
  },
  solveQuadratic(a,b,c){
    const disc=b*b-4*a*c;
    if(a===0) return{type:'linear',x:c===0?'infinite':parseFloat((-c/b).toFixed(4))};
    if(disc>0){
      return{type:'two',x1:parseFloat(((-b+Math.sqrt(disc))/(2*a)).toFixed(4)),x2:parseFloat(((-b-Math.sqrt(disc))/(2*a)).toFixed(4)),disc};
    } else if(Math.abs(disc)<1e-9){
      return{type:'one',x:parseFloat((-b/(2*a)).toFixed(4)),disc:0};
    } else {
      const realPart=parseFloat((-b/(2*a)).toFixed(4));
      const imagPart=parseFloat((Math.sqrt(-disc)/(2*a)).toFixed(4));
      return{type:'complex',r:realPart,i:imagPart,disc};
    }
  },
  buildSteps(a,b,c,label){
    const res=this.solveQuadratic(a,b,c);
    const disc=b*b-4*a*c;
    const steps=[
      {type:'teacher-say',speak:`We're solving a quadratic! ${label}. Let's use the Quadratic Formula! 📉`,html:`🎤 Solving: <b>${label}</b>`,delay:0,board:`${a}x²+${b}x+${c}=0`},
      {type:'highlight',speak:`First, identify a=${a}, b=${b}, c=${c}`,html:`<b>Identify coefficients:</b> a = <span class="math">${a}</span>, b = <span class="math">${b}</span>, c = <span class="math">${c}</span>`,delay:900},
      {type:'highlight',speak:`Calculate the discriminant: Δ = b² − 4ac = ${b}² − 4×${a}×${c} = ${disc}`,html:`<b>Discriminant Δ</b> = b² − 4ac = (${b})² − 4(${a})(${c}) = <span class="math">${parseFloat(disc.toFixed(4))}</span>`,delay:1800,board:`Δ = ${parseFloat(disc.toFixed(4))}`},
      {type:'highlight',speak:`Δ ${disc>0?'> 0 → two real roots':disc===0?'= 0 → one repeated root':'< 0 → complex roots'}!`,html:`<b>Nature of roots:</b> Δ ${disc>0?'> 0 → <span class="math">Two distinct real roots</span>':disc===0?'= 0 → <span class="math">One repeated root</span>':'< 0 → <span class="math">Complex (no real) roots</span>'}`,delay:2700},
      {type:'highlight',speak:`Apply formula: x = (−b ± √Δ) / (2a)`,html:`<b>Formula:</b> x = (−${b} ± √${parseFloat(disc.toFixed(4))}) / (2×${a}) = (${-b} ± ${parseFloat(Math.sqrt(Math.abs(disc)).toFixed(4))}) / ${2*a}`,delay:3600,board:`x=(−b±√Δ)/2a`},
    ];
    if(res.type==='two'){
      steps.push({type:'result',html:`🎉 <b>x₁ = ${res.x1}</b> &nbsp;&amp;&nbsp; <b>x₂ = ${res.x2}</b>`,speak:`Two roots: x₁ = ${res.x1} and x₂ = ${res.x2}. Brilliant! 🌟`,delay:4500,board:`x₁=${res.x1} x₂=${res.x2}`});
      steps.push({type:'teacher-say',speak:`Verify: Sum = x₁+x₂ = ${res.x1+res.x2} = ${parseFloat((-b/a).toFixed(4))} (= −b/a ✓). Product = ${parseFloat((res.x1*res.x2).toFixed(4))} = ${parseFloat((c/a).toFixed(4))} (= c/a ✓)`,html:`✅ Sum = x₁+x₂ = <span class="math">${parseFloat((res.x1+res.x2).toFixed(4))}</span> = −b/a = ${parseFloat((-b/a).toFixed(4))} ✓<br>Product = x₁×x₂ = <span class="math">${parseFloat((res.x1*res.x2).toFixed(4))}</span> = c/a = ${parseFloat((c/a).toFixed(4))} ✓`,delay:5200});
    } else if(res.type==='one'){
      steps.push({type:'result',html:`🎉 <b>x = ${res.x}</b> (repeated root)`,speak:`One repeated root: x = ${res.x}. That means the parabola just touches the x-axis! 🌟`,delay:4500,board:`x = ${res.x} (×2)`});
    } else if(res.type==='complex'){
      steps.push({type:'result',html:`🎉 <b>x = ${res.r} ± ${res.i}i</b> (complex roots)`,speak:`The roots are complex: ${res.r} plus or minus ${res.i}i. No real x-intercepts! 🌟`,delay:4500,board:`x=${res.r}±${res.i}i`});
    }
    return steps;
  },
  solve(){
    const fmt=document.getElementById('sqFormat').value;
    if(fmt==='standard'){
      const a=parseFloat(document.getElementById('sqA').value)||1;
      const b=parseFloat(document.getElementById('sqB').value)||0;
      const c=parseFloat(document.getElementById('sqC').value)||0;
      App.showSteps(this.buildSteps(a,b,c,`${a}x² + ${b}x + ${c} = 0`));
    } else {
      // Rational: (ax²+bx+c)/(dx²+ex+f) = g
      // Rearrange: ax²+bx+c = g(dx²+ex+f) => (a-gd)x²+(b-ge)x+(c-gf)=0
      const ra=parseFloat(document.getElementById('sqRA').value)||1;
      const rb=parseFloat(document.getElementById('sqRB').value)||0;
      const rc=parseFloat(document.getElementById('sqRC').value)||0;
      const rd=parseFloat(document.getElementById('sqRD').value)||1;
      const re=parseFloat(document.getElementById('sqRE').value)||0;
      const rf=parseFloat(document.getElementById('sqRF').value)||0;
      const g =parseFloat(document.getElementById('sqRG').value)||0;
      const na=ra-g*rd, nb=rb-g*re, nc=rc-g*rf;
      const steps=[
        {type:'teacher-say',speak:`This is a rational equation! Let's cross-multiply first. 🎯`,html:`🎤 Rational Equation: <b>(${ra}x²+${rb}x+${rc}) / (${rd}x²+${re}x+${rf}) = ${g}</b>`,delay:0,board:`Rational Quadratic`},
        {type:'highlight',speak:`Cross multiply: numerator = g × denominator`,html:`<b>Cross-multiply:</b> ${ra}x²+${rb}x+${rc} = ${g}(${rd}x²+${re}x+${rf})`,delay:900},
        {type:'highlight',speak:`Expand right side and bring everything to the left.`,html:`<b>Rearrange → Standard Form:</b><br><span class="math">(${na})x² + (${nb})x + (${nc}) = 0</span>`,delay:1800,board:`${na}x²+${nb}x+${nc}=0`},
      ];
      const mainSteps=this.buildSteps(na,nb,nc,`${na}x²+${nb}x+${nc}=0`).slice(1);
      mainSteps.forEach(s=>s.delay+=2400);
      App.showSteps([...steps,...mainSteps]);
    }
  }
};
