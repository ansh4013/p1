/* ============================================================
   senior/ch13-probability.js
   ============================================================ */
/* ch13 - Probability */
SeniorChapters.push({
  name:'Probability', icon:'🎲', boardTitle:'P(A) = favourable/total',
  theory(){return`<h4>🎲 Probability</h4><div class="formula">P(A) = Favourable outcomes / Total outcomes</div><div class="formula">P(A') = 1 − P(A) &nbsp;|&nbsp; 0 ≤ P(A) ≤ 1</div><ul><li>P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</li><li>Independent events: P(A ∩ B) = P(A) × P(B)</li></ul>`;},
  renderForm(c){c.innerHTML=`<label>Scenario</label><select id="sprobMode"><option value="basic">Basic Probability</option><option value="dice">Dice Roll</option><option value="card">Card from Deck</option><option value="combined">Combined Events</option></select><div class="input-row"><div><label>Favourable (A)</label><input type="number" id="sprobA" value="3" min="0"/></div><div><label>Total (N)</label><input type="number" id="sprobN" value="10" min="1"/></div></div><button class="solve-btn" onclick="SeniorCh13.solve()">🎲 Calculate!</button>`;}
});
const SeniorCh13={solve(){
  const mode=document.getElementById('sprobMode').value;
  const a=parseInt(document.getElementById('sprobA').value)||1;
  const n=parseInt(document.getElementById('sprobN').value)||6;
  let steps=[];
  if(mode==='basic'){
    const p=parseFloat((a/n).toFixed(4)), pp=parseFloat(((n-a)/n).toFixed(4));
    steps=[
      {type:'teacher-say',speak:`${a} favourable out of ${n}. Let's find the probability!`,html:`🎤 P(A) with <b>${a} favourable</b> out of <b>${n} total</b>`,delay:0},
      {type:'highlight',speak:`P(A) = ${a}/${n} = ${p}. As a percentage: ${(p*100).toFixed(1)}%`,html:`<b>P(A)</b> = ${a}/${n} = <span class="math">${p}</span> = <b>${(p*100).toFixed(1)}%</b>`,delay:900,board:`P = ${p}`},
      {type:'result',html:`🎉 P(A) = <b>${p}</b> &nbsp;|&nbsp; P(A') = <b>${pp}</b>`,speak:`Probability is ${p} and its complement is ${pp}! 🌟`,delay:1800}
    ];
  } else if(mode==='dice'){
    const faces=[1,2,3,4,5,6];const pEven=3/6,pOdd=3/6,pPrime=3/6;
    steps=[
      {type:'teacher-say',speak:`Rolling a fair 6-sided die! Let's explore the probabilities!`,html:`🎤 Fair Die: {1, 2, 3, 4, 5, 6} — 6 equally likely outcomes`,delay:0,board:`Die Probabilities`},
      {type:'highlight',speak:`P(even) = 3/6 = 0.5. Even numbers: 2, 4, 6`,html:`<b>P(Even):</b> {2,4,6} → 3/6 = <span class="math">0.5 (50%)</span>`,delay:900},
      {type:'highlight',speak:`P(prime) = 3/6 = 0.5. Prime numbers: 2, 3, 5`,html:`<b>P(Prime):</b> {2,3,5} → 3/6 = <span class="math">0.5 (50%)</span>`,delay:1800},
      {type:'result',html:`🎉 P(specific number) = <b>1/6 ≈ 0.167</b><br>P(> ${a>6?6:a}) = <b>${Math.max(0,6-Math.min(a,6))}/6</b>`,speak:`Each face has 1 in 6 chance. Probability is fascinating! 🎲`,delay:2700}
    ];
  } else if(mode==='card'){
    steps=[
      {type:'teacher-say',speak:`A standard deck has 52 cards, 4 suits, 13 ranks each!`,html:`🎤 Standard Deck: 52 cards — 4 suits (♠♥♦♣) × 13 ranks`,delay:0,board:`52-card Deck`},
      {type:'highlight',speak:`P(Ace) = 4/52 = 1/13 ≈ 0.077`,html:`<b>P(Ace)</b> = 4/52 = 1/13 ≈ <span class="math">0.077</span>`,delay:900},
      {type:'highlight',speak:`P(Heart) = 13/52 = 1/4 = 0.25`,html:`<b>P(♥ Heart)</b> = 13/52 = 1/4 = <span class="math">0.25</span>`,delay:1800},
      {type:'result',html:`🎉 P(Face card) = <b>12/52 = 3/13 ≈ 0.231</b><br>P(Red card) = <b>26/52 = 0.5</b>`,speak:`Face cards, aces, suits — all follow probability rules! 🌟`,delay:2700}
    ];
  } else {
    const pA=parseFloat((a/n).toFixed(4)),pB=parseFloat(((n-a)/n).toFixed(4));
    const pAB=parseFloat((pA*pB).toFixed(4)),pAorB=parseFloat((pA+pB-pAB).toFixed(4));
    steps=[
      {type:'teacher-say',speak:`Combined events! Let P(A)=${pA}, P(B)=${pB} (complementary)`,html:`🎤 P(A) = ${pA}, P(B) = ${pB}`,delay:0},
      {type:'highlight',speak:`P(A and B) = P(A)×P(B) = ${pA}×${pB} = ${pAB} (if independent)`,html:`<b>P(A∩B)</b> = P(A)×P(B) = ${pA}×${pB} = <span class="math">${pAB}</span>`,delay:900},
      {type:'result',html:`🎉 P(A∩B) = <b>${pAB}</b><br>P(A∪B) = P(A)+P(B)−P(A∩B) = <b>${pAorB}</b>`,speak:`Intersection probability is ${pAB}! 🌟`,delay:1800}
    ];
  }
  App.showSteps(steps);
}};
