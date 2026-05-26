const ScienceChapters = {
  class6: [
    {
      name: 'Food Components',
      icon: '🥗',
      boardTitle: 'Food = nutrients + energy',
      theory() {
        return `<h4>Food Components</h4><p>Food gives the body energy, helps it grow, repairs tissues, and protects it from disease.</p><ul><li><b>Carbohydrates</b> give quick energy.</li><li><b>Proteins</b> help body growth and repair.</li><li><b>Fats</b> store energy and keep us warm.</li><li><b>Vitamins and minerals</b> protect the body and keep organs working.</li><li><b>Water and roughage</b> help digestion and waste removal.</li></ul><div class="formula">Balanced diet = energy food + body-building food + protective food</div>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Balanced Plate Builder</h4><label>Carbohydrates</label><input type="range" id="sciCarb" min="0" max="100" value="45" oninput="ScienceSim.plate()"><label>Proteins</label><input type="range" id="sciProtein" min="0" max="100" value="25" oninput="ScienceSim.plate()"><label>Vitamins / Minerals</label><input type="range" id="sciVitamin" min="0" max="100" value="30" oninput="ScienceSim.plate()"><div class="plate-meter"><span id="plateCarb"></span><span id="plateProtein"></span><span id="plateVitamin"></span></div><button class="solve-btn" onclick="ScienceSim.plate()">Check Plate</button><p id="plateResult" class="sim-result"></p></div>`;
        ScienceSim.plate();
      },
    },
    {
      name: 'Separation of Substances',
      icon: '🧪',
      boardTitle: 'Choose the method',
      theory() {
        return `<h4>Separation of Substances</h4><p>Mixtures can be separated by using differences in size, weight, solubility, magnetism, or boiling point.</p><ul><li><b>Handpicking:</b> visible solids like stones from rice.</li><li><b>Sieving:</b> separates particles of different sizes.</li><li><b>Filtration:</b> separates insoluble solid from liquid.</li><li><b>Evaporation:</b> gets dissolved solid back from solution.</li><li><b>Magnetic separation:</b> removes magnetic materials.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Method Selector</h4><label>Mixture</label><select id="sepMix" onchange="ScienceSim.separation()"><option value="sand-water">Sand + Water</option><option value="salt-water">Salt + Water</option><option value="iron-sand">Iron filings + Sand</option><option value="flour-bran">Flour + Bran</option></select><button class="solve-btn" onclick="ScienceSim.separation()">Find Method</button><p id="sepResult" class="sim-result"></p></div>`;
        ScienceSim.separation();
      },
    },
    {
      name: 'Changes Around Us',
      icon: '🔁',
      boardTitle: 'Reversible or not?',
      theory() {
        return `<h4>Changes Around Us</h4><p>A change means something becomes different in shape, size, state, or properties.</p><ul><li><b>Reversible change:</b> can be undone, like melting ice.</li><li><b>Irreversible change:</b> cannot easily be undone, like burning paper.</li><li><b>Physical change:</b> no new substance is formed.</li><li><b>Chemical change:</b> a new substance is formed.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Change Classifier</h4><label>Change</label><select id="changeCase" onchange="ScienceSim.changeType()"><option value="ice">Melting ice</option><option value="paper">Burning paper</option><option value="dough">Making dough</option><option value="water">Boiling water</option></select><button class="solve-btn" onclick="ScienceSim.changeType()">Classify</button><p id="changeResult" class="sim-result"></p></div>`;
        ScienceSim.changeType();
      },
    },
    {
      name: 'Living Organisms',
      icon: '🌱',
      boardTitle: 'Habitat + adaptation',
      theory() {
        return `<h4>Living Organisms and Habitats</h4><p>A habitat is the natural home of a plant or animal. Organisms survive because they have adaptations suited to their habitat.</p><ul><li>Fish have gills and streamlined bodies for water.</li><li>Cactus has spines and thick stems for deserts.</li><li>Camels have wide feet and can store water for dry areas.</li><li>Plants and animals need food, water, air, and suitable temperature.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Habitat Matcher</h4><label>Organism</label><select id="habitatOrg" onchange="ScienceSim.habitat()"><option value="fish">Fish</option><option value="cactus">Cactus</option><option value="camel">Camel</option><option value="frog">Frog</option></select><button class="solve-btn" onclick="ScienceSim.habitat()">Show Adaptation</button><p id="habitatResult" class="sim-result"></p></div>`;
        ScienceSim.habitat();
      },
    },
    {
      name: 'Motion and Measurement',
      icon: '📏',
      boardTitle: 'Speed = distance / time',
      theory() {
        return `<h4>Motion and Measurement</h4><p>Motion is a change in position with time. Measurement compares an unknown quantity with a standard unit.</p><ul><li>SI unit of length is metre.</li><li>Uniform motion covers equal distances in equal time.</li><li>Non-uniform motion covers unequal distances in equal time.</li></ul><div class="formula">Speed = Distance / Time</div>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Speed Calculator</h4><div class="input-row"><div><label>Distance (m)</label><input type="number" id="speedD" value="120"></div><div><label>Time (s)</label><input type="number" id="speedT" value="10"></div></div><button class="solve-btn" onclick="ScienceSim.speed()">Calculate Speed</button><p id="speedResult" class="sim-result"></p></div>`;
        ScienceSim.speed();
      },
    },
    {
      name: 'Light and Shadows',
      icon: '💡',
      boardTitle: 'Light travels straight',
      theory() {
        return `<h4>Light and Shadows</h4><p>Light helps us see objects. It travels in straight lines. A shadow forms when an opaque object blocks light.</p><ul><li><b>Transparent:</b> light passes through.</li><li><b>Translucent:</b> some light passes.</li><li><b>Opaque:</b> light does not pass.</li><li>Shadow size changes with distance from the light source.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Shadow Size Simulator</h4><label>Object distance from light</label><input type="range" id="shadowDistance" min="1" max="10" value="4" oninput="ScienceSim.shadow()"><div class="shadow-lab"><span class="lamp"></span><span id="shadowObject"></span><span id="shadowShape"></span></div><p id="shadowResult" class="sim-result"></p></div>`;
        ScienceSim.shadow();
      },
    },
    {
      name: 'Electricity and Circuits',
      icon: '🔌',
      boardTitle: 'Closed circuit = glow',
      theory() {
        return `<h4>Electricity and Circuits</h4><p>An electric circuit is a complete path through which current flows. A bulb glows only when the circuit is closed.</p><ul><li>Cell provides electrical energy.</li><li>Wire carries current.</li><li>Switch opens or closes the circuit.</li><li>Conductors allow current; insulators do not.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Bulb Circuit</h4><label class="toggle-line"><input type="checkbox" id="circuitSwitch" onchange="ScienceSim.circuit()"> Close switch</label><div class="circuit-demo"><span class="cell">+ -</span><span class="wire"></span><span id="bulb" class="bulb"></span></div><p id="circuitResult" class="sim-result"></p></div>`;
        ScienceSim.circuit();
      },
    },
    {
      name: 'Water Cycle',
      icon: '🌧️',
      boardTitle: 'Evaporation -> Rain',
      theory() {
        return `<h4>Water Cycle</h4><p>The water cycle is the continuous movement of water between Earth and atmosphere.</p><ul><li><b>Evaporation:</b> water changes into vapour.</li><li><b>Condensation:</b> vapour cools to form clouds.</li><li><b>Precipitation:</b> water falls as rain, snow, or hail.</li><li><b>Collection:</b> water gathers in rivers, lakes, and oceans.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Water Cycle Explorer</h4><label>Sun heat</label><input type="range" id="waterHeat" min="0" max="100" value="55" oninput="ScienceSim.waterCycle()"><div class="water-cycle"><span id="vapour"></span><span class="cloud"></span><span id="rain"></span><span class="pond"></span></div><p id="waterResult" class="sim-result"></p></div>`;
        ScienceSim.waterCycle();
      },
    },
  ],
  class8: [
    {
      name: 'Crop Production',
      icon: '🌾',
      boardTitle: 'Agriculture steps',
      theory() {
        return `<h4>Crop Production and Management</h4><p>Crop production means growing the same kind of plants on a large scale for food.</p><ul><li>Preparation of soil loosens and aerates soil.</li><li>Sowing places seeds at proper depth and spacing.</li><li>Manure and fertilisers add nutrients.</li><li>Irrigation supplies water.</li><li>Harvesting collects mature crops.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Crop Yield Estimator</h4><label>Water</label><input type="range" id="cropWater" min="0" max="100" value="60" oninput="ScienceSim.crop()"><label>Nutrients</label><input type="range" id="cropNutrients" min="0" max="100" value="65" oninput="ScienceSim.crop()"><label>Sunlight</label><input type="range" id="cropSun" min="0" max="100" value="70" oninput="ScienceSim.crop()"><p id="cropResult" class="sim-result"></p></div>`;
        ScienceSim.crop();
      },
    },
    {
      name: 'Microorganisms',
      icon: '🦠',
      boardTitle: 'Helpful and harmful',
      theory() {
        return `<h4>Microorganisms</h4><p>Microorganisms are tiny living organisms seen with a microscope. They include bacteria, fungi, protozoa, algae, and viruses.</p><ul><li>Some help make curd, bread, and medicines.</li><li>Some cause diseases.</li><li>Preservation slows microbial growth.</li><li>Vaccines help the body fight disease-causing microbes.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Microbe Growth</h4><label>Temperature</label><input type="range" id="microTemp" min="0" max="100" value="55" oninput="ScienceSim.microbe()"><label>Moisture</label><input type="range" id="microMoisture" min="0" max="100" value="70" oninput="ScienceSim.microbe()"><div class="microbe-dish" id="microDish"></div><p id="microResult" class="sim-result"></p></div>`;
        ScienceSim.microbe();
      },
    },
    {
      name: 'Force and Pressure',
      icon: '🧲',
      boardTitle: 'Pressure = Force / Area',
      theory() {
        return `<h4>Force and Pressure</h4><p>A force is a push or pull. Pressure tells how much force acts on a unit area.</p><ul><li>Force can change speed, direction, or shape.</li><li>Pressure increases when force increases.</li><li>Pressure decreases when contact area increases.</li><li>Liquids and gases exert pressure in all directions.</li></ul><div class="formula">Pressure = Force / Area</div>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Pressure Calculator</h4><div class="input-row"><div><label>Force (N)</label><input type="number" id="forceN" value="80"></div><div><label>Area (m²)</label><input type="number" id="areaM" value="4"></div></div><button class="solve-btn" onclick="ScienceSim.pressure()">Calculate Pressure</button><p id="pressureResult" class="sim-result"></p></div>`;
        ScienceSim.pressure();
      },
    },
    {
      name: 'Friction',
      icon: '🛞',
      boardTitle: 'Friction opposes motion',
      theory() {
        return `<h4>Friction</h4><p>Friction is a force that opposes motion between two surfaces in contact.</p><ul><li>Rough surfaces create more friction.</li><li>Smooth surfaces create less friction.</li><li>Friction helps us walk and write.</li><li>Friction produces heat and can wear out surfaces.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Friction Ramp</h4><label>Surface roughness</label><input type="range" id="roughness" min="0" max="100" value="40" oninput="ScienceSim.friction()"><label>Push force</label><input type="range" id="pushForce" min="0" max="100" value="55" oninput="ScienceSim.friction()"><div class="ramp"><span id="block"></span></div><p id="frictionResult" class="sim-result"></p></div>`;
        ScienceSim.friction();
      },
    },
    {
      name: 'Sound',
      icon: '🔊',
      boardTitle: 'Vibration makes sound',
      theory() {
        return `<h4>Sound</h4><p>Sound is produced by vibrating objects. It needs a medium such as air, water, or solid to travel.</p><ul><li>Amplitude affects loudness.</li><li>Frequency affects pitch.</li><li>Human audible range is about 20 Hz to 20,000 Hz.</li><li>Noise pollution can harm hearing and health.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Sound Wave Simulator</h4><label>Frequency</label><input type="range" id="soundFreq" min="1" max="20" value="8" oninput="ScienceSim.sound()"><label>Amplitude</label><input type="range" id="soundAmp" min="5" max="60" value="28" oninput="ScienceSim.sound()"><canvas id="soundCanvas" width="320" height="120"></canvas><p id="soundResult" class="sim-result"></p></div>`;
        ScienceSim.sound();
      },
    },
    {
      name: 'Chemical Effects of Current',
      icon: '⚗️',
      boardTitle: 'Electrolysis',
      theory() {
        return `<h4>Chemical Effects of Electric Current</h4><p>Electric current can cause chemical changes in conducting liquids. This is used in electroplating.</p><ul><li>Some liquids conduct electricity because they contain ions.</li><li>Electrolysis can separate substances.</li><li>Electroplating deposits a thin layer of metal on another object.</li><li>LED testers can detect weak current in liquids.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Conductivity Tester</h4><label>Liquid</label><select id="liquidType" onchange="ScienceSim.conductivity()"><option value="salt">Salt water</option><option value="sugar">Sugar water</option><option value="lemon">Lemon juice</option><option value="oil">Oil</option></select><div class="conductivity"><span class="probe"></span><span id="led" class="led"></span><span class="probe"></span></div><p id="conductResult" class="sim-result"></p></div>`;
        ScienceSim.conductivity();
      },
    },
    {
      name: 'Light Reflection',
      icon: '🔦',
      boardTitle: 'i = r',
      theory() {
        return `<h4>Light and Reflection</h4><p>Reflection is the bouncing back of light from a surface. A plane mirror forms a virtual, erect, laterally inverted image.</p><ul><li>Incident ray falls on the mirror.</li><li>Reflected ray bounces away.</li><li>Normal is a line perpendicular to the mirror.</li><li>Angle of incidence equals angle of reflection.</li></ul><div class="formula">Angle i = Angle r</div>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Reflection Simulator</h4><label>Angle of incidence</label><input type="range" id="lightAngle" min="10" max="70" value="35" oninput="ScienceSim.reflection()"><div class="mirror-box"><span id="rayIn"></span><span id="rayOut"></span><span class="mirror-line"></span></div><p id="reflectResult" class="sim-result"></p></div>`;
        ScienceSim.reflection();
      },
    },
    {
      name: 'Stars and Solar System',
      icon: '🪐',
      boardTitle: 'Solar system',
      theory() {
        return `<h4>Stars and the Solar System</h4><p>The solar system consists of the Sun, planets, moons, asteroids, comets, and meteoroids.</p><ul><li>The Sun is a star and the main source of energy.</li><li>Planets revolve around the Sun in orbits.</li><li>Earth rotates once in about 24 hours and revolves once in about 365 days.</li><li>Constellations are patterns of stars.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="sim-card"><h4>Solar System Viewer</h4><label>Orbit speed</label><input type="range" id="orbitSpeed" min="3" max="20" value="10" oninput="ScienceSim.solar()"><div class="solar-system"><span class="sun"></span><span id="earthOrbit" class="orbit earth-orbit"><i></i></span><span id="marsOrbit" class="orbit mars-orbit"><i></i></span></div><p id="solarResult" class="sim-result"></p></div>`;
        ScienceSim.solar();
      },
    },
  ],
};

const ScienceSim = {
  val(id) { return parseFloat(document.getElementById(id).value) || 0; },
  text(id, value) { document.getElementById(id).innerHTML = value; },
  plate() {
    const c = this.val('sciCarb'), p = this.val('sciProtein'), v = this.val('sciVitamin');
    const total = Math.max(c + p + v, 1);
    document.getElementById('plateCarb').style.width = `${c / total * 100}%`;
    document.getElementById('plateProtein').style.width = `${p / total * 100}%`;
    document.getElementById('plateVitamin').style.width = `${v / total * 100}%`;
    this.text('plateResult', total > 80 && p > 15 && v > 15 ? 'Nice balanced plate: energy, growth, and protection are all present.' : 'Add more variety. A balanced diet needs all major nutrient groups.');
  },
  separation() {
    const map = {
      'sand-water': 'Use filtration. Sand is insoluble and stays on filter paper.',
      'salt-water': 'Use evaporation. Water evaporates and salt crystals remain.',
      'iron-sand': 'Use magnetic separation. A magnet attracts iron filings.',
      'flour-bran': 'Use sieving. Bran particles are larger than flour particles.',
    };
    this.text('sepResult', map[document.getElementById('sepMix').value]);
  },
  changeType() {
    const map = {
      ice: 'Melting ice is reversible and physical. Freezing can bring it back.',
      paper: 'Burning paper is irreversible and chemical. New substances form.',
      dough: 'Making dough is mostly irreversible because flour and water form a new mixture.',
      water: 'Boiling water is reversible and physical. Vapour can condense again.',
    };
    this.text('changeResult', map[document.getElementById('changeCase').value]);
  },
  habitat() {
    const map = {
      fish: 'Aquatic habitat: gills help breathing in water and fins help swimming.',
      cactus: 'Desert habitat: spines reduce water loss and thick stem stores water.',
      camel: 'Desert habitat: wide feet, long eyelashes, and water-saving body adaptations.',
      frog: 'Amphibian habitat: moist skin and strong hind legs help on land and water.',
    };
    this.text('habitatResult', map[document.getElementById('habitatOrg').value]);
  },
  speed() {
    const d = this.val('speedD'), t = this.val('speedT');
    this.text('speedResult', t <= 0 ? 'Time must be greater than zero.' : `Speed = ${d} / ${t} = <b>${(d / t).toFixed(2)} m/s</b>`);
  },
  shadow() {
    const d = this.val('shadowDistance');
    const size = 120 - d * 8;
    document.getElementById('shadowObject').style.left = `${48 + d * 13}px`;
    document.getElementById('shadowShape').style.width = `${Math.max(size, 24)}px`;
    this.text('shadowResult', d < 5 ? 'Object is close to light, so the shadow is larger.' : 'Object is farther from light, so the shadow becomes smaller.');
  },
  circuit() {
    const closed = document.getElementById('circuitSwitch').checked;
    document.getElementById('bulb').classList.toggle('on', closed);
    this.text('circuitResult', closed ? 'Closed circuit: current flows and the bulb glows.' : 'Open circuit: path is broken, so the bulb is off.');
  },
  waterCycle() {
    const heat = this.val('waterHeat');
    document.getElementById('vapour').style.height = `${20 + heat * 0.6}px`;
    document.getElementById('rain').style.opacity = heat > 45 ? '1' : '.25';
    this.text('waterResult', heat > 45 ? 'More heat causes more evaporation, cloud formation, and rainfall.' : 'Low heat means slow evaporation and fewer clouds.');
  },
  crop() {
    const score = Math.round((this.val('cropWater') + this.val('cropNutrients') + this.val('cropSun')) / 3);
    this.text('cropResult', `Estimated crop health: <b>${score}%</b>. Best yield needs balanced water, nutrients, and sunlight.`);
  },
  microbe() {
    const growth = Math.round((this.val('microTemp') + this.val('microMoisture')) / 2);
    const dish = document.getElementById('microDish');
    dish.innerHTML = Array.from({ length: Math.max(3, Math.floor(growth / 8)) }, () => '<span></span>').join('');
    this.text('microResult', growth > 60 ? 'Warm and moist conditions cause fast microbial growth.' : 'Dry or cool conditions slow microbial growth.');
  },
  pressure() {
    const f = this.val('forceN'), a = this.val('areaM');
    this.text('pressureResult', a <= 0 ? 'Area must be greater than zero.' : `Pressure = ${f} / ${a} = <b>${(f / a).toFixed(2)} Pa</b>`);
  },
  friction() {
    const rough = this.val('roughness'), push = this.val('pushForce');
    const moved = push > rough;
    document.getElementById('block').style.left = moved ? `${Math.min(210, 40 + (push - rough) * 3)}px` : '28px';
    this.text('frictionResult', moved ? 'Push force is greater than friction, so the block moves.' : 'Friction is strong enough to resist motion.');
  },
  sound() {
    const canvas = document.getElementById('soundCanvas');
    const ctx = canvas.getContext('2d');
    const freq = this.val('soundFreq'), amp = this.val('soundAmp');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#37dfff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const y = 60 + Math.sin(x / 12 * freq / 5) * amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    this.text('soundResult', `Frequency controls pitch. Amplitude controls loudness.`);
  },
  conductivity() {
    const type = document.getElementById('liquidType').value;
    const conducts = ['salt', 'lemon'].includes(type);
    document.getElementById('led').classList.toggle('on', conducts);
    this.text('conductResult', conducts ? 'This liquid conducts electricity because it has ions.' : 'This liquid is a poor conductor in this simple tester.');
  },
  reflection() {
    const angle = this.val('lightAngle');
    document.getElementById('rayIn').style.transform = `rotate(${angle}deg)`;
    document.getElementById('rayOut').style.transform = `rotate(${-angle}deg)`;
    this.text('reflectResult', `Angle of incidence = <b>${angle}°</b>, so angle of reflection = <b>${angle}°</b>.`);
  },
  solar() {
    const speed = this.val('orbitSpeed');
    document.getElementById('earthOrbit').style.animationDuration = `${23 - speed}s`;
    document.getElementById('marsOrbit').style.animationDuration = `${34 - speed}s`;
    this.text('solarResult', 'Planets revolve around the Sun. Inner planets complete orbits faster than outer planets.');
  },
};

window.ScienceChapters = ScienceChapters;
window.ScienceSim = ScienceSim;
