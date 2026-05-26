/* ============================================================
   junior/ch08-geometry.js
   ============================================================ */
JuniorChapters.push({
  name:'Basic Geometry', icon:'📐', boardTitle:'Area & Perimeter',
  theory(){return`<h4>📐 Basic Geometry</h4><p>Geometry is the study of <b>shapes, sizes, and spaces</b>.</p><div class="formula">Rectangle: Area = l × w &nbsp;|&nbsp; Perimeter = 2(l+w)</div><div class="formula">Square: Area = s² &nbsp;|&nbsp; Perimeter = 4s</div><div class="formula">Triangle: Area = ½ × b × h</div><div class="formula">Circle: Area = πr² &nbsp;|&nbsp; Circumference = 2πr</div>`;},
  renderForm(c){c.innerHTML=`<label>Shape</label><select id="jgeoShape" onchange="JuniorCh08.updateFields()"><option value="rect">Rectangle</option><option value="square">Square</option><option value="triangle">Triangle</option><option value="circle">Circle</option></select><div id="jgeoFields"></div><button class="solve-btn" onclick="JuniorCh08.solve()">📐 Calculate!</button>`;JuniorCh08.updateFields();}
});
const JuniorCh08={
  updateFields(){
    const s=document.getElementById('jgeoShape').value;
    const f=document.getElementById('jgeoFields');
    const map={
      rect:`<div class="input-row"><div><label>Length</label><input type="number" id="jgL" value="8" min="0.1" step="0.1"/></div><div><label>Width</label><input type="number" id="jgW" value="5" min="0.1" step="0.1"/></div></div>`,
      square:`<label>Side</label><input type="number" id="jgS" value="6" min="0.1" step="0.1"/>`,
      triangle:`<div class="input-row"><div><label>Base</label><input type="number" id="jgB" value="10" min="0.1" step="0.1"/></div><div><label>Height</label><input type="number" id="jgH" value="7" min="0.1" step="0.1"/></div></div>`,
      circle:`<label>Radius</label><input type="number" id="jgR" value="5" min="0.1" step="0.1"/>`
    };
    f.innerHTML=map[s]||'';
  },
  solve(){
    const s=document.getElementById('jgeoShape').value;
    let steps=[{type:'teacher-say',speak:'Let me help you find area and perimeter!',html:'🎤 Geometry time! Let\'s calculate! 📐',delay:0,board:'Geometry'}];
    if(s==='rect'){
      const l=parseFloat(document.getElementById('jgL').value)||1, w=parseFloat(document.getElementById('jgW').value)||1;
      steps.push({type:'highlight',speak:`Area = length × width = ${l} × ${w} = ${l*w}`,html:`<b>Area</b> = l × w = ${l} × ${w} = <span class="math">${l*w}</span>`,delay:900,board:`A = ${l}×${w}`});
      steps.push({type:'highlight',speak:`Perimeter = 2 × (${l} + ${w}) = ${2*(l+w)}`,html:`<b>Perimeter</b> = 2(l+w) = 2(${l}+${w}) = <span class="math">${2*(l+w)}</span>`,delay:1800});
      steps.push({type:'result',html:`🎉 Area = <b>${l*w}</b> sq units &nbsp;|&nbsp; Perimeter = <b>${2*(l+w)}</b> units`,speak:`Area is ${l*w} and perimeter is ${2*(l+w)}. Perfect! 🌟`,delay:2700,board:`A=${l*w} P=${2*(l+w)}`});
    } else if(s==='square'){
      const sd=parseFloat(document.getElementById('jgS').value)||1;
      steps.push({type:'highlight',speak:`Area = side² = ${sd}² = ${sd*sd}`,html:`<b>Area</b> = s² = ${sd}² = <span class="math">${sd*sd}</span>`,delay:900});
      steps.push({type:'result',html:`🎉 Area = <b>${sd*sd}</b> sq units &nbsp;|&nbsp; Perimeter = <b>${4*sd}</b> units`,speak:`Area is ${sd*sd}, perimeter is ${4*sd}. Brilliant! ✨`,delay:1800,board:`A=${sd*sd} P=${4*sd}`});
    } else if(s==='triangle'){
      const b=parseFloat(document.getElementById('jgB').value)||1, h=parseFloat(document.getElementById('jgH').value)||1;
      const area=0.5*b*h;
      steps.push({type:'highlight',speak:`Area = ½ × base × height = 0.5 × ${b} × ${h} = ${area}`,html:`<b>Area</b> = ½ × b × h = 0.5 × ${b} × ${h} = <span class="math">${area}</span>`,delay:900,board:`½×${b}×${h}`});
      steps.push({type:'result',html:`🎉 Triangle Area = <b>${area}</b> sq units`,speak:`The triangle's area is ${area} square units. Superb! 🌟`,delay:1800});
    } else {
      const r=parseFloat(document.getElementById('jgR').value)||1;
      const area=(Math.PI*r*r).toFixed(3), circ=(2*Math.PI*r).toFixed(3);
      steps.push({type:'highlight',speak:`Area = π × r² = 3.14159 × ${r}² = ${area}`,html:`<b>Area</b> = πr² = π × ${r}² = <span class="math">${area}</span>`,delay:900});
      steps.push({type:'highlight',speak:`Circumference = 2πr = 2 × 3.14159 × ${r} = ${circ}`,html:`<b>Circumference</b> = 2πr = <span class="math">${circ}</span>`,delay:1800});
      steps.push({type:'result',html:`🎉 Area ≈ <b>${area}</b> sq units &nbsp;|&nbsp; Circumference ≈ <b>${circ}</b> units`,speak:`Area is ${area} and circumference is ${circ}. Amazing! 🌟`,delay:2700,board:`A≈${area}`});
    }
    App.showSteps(steps);
  }
};
