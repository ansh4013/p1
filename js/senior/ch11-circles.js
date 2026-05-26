/* ============================================================
   senior/ch11-circles.js  –  Circles & Arcs
   ============================================================ */
SeniorChapters.push({
  name:'Circles & Arcs', icon:'⭕', boardTitle:'Circle: πr²',
  theory(){return`<h4>⭕ Circles</h4><div class="formula">Area = πr² &nbsp;|&nbsp; Circumference = 2πr</div><div class="formula">Arc length = (θ/360) × 2πr &nbsp;|&nbsp; Sector area = (θ/360) × πr²</div><ul><li>Diameter d = 2r</li><li>Chord, secant, tangent properties</li><li>Tangent ⊥ radius at point of contact</li></ul>`;},
  renderForm(c){c.innerHTML=`<label>Mode</label><select id="scirMode"><option value="basic">Area & Circumference</option><option value="arc">Arc Length & Sector Area</option><option value="chord">Chord Length</option></select><div class="input-row"><div><label>Radius (r)</label><input type="number" id="scirR" value="7" min="0.1" step="any"/></div><div><label>Angle θ° (arcs)</label><input type="number" id="scirTheta" value="60" min="0" max="360" step="any"/></div></div><button class="solve-btn" onclick="SeniorCh11.solve()">⭕ Calculate!</button>`;}
});
const SeniorCh11={solve(){
  const mode=document.getElementById('scirMode').value;
  const r=parseFloat(document.getElementById('scirR').value)||7;
  const theta=parseFloat(document.getElementById('scirTheta').value)||60;
  const pi=Math.PI;
  let steps=[];
  if(mode==='basic'){
    const area=parseFloat((pi*r*r).toFixed(4)),circ=parseFloat((2*pi*r).toFixed(4));
    steps=[
      {type:'teacher-say',speak:`Let's find properties of a circle with radius ${r}!`,html:`🎤 Circle with radius <b>r = ${r}</b>`,delay:0,board:`r = ${r}`},
      {type:'highlight',speak:`Area = π × r² = 3.14159 × ${r}² = ${area}`,html:`<b>Area</b> = πr² = π × ${r}² = <span class="math">${area}</span> sq units`,delay:900,board:`A = πr²`},
      {type:'result',html:`🎉 Area = <b>${area}</b> sq units<br>Circumference = <b>${circ}</b> units`,speak:`Area is ${area} and circumference is ${circ} units! 🌟`,delay:1800,board:`A=${area} C=${circ}`}
    ];
  } else if(mode==='arc'){
    const arcLen=parseFloat(((theta/360)*2*pi*r).toFixed(4));
    const secArea=parseFloat(((theta/360)*pi*r*r).toFixed(4));
    steps=[
      {type:'teacher-say',speak:`Finding arc length and sector area for angle ${theta}°!`,html:`🎤 Angle <b>θ=${theta}°</b>, radius <b>r=${r}</b>`,delay:0,board:`θ=${theta}° r=${r}`},
      {type:'highlight',speak:`Arc length = (θ/360) × 2πr = (${theta}/360) × ${(2*pi*r).toFixed(2)} = ${arcLen}`,html:`<b>Arc Length</b> = (${theta}/360) × 2πr = <span class="math">${arcLen}</span>`,delay:900},
      {type:'result',html:`🎉 Arc Length = <b>${arcLen}</b> units<br>Sector Area = <b>${secArea}</b> sq units`,speak:`Arc length is ${arcLen} and sector area is ${secArea}! 🌟`,delay:1800}
    ];
  } else {
    const chord=parseFloat((2*r*Math.sin(theta*pi/360)).toFixed(4));
    steps=[
      {type:'teacher-say',speak:`Chord subtending ${theta}° at centre of circle with radius ${r}!`,html:`🎤 Chord for θ=${theta}°, r=${r}`,delay:0},
      {type:'highlight',speak:`Chord = 2r × sin(θ/2) = 2×${r}×sin(${theta/2}°) = ${chord}`,html:`<b>Chord</b> = 2r·sin(θ/2) = 2×${r}×sin(${theta/2}°) = <span class="math">${chord}</span>`,delay:900},
      {type:'result',html:`🎉 Chord length = <b>${chord}</b> units`,speak:`The chord is ${chord} units long! 🌟`,delay:1800,board:`chord = ${chord}`}
    ];
  }
  App.showSteps(steps);
}};
