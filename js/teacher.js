/* Mr. Mathew's personality, speech queue, and character animation controller. */
const Teacher = (() => {
  let _blinkTimer = null;
  let _typeTimer = null;
  let _bubbleQueue = [];
  let _isSpeaking = false;

  let el = {};
  function _resolveEls() {
    el = {
      bubble: document.getElementById('speechBubble'),
      bubbleText: document.getElementById('bubbleText'),
      mouth: document.getElementById('charMouth'),
      eyeL: document.getElementById('eyelidLeft'),
      eyeR: document.getElementById('eyelidRight'),
      armL: document.getElementById('armLeft'),
      armR: document.getElementById('armRight'),
      bbContent: document.getElementById('bbContent'),
      wrap: document.getElementById('teacherWrap'),
    };
  }

  const encouragements = [
    'Great question. Let me show you.',
    "Excellent. Let's work through this together.",
    'I like your curiosity. Here we go.',
    'Perfect. Pay close attention now.',
    'Wonderful. I will break this down for you.',
    "That's a smart pick. Let's dive in.",
    'Alright. Watch carefully - this is fun.',
  ];

  const transitions = [
    'Now...',
    'Next up...',
    "Here's the key part...",
    'Watch this carefully...',
    'Almost there...',
    'Because of that...',
    'Therefore...',
  ];

  const reactions = [
    'See how that works?',
    'Pretty cool, right?',
    'Math is beautiful.',
    "You're doing amazing.",
    "That was smoother than it looked.",
  ];

  function randFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function say(text, duration = 3000) {
    _bubbleQueue.push({ text, duration });
    if (!_isSpeaking) _processQueue();
  }

  function _processQueue() {
    if (!_bubbleQueue.length) {
      _isSpeaking = false;
      return;
    }
    _isSpeaking = true;
    const { text, duration } = _bubbleQueue.shift();
    _showBubble(text);
    setTimeout(() => {
      _hideBubble();
      setTimeout(_processQueue, 260);
    }, duration);
  }

  function _showBubble(text) {
    clearInterval(_typeTimer);
    el.bubbleText.innerHTML = '';
    el.bubble.classList.add('visible');
    _startTalking();
    _typeHtml(text);
  }

  function _hideBubble() {
    clearInterval(_typeTimer);
    el.bubble.classList.remove('visible');
    _stopTalking();
  }

  function _typeHtml(html) {
    let i = 0;
    const step = () => {
      if (!el.bubbleText) return;
      if (i >= html.length) {
        clearInterval(_typeTimer);
        return;
      }

      if (html[i] === '<') {
        const end = html.indexOf('>', i);
        if (end !== -1) {
          el.bubbleText.innerHTML += html.slice(i, end + 1);
          i = end + 1;
          return;
        }
      }

      el.bubbleText.innerHTML += html[i];
      i += 1;
    };
    _typeTimer = setInterval(step, 22);
  }

  function _startTalking() {
    el.mouth && el.mouth.classList.add('talking');
    el.armL && el.armL.classList.add('wave');
  }

  function _stopTalking() {
    el.mouth && el.mouth.classList.remove('talking');
    el.armL && el.armL.classList.remove('wave');
  }

  function _startBlink() {
    clearTimeout(_blinkTimer);
    function doBlink() {
      if (!el.eyeL || !el.eyeR) return;
      el.eyeL.classList.add('blink');
      el.eyeR.classList.add('blink');
      setTimeout(() => {
        el.eyeL.classList.remove('blink');
        el.eyeR.classList.remove('blink');
      }, 150);
      _blinkTimer = setTimeout(doBlink, 2400 + Math.random() * 2600);
    }
    _blinkTimer = setTimeout(doBlink, 1200);
  }

  function writeBoard(text) {
    if (!el.bbContent) return;
    el.bbContent.style.opacity = '0';
    setTimeout(() => {
      el.bbContent.innerHTML = text;
      el.bbContent.style.opacity = '1';
    }, 220);
    el.armR && el.armR.classList.add('point');
    setTimeout(() => el.armR && el.armR.classList.remove('point'), 1500);
  }

  function greet() {
    const hour = new Date().getHours();
    const timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    [
      { text: `${timeGreet}! Welcome to MathMentor.`, dur: 2600 },
      { text: "I'm <b>Mr. Mathew</b>, your friendly math teacher.", dur: 3000 },
      { text: 'We will make math feel clear, calm, and exciting.', dur: 3000 },
      { text: "Don't worry - we will solve everything step by step.", dur: 3000 },
      { text: 'Now, tell me which grade path fits you.', dur: 2700 },
    ].forEach(l => say(l.text, l.dur));
  }

  function reactToChapter(name) {
    say(randFrom(encouragements), 2300);
    say(`Let's explore <b>${name}</b> together.`, 2600);
  }

  function narrateSteps(steps) {
    steps.forEach((s, i) => {
      const delay = s.delay ?? i * 800;
      if (s.say) setTimeout(() => say(s.say, s.dur ?? 2600), delay);
      if (s.board) setTimeout(() => writeBoard(s.board), delay + 200);
    });
  }

  function encourage() {
    say(randFrom(encouragements), 2300);
  }

  function react() {
    say(randFrom(reactions), 2300);
  }

  function transition() {
    say(randFrom(transitions), 1500);
  }

  function init() {
    _resolveEls();
    _startBlink();
  }

  return { init, say, greet, writeBoard, reactToChapter, narrateSteps, encourage, react, transition };
})();
