/* ============================================================
   senior/ch14-sets.js
   ============================================================ */
/* ch14 - Sets */
SeniorChapters.push({
  name:'Sets & Venn Diagrams', icon:'🔵', boardTitle:'A ∪ B, A ∩ B',
  theory(){return`<h4>🔵 Sets</h4><p>A set is a <b>collection of distinct elements</b>.</p><div class="formula">Union: A ∪ B (in A or B or both)</div><div class="formula">Intersection: A ∩ B (in both A and B)</div><div class="formula">Difference: A − B (in A but not B)</div><ul><li>n(A∪B) = n(A) + n(B) − n(A∩B)</li><li>Complement A' = U − A</li></ul>`;},
  renderForm(c){c.innerHTML=`<label>Set A (comma-separated)</label><input type="text" id="ssetA" value="1, 2, 3, 4, 5, 6"/><label>Set B (comma-separated)</label><input type="text" id="ssetB" value="4, 5, 6, 7, 8, 9"/><button class="solve-btn" onclick="SeniorCh14.solve()">🔵 Analyse!</button>`;}
});
const SeniorCh14={solve(){
  const parseSet=s=>new Set(s.split(',').map(x=>x.trim()).filter(x=>x!==''));
  const A=parseSet(document.getElementById('ssetA').value);
  const B=parseSet(document.getElementById('ssetB').value);
  const union=[...new Set([...A,...B])].sort();
  const intersection=[...A].filter(x=>B.has(x)).sort();
  const diffAB=[...A].filter(x=>!B.has(x)).sort();
  const diffBA=[...B].filter(x=>!A.has(x)).sort();
  const steps=[
    {type:'teacher-say',speak:`Let's explore sets! A has ${A.size} elements, B has ${B.size} elements.`,html:`🎤 A = {${[...A].join(', ')}} &nbsp;&nbsp; B = {${[...B].join(', ')}}`,delay:0,board:`Sets A and B`},
    {type:'highlight',speak:`A ∪ B (union) contains elements in A or B: ${union.join(', ')}`,html:`<b>A ∪ B</b> = {<span class="math">${union.join(', ')}</span>} &nbsp;|&nbsp; n(A∪B) = ${union.length}`,delay:900,board:`|A∪B|=${union.length}`},
    {type:'highlight',speak:`A ∩ B (intersection) contains elements in both: ${intersection.join(', ')||'∅ (empty)'}`,html:`<b>A ∩ B</b> = {<span class="math">${intersection.join(', ')||'∅'}</span>} &nbsp;|&nbsp; n(A∩B) = ${intersection.length}`,delay:1800},
    {type:'highlight',speak:`A − B (difference) is elements only in A: ${diffAB.join(', ')||'∅'}`,html:`<b>A − B</b> = {<span class="math">${diffAB.join(', ')||'∅'}</span>}`,delay:2700},
    {type:'result',html:`🎉 <b>n(A∪B)</b> = n(A)+n(B)−n(A∩B) = ${A.size}+${B.size}−${intersection.length} = <b>${union.length}</b> ✓`,speak:`Using the formula: ${A.size} plus ${B.size} minus ${intersection.length} equals ${union.length}! 🌟`,delay:3600,board:`n(A∪B)=${union.length}`}
  ];
  App.showSteps(steps);
}};
