/* ============================================================
   senior/ch12-statistics.js
   ============================================================ */
/* ch12 - Statistics */
SeniorChapters.push({
  name:'Statistics', icon:'📊', boardTitle:'Mean, Median, Mode',
  theory(){return`<h4>📊 Statistics</h4><div class="formula">Mean = Σx / n &nbsp;|&nbsp; Median = middle value (sorted)</div><div class="formula">Mode = most frequent &nbsp;|&nbsp; Range = Max − Min</div><ul><li>Variance σ² = Σ(x−μ)² / n</li><li>Standard Deviation σ = √Variance</li></ul>`;},
  renderForm(c){c.innerHTML=`<label>Enter data (comma-separated numbers)</label><input type="text" id="sstatData" value="4, 7, 13, 2, 7, 9, 4, 7, 15, 3"/><button class="solve-btn" onclick="SeniorCh12.solve()">📊 Analyse!</button>`;}
});
const SeniorCh12={solve(){
  const raw=document.getElementById('sstatData').value;
  const data=raw.split(',').map(x=>parseFloat(x.trim())).filter(x=>!isNaN(x));
  if(data.length<2){Teacher.say("Please enter at least 2 numbers separated by commas! 😊",2500);return;}
  const sorted=[...data].sort((a,b)=>a-b);
  const n=data.length;
  const mean=parseFloat((data.reduce((s,x)=>s+x,0)/n).toFixed(4));
  const median=n%2===0?(sorted[n/2-1]+sorted[n/2])/2:sorted[Math.floor(n/2)];
  const freq={};data.forEach(x=>freq[x]=(freq[x]||0)+1);
  const maxF=Math.max(...Object.values(freq));
  const modes=Object.keys(freq).filter(k=>freq[k]===maxF);
  const range=sorted[n-1]-sorted[0];
  const variance=parseFloat((data.reduce((s,x)=>s+(x-mean)**2,0)/n).toFixed(4));
  const sd=parseFloat(Math.sqrt(variance).toFixed(4));
  const steps=[
    {type:'teacher-say',speak:`${n} data points! Let's find mean, median, mode and more!`,html:`🎤 Dataset (n=${n}): <span class="math">${data.join(', ')}</span>`,delay:0,board:`Stats (n=${n})`},
    {type:'highlight',speak:`Sort first: ${sorted.join(', ')}`,html:`<b>Sorted:</b> <span class="math">${sorted.join(' , ')}</span>`,delay:900},
    {type:'highlight',speak:`Mean = sum/n = ${data.reduce((s,x)=>s+x,0)}/${n} = ${mean}`,html:`<b>Mean (μ)</b> = Σx/n = ${data.reduce((s,x)=>s+x,0)}/${n} = <span class="math">${mean}</span>`,delay:1800,board:`μ = ${mean}`},
    {type:'highlight',speak:`Median is the middle value of the sorted list: ${median}`,html:`<b>Median</b> = <span class="math">${median}</span>`,delay:2700},
    {type:'highlight',speak:`Mode (most frequent): ${modes.join(', ')} appearing ${maxF} times.`,html:`<b>Mode</b> = <span class="math">${modes.join(', ')}</span> (freq = ${maxF})`,delay:3600},
    {type:'highlight',speak:`Range = Max − Min = ${sorted[n-1]} − ${sorted[0]} = ${range}`,html:`<b>Range</b> = ${sorted[n-1]} − ${sorted[0]} = <span class="math">${range}</span>`,delay:4500},
    {type:'result',html:`🎉 Mean=<b>${mean}</b> | Median=<b>${median}</b> | Mode=<b>${modes.join('/')}</b><br>Range=<b>${range}</b> | σ²=<b>${variance}</b> | σ=<b>${sd}</b>`,speak:`Mean ${mean}, median ${median}, mode ${modes.join(' and ')}, standard deviation ${sd}! 🌟`,delay:5400,board:`μ=${mean} σ=${sd}`}
  ];
  App.showSteps(steps);
}};
