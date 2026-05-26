/* ============================================================
   junior/ch02-addition.js  –  Addition
   ============================================================ */
JuniorChapters.push({
  name: 'Addition',
  icon: '➕',
  boardTitle: 'A + B = ?',

  theory() {
    return `
      <h4>➕ Addition</h4>
      <p>Addition means putting numbers <b>together</b> to find the total.</p>
      <div class="formula">Addend + Addend = Sum</div>
      <ul>
        <li><b>Commutative:</b> 3 + 5 = 5 + 3 (order doesn't matter!)</li>
        <li><b>Associative:</b> (2+3)+4 = 2+(3+4)</li>
        <li>Adding 0 to any number gives the same number.</li>
        <li>Carrying: when a column sum ≥ 10, carry the tens digit!</li>
      </ul>
    `;
  },

  renderForm(container) {
    container.innerHTML = `
      <div class="input-row">
        <div><label>First Number (A)</label>
          <input type="number" id="jaA" value="47" min="0"/></div>
        <div><label>Second Number (B)</label>
          <input type="number" id="jaB" value="38" min="0"/></div>
      </div>
      <button class="solve-btn" onclick="JuniorCh02.solve()">➕ Add!</button>
    `;
  }
});

const JuniorCh02 = {
  solve() {
    const a = parseInt(document.getElementById('jaA').value) || 0;
    const b = parseInt(document.getElementById('jaB').value) || 0;
    const sum = a + b;

    // column-by-column carry explanation (units, tens, hundreds)
    const steps = [];
    steps.push({
      type: 'teacher-say',
      speak: `Great! Let's add ${a} and ${b} step by step! 📝`,
      html: `🎤 Today we'll add <b>${a}</b> and <b>${b}</b>. Let's line them up!`,
      delay: 0, board: `${a} + ${b} = ?`
    });

    // Show column alignment
    const aStr = String(a).padStart(String(Math.max(a,b)).length, ' ');
    const bStr = String(b).padStart(String(Math.max(a,b)).length, ' ');
    const line  = '-'.repeat(String(sum).length + 1);
    steps.push({
      type: '',
      html: `<span class="math">Column alignment:</span><br>
             <pre style="color:var(--yellow);font-size:1.2rem;line-height:1.8;margin-top:6px;">
  ${aStr}
+ ${bStr}
  ${line}
  ${sum}
             </pre>`,
      delay: 900
    });

    // Carry explanation
    const onesA = a % 10, onesB = b % 10;
    const onesSum = onesA + onesB;
    const carry   = Math.floor(onesSum / 10);
    steps.push({
      type: 'highlight',
      speak: `Units column: ${onesA} + ${onesB} = ${onesSum}. ${carry ? `We write ${onesSum % 10} and carry ${carry}!` : `No carrying needed here!`}`,
      html: `<b>Step 1 – Units column:</b> ${onesA} + ${onesB} = <span class="math">${onesSum}</span>
             ${carry ? `→ Write <b>${onesSum % 10}</b>, carry <b>${carry}</b>` : '→ Write <b>' + onesSum + '</b>'}`,
      delay: 1800
    });

    if (a >= 10 || b >= 10) {
      const tensA   = Math.floor((a % 100) / 10);
      const tensB   = Math.floor((b % 100) / 10);
      const tensSum = tensA + tensB + carry;
      steps.push({
        type: 'highlight',
        speak: `Tens column: ${tensA} + ${tensB}${carry ? ' + ' + carry + ' (carry)' : ''} = ${tensSum}.`,
        html: `<b>Step 2 – Tens column:</b> ${tensA} + ${tensB}${carry ? ` + ${carry}(carry)` : ''} = <span class="math">${tensSum}</span>`,
        delay: 2800
      });
    }

    if (a >= 100 || b >= 100) {
      const hunA   = Math.floor(a / 100);
      const hunB   = Math.floor(b / 100);
      const tenC   = Math.floor(((a % 100 / 10 | 0) + (b % 100 / 10 | 0) + carry) / 10);
      const hunSum = hunA + hunB + tenC;
      steps.push({
        type: 'highlight',
        speak: `Hundreds column: ${hunA} + ${hunB} = ${hunSum}.`,
        html: `<b>Step 3 – Hundreds column:</b> ${hunA} + ${hunB}${tenC ? ` + ${tenC}(carry)` : ''} = <span class="math">${hunSum}</span>`,
        delay: 3800
      });
    }

    steps.push({
      type: 'result',
      html: `🎉 <b>${a} + ${b} = ${sum}</b>`,
      speak: `So ${a} plus ${b} equals ${sum}. Well done! 🌟`,
      delay: 4600, board: `${a} + ${b} = ${sum}`
    });

    App.showSteps(steps);
  }
};
