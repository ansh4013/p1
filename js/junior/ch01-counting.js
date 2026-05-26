/* ============================================================
   junior/ch01-counting.js  –  Counting Numbers
   ============================================================ */
JuniorChapters.push({
  name: 'Counting Numbers',
  icon: '🔢',
  boardTitle: '1, 2, 3 … Count!',

  theory() {
    return `
      <h4>🔢 Counting Numbers</h4>
      <p>Counting numbers (also called <b>Natural Numbers</b>) are the numbers we use every day to count objects: <b>1, 2, 3, 4, 5 …</b></p>
      <div class="formula">Natural Numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 …</div>
      <p>When we include <b>0</b>, we call them <b>Whole Numbers</b>: 0, 1, 2, 3 …</p>
      <ul>
        <li>Numbers go on <b>forever</b> — there's no biggest number!</li>
        <li>Counting always goes <b>one step at a time</b>.</li>
        <li>We can skip-count by 2s, 5s, or 10s to count faster.</li>
      </ul>
    `;
  },

  renderForm(container) {
    container.innerHTML = `
      <label>Count from:</label>
      <input type="number" id="jcStart" value="1" min="0" max="990"/>
      <label>Count to:</label>
      <input type="number" id="jcEnd" value="20" min="1" max="1000"/>
      <label>Skip-count by:</label>
      <input type="number" id="jcSkip" value="1" min="1" max="100"/>
      <button class="solve-btn" onclick="JuniorCh01.solve()">▶ Count!</button>
    `;
  }
});

const JuniorCh01 = {
  solve() {
    const start = parseInt(document.getElementById('jcStart').value) || 1;
    const end   = parseInt(document.getElementById('jcEnd').value)   || 20;
    const skip  = parseInt(document.getElementById('jcSkip').value)  || 1;

    if (end <= start) {
      Teacher.say("Hmm, 'Count to' should be bigger than 'Count from'! 😅", 2500);
      return;
    }
    if (end - start > 500) {
      Teacher.say("That's a very long range! Try something under 500 steps 😊", 2500);
      return;
    }

    const sequence = [];
    for (let n = start; n <= end; n += skip) sequence.push(n);

    const steps = [
      {
        type: 'teacher-say',
        speak: `Let's count from ${start} to ${end}, skipping by ${skip}! 🎉`,
        html: `🎤 Let's count from <b>${start}</b> to <b>${end}</b>, skip-counting by <b>${skip}</b>!`,
        delay: 0,
        board: `Count by ${skip}s`
      },
      {
        type: '',
        html: `<span class="math">Sequence:</span><br>
               <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
                 ${sequence.map(n =>
                   `<span style="background:rgba(255,217,61,.15);border:1px solid var(--yellow);
                    border-radius:8px;padding:4px 10px;font-family:'Courier New';
                    color:var(--yellow);">${n}</span>`).join('')}
               </div>`,
        delay: 1000
      },
      {
        type: 'result',
        html: `✅ Total numbers counted: <b>${sequence.length}</b>`,
        speak: `There are ${sequence.length} numbers in that sequence. You're a great counter! ⭐`,
        delay: sequence.length * 30 + 1200
      }
    ];
    App.showSteps(steps);
  }
};
