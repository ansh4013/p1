/* Main application controller for screens, subjects, chapters, and workspace rendering. */
const App = (() => {
  let _subject = 'math';
  let _grade = null;
  let _currentChapter = null;

  const state = {
    gradeOptions: [
      { id: 'junior', title: 'Junior Mode', sub: 'Below Grade 6' },
      { id: 'senior', title: 'Senior Mode', sub: 'Grades 6-9' },
    ],
  };

  function _showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function _showSection(id) {
    ['secGrade', 'secChapters', 'secWorkspace'].forEach(s => {
      const el = document.getElementById(s);
      if (el) el.classList.toggle('hidden', s !== id);
    });
  }

  function selectTeacher(name) {
    if (!['math', 'science', 'geography'].includes(name)) return;
    _subject = name;
    _grade = null;
    _currentChapter = null;
    document.body.dataset.subject = name;
    _configureSubject();
    _showScreen('screenClassroom');
    _showSection('secGrade');
    Teacher.init();
    _updateStats();

    if (name === 'science') {
      Teacher.say("Welcome to the science lab. I'm Mr. Scientia.", 2800);
      Teacher.say('We will learn theory, then test ideas with simulators.', 3200);
      Teacher.writeBoard('Science Lab');
    } else if (name === 'geography') {
      Teacher.say("Welcome to the geography hub. I'm Mr. Gain.", 2800);
      Teacher.say('We can check live weather, explore countries, maps, climates, and capitals.', 3400);
      Teacher.writeBoard('Weather + World Tools');
    } else {
      setTimeout(() => Teacher.greet(), 600);
      Teacher.writeBoard('y = mx + b');
    }
  }

  function _configureSubject() {
    const logoText = document.querySelector('.logo span:last-child');
    const title = document.querySelector('.stage-copy h2');
    const copy = document.querySelector('.stage-copy p:not(.eyebrow)');
    const gradeQuestion = document.getElementById('gradeQuestion');
    const gradeA = document.getElementById('gradeBtnA');
    const gradeB = document.getElementById('gradeBtnB');
    const badge = document.getElementById('gradeBadge');

    if (badge) badge.style.display = 'none';

    if (_subject === 'science') {
      state.gradeOptions = [
        { id: 'class6', title: 'Class 6', sub: 'Basics + nature labs' },
        { id: 'class8', title: 'Class 8', sub: 'Physics + chemistry labs' },
      ];
      if (logoText) logoText.textContent = 'ScienceMentor';
      if (title) title.textContent = 'Explore, test, discover.';
      if (copy) copy.textContent = 'Choose Class 6 or Class 8, read clear theory, and run interactive science simulators.';
      gradeQuestion.textContent = 'Which science class should we open?';
    } else if (_subject === 'geography') {
      state.gradeOptions = [
        { id: 'weather', title: 'Weather Lab', sub: 'Location + forecast tools' },
        { id: 'world', title: 'World Skills', sub: 'Countries, capitals, maps' },
      ];
      if (logoText) logoText.textContent = 'GeoMentor';
      if (title) title.textContent = 'Locate, compare, understand.';
      if (copy) copy.textContent = 'Use live weather, location fallback, country facts, distance tools, climate notes, and map quizzes.';
      gradeQuestion.textContent = 'Which geography toolkit should we open?';
    } else {
      state.gradeOptions = [
        { id: 'junior', title: 'Junior Mode', sub: 'Below Grade 6' },
        { id: 'senior', title: 'Senior Mode', sub: 'Grades 6-9' },
      ];
      if (logoText) logoText.textContent = 'MathMentor';
      if (title) title.textContent = 'Ask, solve, learn.';
      if (copy) copy.textContent = 'Pick a level, choose a chapter, and Mr. Mathew will walk through each answer step by step.';
      gradeQuestion.textContent = 'Which math path should we open?';
    }

    [gradeA, gradeB].forEach((btn, index) => {
      const option = state.gradeOptions[index];
      btn.querySelector('span').textContent = option.title;
      btn.querySelector('small').textContent = option.sub;
    });
  }

  function selectGrade(grade) {
    _grade = grade;
    const option = state.gradeOptions.find(g => g.id === grade);
    const badge = document.getElementById('gradeBadge');
    badge.textContent = option ? option.title : grade;
    badge.style.display = 'block';

    Teacher.say(`${option ? option.title : grade} - great choice!`, 2200);
    Teacher.say(_subject === 'math' ? 'Here are your chapters. Pick one to start!' : 'Pick a chapter to open its theory and interactive tool.', 2600);
    Teacher.writeBoard(_subject === 'science' ? `${option.title} Science` : _subject === 'geography' ? option.title : grade === 'junior' ? 'Junior Chapters' : 'Senior Chapters');

    _renderChapters(grade);
    _showSection('secChapters');
  }

  function _chapterList(grade) {
    if (_subject === 'science') return ScienceChapters[grade] || [];
    if (_subject === 'geography') return GeographyChapters[grade] || [];
    return grade === 'junior' ? JuniorChapters : SeniorChapters;
  }

  function _renderChapters(grade) {
    const grid = document.getElementById('chapterGrid');
    grid.innerHTML = '';
    const list = _chapterList(grade);

    list.forEach((ch, i) => {
      const btn = document.createElement('button');
      btn.className = 'chapter-btn';
      btn.innerHTML = `<span class="ch-num">Chapter ${i + 1}</span>${ch.icon ?? ''} ${ch.name}`;
      btn.onclick = () => openChapter(ch);
      grid.appendChild(btn);
    });
  }

  function openChapter(ch) {
    _currentChapter = ch;
    document.getElementById('wsTitle').textContent = `${ch.icon ?? ''} ${ch.name}`;
    document.getElementById('btnPractice').textContent = ch.simulator ? 'Simulator' : 'New Question';
    document.querySelector('#secWorkspace .panel-kicker').textContent = ch.simulator ? 'Theory + simulator' : 'Practice space';
    _clearWorkspace();
    _clearSteps();
    _markActiveChapter(ch);
    Teacher.reactToChapter(ch.name);

    if (typeof ch.renderForm === 'function') {
      ch.renderForm(document.getElementById('wsBody'));
    } else if (typeof ch.simulator === 'function') {
      ch.simulator(document.getElementById('wsBody'));
    }
    _showSection('secWorkspace');
  }

  function showTheory() {
    if (!_currentChapter) return;
    _clearSteps();
    Teacher.say('Let me explain the theory.', 1900);
    Teacher.say(_subject === 'science' ? 'Read the idea, then try the simulator.' : 'This is the foundation, so watch the pattern closely.', 2600);
    if (typeof _currentChapter.theory === 'function') {
      const html = _currentChapter.theory();
      _appendStep(`<div class="theory-box">${html}</div>`, '');
    }
    Teacher.writeBoard(_currentChapter.boardTitle ?? _currentChapter.name);
  }

  function newQuestion() {
    if (!_currentChapter) return;
    _clearSteps();
    Teacher.encourage();
    _clearWorkspace();
    if (typeof _currentChapter.simulator === 'function') {
      _currentChapter.simulator(document.getElementById('wsBody'));
    } else if (typeof _currentChapter.renderForm === 'function') {
      _currentChapter.renderForm(document.getElementById('wsBody'));
    }
  }

  function showSteps(steps) {
    _clearSteps();
    const container = document.getElementById('wsSteps');

    steps.forEach((s, i) => {
      const delay = s.delay ?? i * 600;
      setTimeout(() => {
        const card = document.createElement('div');
        card.className = `step-card ${s.type ?? ''}`;
        card.innerHTML = s.html;
        container.appendChild(card);
        if (s.speak) Teacher.say(s.speak, s.speakDur ?? 2500);
        if (s.board) Teacher.writeBoard(s.board);
        container.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, delay);
    });
  }

  function _appendStep(html, cls = '') {
    const container = document.getElementById('wsSteps');
    const card = document.createElement('div');
    card.className = `step-card ${cls}`;
    card.innerHTML = html;
    container.appendChild(card);
  }

  function _clearSteps() {
    document.getElementById('wsSteps').innerHTML = '';
  }

  function _clearWorkspace() {
    document.getElementById('wsBody').innerHTML = '';
  }

  function goBack(to) {
    if (to === 'grade') {
      _currentChapter = null;
      _showSection('secGrade');
      Teacher.say("No problem. Let's pick again.", 2300);
      document.getElementById('gradeBadge').style.display = 'none';
    } else if (to === 'chapters') {
      _currentChapter = null;
      _clearWorkspace();
      _clearSteps();
      _renderChapters(_grade);
      _showSection('secChapters');
      Teacher.say('Back to chapters - choose another one.', 2300);
    }
  }

  function _markActiveChapter(ch) {
    document.querySelectorAll('.chapter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.includes(ch.name));
    });
  }

  function _updateStats() {
    const stat = document.getElementById('statChapters');
    if (!stat) return;
    if (_subject === 'science' && typeof ScienceChapters !== 'undefined') {
      stat.textContent = ScienceChapters.class6.length + ScienceChapters.class8.length;
    } else if (_subject === 'geography' && typeof GeographyChapters !== 'undefined') {
      stat.textContent = GeographyChapters.weather.length + GeographyChapters.world.length;
    } else if (typeof JuniorChapters !== 'undefined' && typeof SeniorChapters !== 'undefined') {
      stat.textContent = JuniorChapters.length + SeniorChapters.length;
    }
  }

  return {
    get gradeOptions() { return state.gradeOptions; },
    selectTeacher,
    selectGrade,
    openChapter,
    showTheory,
    newQuestion,
    showSteps,
    goBack,
  };
})();
