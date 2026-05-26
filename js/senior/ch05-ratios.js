/* ============================================================
   senior/ch05-ratios.js
   ============================================================ */
SeniorChapters.push({
  name:'Ratio & Proportion', icon:'⚖️', boardTitle:'a : b = c : d',
  theory(){return`<h4>⚖️ Ratio & Proportion</h4><p>A <b>ratio</b> compares two quantities. A <b>proportion</b> states two ratios are equal.</p><div class="formula">a : b = a/b &nbsp;|&nbsp; a/b = c/d (proportion)</div><ul><li>Cross-multiply to solve: a×d = b×c</li><li>Simplify ratios by dividing by GCD</li><li>Direct proportion: y = kx</li><li>Inverse proportion: y = k/x</li></ul>`;},
  renderForm(c){c.innerHTML=`<label>Mode</label><select id="srpMode"><option value="simplify">Simplify Ratio a:b</option><option value="fourth">Find 4th Proportional</option><option value="direct">Direct Proportion</option></select><div class="input-row"><div><label>a</label><input type="number" id="srpA" value="12" min="1"/></div><div><label>b</label><input type="number" id="srpB" value="8" min="1"/></div><div><label>c (if needed)</label><input type="number" id="srpC" value="15" min="1"/></div></div><button class="solve-btn" onclick="SeniorCh05.solve()">⚖️ Calculate!</button>`;}
});
const SeniorCh05={gcd(a,b){return b===0?a:this.gcd(b,a%b);},solve(){
  const mode=document.getElementById('srpMode').value;
  const a=parseFloat(document.getElementById('srpA').value)||1;
  const b=parseFloat(document.getElementById('srpB').value)||1;
  const c=parseFloat(document.getElementById('srpC').value)||1;
  const steps=[];
  if(mode==='simplify'){
    const g=this.gcd(Math.round(a),Math.round(b));
    steps.push({type:'teacher-say',speak:`Let's simplify the ratio ${a}:${b}!`,html:`🎤 Simplify ratio <b>${a} : ${b}</b>`,delay:0,board:`${a}:${b}`});
    steps.push({type:'highlight',speak:`GCD of ${a} and ${b} is ${g}. Divide both by ${g}!`,html:`<b>GCD(${a}, ${b}) = ${g}</b><br>Divide both: ${a}/${g} : ${b}/${g} = <span class="math">${a/g} : ${b/g}</span>`,delay:900});
    steps.push({type:'result',html:`🎉 Simplified Ratio: <b>${a/g} : ${b/g}</b>`,speak:`The simplified ratio is ${a/g} to ${b/g}. 🌟`,delay:1800,board:`${a/g}:${b/g}`});
  } else if(mode==='fourth'){
    const d=parseFloat(((b*c)/a).toFixed(4));
    steps.push({type:'teacher-say',speak:`Find the 4th proportional: ${a}:${b} = ${c}:?`,html:`🎤 <b>${a} : ${b} = ${c} : d</b> → Find d`,delay:0});
    steps.push({type:'highlight',speak:`Cross multiply: a×d = b×c, so d = (b×c)/a = (${b}×${c})/${a} = ${d}`,html:`<b>Cross multiply:</b> d = (${b}×${c}) / ${a} = <span class="math">${d}</span>`,delay:900,board:`d = ${d}`});
    steps.push({type:'result',html:`🎉 4th Proportional d = <b>${d}</b>. Proportion: ${a}:${b} = ${c}:${d}`,speak:`The 4th proportional is ${d}. The proportion checks out! 🌟`,delay:1800});
  } else {
    const k=parseFloat((b/a).toFixed(4));
    const y=parseFloat((k*c).toFixed(4));
    steps.push({type:'teacher-say',speak:`Direct proportion: if ${a} → ${b}, what does ${c} give?`,html:`🎤 Direct Proportion: <b>if x=${a} → y=${b}, find y when x=${c}</b>`,delay:0});
    steps.push({type:'highlight',speak:`Find constant k = y/x = ${b}/${a} = ${k}`,html:`<b>Constant k</b> = ${b}/${a} = <span class="math">${k}</span>`,delay:900});
    steps.push({type:'result',html:`🎉 When x = ${c}: y = k×x = ${k}×${c} = <b>${y}</b>`,speak:`When x is ${c}, y is ${y}. 🌟`,delay:1800,board:`y = ${k}×${c} = ${y}`});
  }
  App.showSteps(steps);
}};

/* ch06-ch10 bundled */
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

SeniorChapters.push({name:'Exponents & Powers',icon:'⚡',boardTitle:'aⁿ',theory(){return`<h4>⚡ Exponents</h4><div class="formula">aⁿ = a × a × a … (n times)</div><ul><li>a⁰ = 1 (any non-zero base)</li><li>aᵐ × aⁿ = aᵐ⁺ⁿ &nbsp;|&nbsp; aᵐ ÷ aⁿ = aᵐ⁻ⁿ</li><li>(aᵐ)ⁿ = aᵐⁿ &nbsp;|&nbsp; a⁻ⁿ = 1/aⁿ</li></ul>`;},renderForm(c){c.innerHTML=`<div class="input-row"><div><label>Base (a)</label><input type="number" id="sexpA" value="3" step="any"/></div><div><label>Exponent (n)</label><input type="number" id="sexpN" value="4" step="any"/></div></div><button class="solve-btn" onclick="SeniorCh07.solve()">⚡ Calculate!</button>`;}});
const SeniorCh07={solve(){const a=parseFloat(document.getElementById('sexpA').value)||2,n=parseFloat(document.getElementById('sexpN').value)||2;const result=parseFloat(Math.pow(a,n).toFixed(6));const steps=[{type:'teacher-say',speak:`${a} to the power ${n}! Let's expand it!`,html:`🎤 Calculate: <b>${a}^${n}</b>`,delay:0,board:`${a}^${n}`},{type:'highlight',speak:n>=1&&n<=10&&Number.isInteger(n)?`Expand: ${Array(n).fill(a).join(' × ')} = ${result}`:`Using formula: ${a}^${n} = ${result}`,html:`<b>Expansion:</b>${n>=1&&n<=10&&Number.isInteger(n)?` ${Array(n).fill(a).join(' × ')} = `:`${a}^${n} = `}<span class="math">${result}</span>`,delay:900,board:`= ${result}`},{type:'result',html:`🎉 <b>${a}^${n} = ${result}</b>`,speak:`${a} to the power ${n} equals ${result}! ⚡`,delay:1800,board:`${a}^${n} = ${result}`}];App.showSteps(steps);}};

SeniorChapters.push({name:'Polynomials',icon:'🔠',boardTitle:'p(x) = ax²+bx+c',theory(){return`<h4>🔠 Polynomials</h4><p>A polynomial is a sum of terms with non-negative integer exponents.</p><div class="formula">p(x) = aₙxⁿ + … + a₁x + a₀</div><ul><li>Degree = highest exponent</li><li>Add/subtract: combine like terms</li><li>Factor: find common factors or use identities</li></ul>`;},renderForm(c){c.innerHTML=`<p style="color:rgba(255,255,255,.5);font-size:.8rem">Evaluate p(x) = ax³+bx²+cx+d at given x</p><div class="input-row"><div><label>a</label><input type="number" id="spA" value="2" step="any"/></div><div><label>b</label><input type="number" id="spB" value="-3" step="any"/></div><div><label>c</label><input type="number" id="spC" value="1" step="any"/></div><div><label>d</label><input type="number" id="spD" value="-5" step="any"/></div></div><label>Evaluate at x =</label><input type="number" id="spX" value="2" step="any"/><button class="solve-btn" onclick="SeniorCh08.solve()">Evaluate!</button>`;}});
const SeniorCh08={solve(){const a=parseFloat(document.getElementById('spA').value)||0,b=parseFloat(document.getElementById('spB').value)||0,c=parseFloat(document.getElementById('spC').value)||0,d=parseFloat(document.getElementById('spD').value)||0,x=parseFloat(document.getElementById('spX').value)||0;const result=a*x**3+b*x**2+c*x+d;const steps=[{type:'teacher-say',speak:`Evaluating polynomial at x=${x}! Substituting step by step.`,html:`🎤 p(x) = <b>${a}x³ + ${b}x² + ${c}x + ${d}</b> at x = ${x}`,delay:0,board:`p(${x}) = ?`},{type:'highlight',speak:`${a}×${x}³ = ${a}×${x**3} = ${a*x**3}`,html:`<b>${a}×x³:</b> ${a}×(${x})³ = ${a}×${x**3} = <span class="math">${a*x**3}</span>`,delay:900},{type:'highlight',speak:`${b}×${x}² = ${b}×${x**2} = ${b*x**2}`,html:`<b>${b}×x²:</b> ${b}×(${x})² = ${b}×${x**2} = <span class="math">${b*x**2}</span>`,delay:1800},{type:'highlight',speak:`${c}×${x} = ${c*x}. Constant: ${d}`,html:`<b>${c}×x:</b> ${c*x} &nbsp;+&nbsp; <b>constant:</b> ${d}`,delay:2700},{type:'result',html:`🎉 p(${x}) = ${a*x**3} + ${b*x**2} + ${c*x} + ${d} = <b>${result}</b>`,speak:`p of ${x} equals ${result}! 🌟`,delay:3600,board:`p(${x}) = ${result}`}];App.showSteps(steps);}};

SeniorChapters.push({name:'Geometry – Angles & Lines',icon:'📐',boardTitle:'Angles & Lines',theory(){return`<h4>📐 Angles & Lines</h4><div class="formula">Angle Types: Acute < 90° | Right = 90° | Obtuse > 90° | Straight = 180°</div><ul><li>Complementary angles sum to 90°</li><li>Supplementary angles sum to 180°</li><li>Vertically opposite angles are equal</li><li>Parallel lines: alternate angles equal, co-interior sum = 180°</li></ul>`;},renderForm(c){c.innerHTML=`<label>Mode</label><select id="sgeoMode"><option value="comp">Complementary Angle</option><option value="supp">Supplementary Angle</option><option value="triangle">Triangle Angles</option><option value="exterior">Exterior Angle</option></select><div class="input-row"><div><label>Angle A (°)</label><input type="number" id="sgeoA" value="35" min="0" max="360" step="any"/></div><div><label>Angle B (°)</label><input type="number" id="sgeoB" value="65" min="0" max="360" step="any"/></div></div><button class="solve-btn" onclick="SeniorCh09.solve()">📐 Solve!</button>`;}});
const SeniorCh09={solve(){const mode=document.getElementById('sgeoMode').value,a=parseFloat(document.getElementById('sgeoA').value)||0,b=parseFloat(document.getElementById('sgeoB').value)||0;let steps=[];if(mode==='comp'){const x=90-a;steps=[{type:'teacher-say',speak:`The complement of ${a}° is 90° − ${a}° = ${x}°`,html:`🎤 Complementary of <b>${a}°</b>`,delay:0,board:`90−${a}`},{type:'result',html:`🎉 Complementary angle = <b>${x}°</b>`,speak:`${a} and ${x} together make 90 degrees! 🌟`,delay:900}];}else if(mode==='supp'){const x=180-a;steps=[{type:'teacher-say',speak:`The supplement of ${a}° is 180° − ${a}° = ${x}°`,html:`🎤 Supplementary of <b>${a}°</b>`,delay:0},{type:'result',html:`🎉 Supplementary angle = <b>${x}°</b>`,speak:`${a} and ${x} together make 180 degrees! 🌟`,delay:900,board:`180−${a}=${x}`}];}else if(mode==='triangle'){const c=180-a-b;steps=[{type:'teacher-say',speak:`In a triangle, all angles sum to 180°!`,html:`🎤 Triangle with angles ${a}° and ${b}°. Find the third!`,delay:0,board:`A+B+C=180°`},{type:'highlight',speak:`C = 180° − ${a}° − ${b}° = ${c}°`,html:`<b>Third angle C</b> = 180 − ${a} − ${b} = <span class="math">${c}°</span>`,delay:900},{type:'result',html:`🎉 Third angle = <b>${c}°</b>${c<0?'<br>⚠️ Invalid triangle (angles exceed 180°)':''}`,speak:`The third angle is ${c} degrees. ${c>0&&a>0&&b>0?'Valid triangle! ✓':'Check your angles!'}`,delay:1800}];}else{steps=[{type:'teacher-say',speak:`Exterior angle theorem: exterior = sum of non-adjacent interior angles!`,html:`🎤 Exterior angle of triangle with interior angles ${a}° and ${b}°`,delay:0,board:`ext = A + B`},{type:'result',html:`🎉 Exterior angle = <b>${a+b}°</b>`,speak:`The exterior angle is ${a+b} degrees! 🌟`,delay:900,board:`${a}+${b}=${a+b}°`}];}App.showSteps(steps);}};

SeniorChapters.push({name:'Triangles',icon:'🔺',boardTitle:'Triangle Properties',theory(){return`<h4>🔺 Triangles</h4><div class="formula">Area = ½ × base × height &nbsp;|&nbsp; Heron's: √(s(s-a)(s-b)(s-c))</div><div class="formula">Pythagoras: a² + b² = c² (right triangle)</div><ul><li>Perimeter = a + b + c</li><li>s = semi-perimeter = (a+b+c)/2</li><li>Triangle inequality: sum of any two sides > third side</li></ul>`;},renderForm(c){c.innerHTML=`<label>Mode</label><select id="striMode"><option value="pythag">Pythagoras Theorem</option><option value="heron">Area by Heron's Formula</option><option value="check">Triangle Validity</option></select><div class="input-row"><div><label>Side a</label><input type="number" id="striA" value="3" min="0.1" step="any"/></div><div><label>Side b</label><input type="number" id="striB" value="4" min="0.1" step="any"/></div><div><label>Side c (hyp/third)</label><input type="number" id="striC" value="5" min="0.1" step="any"/></div></div><button class="solve-btn" onclick="SeniorCh10.solve()">🔺 Solve!</button>`;}});
const SeniorCh10={solve(){const mode=document.getElementById('striMode').value,a=parseFloat(document.getElementById('striA').value)||3,b=parseFloat(document.getElementById('striB').value)||4,c=parseFloat(document.getElementById('striC').value)||5;let steps=[];if(mode==='pythag'){const hyp=parseFloat(Math.sqrt(a*a+b*b).toFixed(4));steps=[{type:'teacher-say',speak:`Pythagoras! Given legs ${a} and ${b}, find hypotenuse!`,html:`🎤 Right triangle: legs a=${a}, b=${b} → find hypotenuse c`,delay:0,board:`a²+b²=c²`},{type:'highlight',speak:`a²+b² = ${a}²+${b}² = ${a*a}+${b*b} = ${a*a+b*b}`,html:`<b>a²+b²</b> = ${a*a} + ${b*b} = <span class="math">${a*a+b*b}</span>`,delay:900},{type:'result',html:`🎉 Hypotenuse c = √${a*a+b*b} = <b>${hyp}</b>`,speak:`The hypotenuse is ${hyp} units! 🌟`,delay:1800,board:`c = ${hyp}`}];}else if(mode==='heron'){const s=(a+b+c)/2,inside=s*(s-a)*(s-b)*(s-c),area=inside>0?parseFloat(Math.sqrt(inside).toFixed(4)):'Invalid';steps=[{type:'teacher-say',speak:`Heron's formula for sides ${a}, ${b}, ${c}!`,html:`🎤 Heron's Formula for a=${a}, b=${b}, c=${c}`,delay:0,board:`Heron's Formula`},{type:'highlight',speak:`Semi-perimeter s = (a+b+c)/2 = (${a}+${b}+${c})/2 = ${s}`,html:`<b>s</b> = (${a}+${b}+${c})/2 = <span class="math">${s}</span>`,delay:900},{type:'highlight',speak:`s−a=${s-a}, s−b=${s-b}, s−c=${s-c}. Product inside root: ${inside.toFixed(4)}`,html:`<b>s−a</b>=${s-a} &nbsp; <b>s−b</b>=${s-b} &nbsp; <b>s−c</b>=${s-c}<br>Product = <span class="math">${parseFloat(inside.toFixed(4))}</span>`,delay:1800},{type:'result',html:`🎉 Area = √${parseFloat(inside.toFixed(4))} = <b>${area}</b> sq units`,speak:`The area is ${area} square units by Heron's formula! Incredible! 🌟`,delay:2700,board:`Area=${area}`}];}else{const valid=a+b>c&&b+c>a&&a+c>b;steps=[{type:'teacher-say',speak:`Triangle inequality: check if ${a}, ${b}, ${c} form a valid triangle!`,html:`🎤 Triangle validity: sides ${a}, ${b}, ${c}`,delay:0},{type:'highlight',speak:`${a}+${b}=${a+b} vs ${c}: ${a+b>c?'✓':'✗'}`,html:`<b>${a}+${b}</b> = ${a+b} ${a+b>c?'> ✓':'≤ ✗'} ${c}`,delay:900},{type:'highlight',speak:`${b}+${c}=${b+c} vs ${a}: ${b+c>a?'✓':'✗'}`,html:`<b>${b}+${c}</b> = ${b+c} ${b+c>a?'> ✓':'≤ ✗'} ${a}`,delay:1800},{type:'result',html:`🎉 ${valid?'<b>Valid Triangle! ✅</b>':'<b>Not a valid triangle ❌</b>'}`,speak:`These sides ${valid?'form a valid triangle! 🌟':'do NOT form a valid triangle! 😬'}`,delay:2700}];}App.showSteps(steps);}};
