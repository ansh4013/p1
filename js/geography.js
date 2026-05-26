const GeoCities = {
  kanpur: { name: 'Kanpur, India', lat: 26.4499, lon: 80.3319, country: 'India' },
  delhi: { name: 'Delhi, India', lat: 28.6139, lon: 77.2090, country: 'India' },
  mumbai: { name: 'Mumbai, India', lat: 19.0760, lon: 72.8777, country: 'India' },
  london: { name: 'London, UK', lat: 51.5072, lon: -0.1276, country: 'United Kingdom' },
  tokyo: { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, country: 'Japan' },
  sydney: { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, country: 'Australia' },
  newyork: { name: 'New York, USA', lat: 40.7128, lon: -74.0060, country: 'United States' },
  cairo: { name: 'Cairo, Egypt', lat: 30.0444, lon: 31.2357, country: 'Egypt' },
};

const GeoCountries = {
  india: { name: 'India', capital: 'New Delhi', continent: 'Asia', currency: 'Indian Rupee', landmark: 'Himalayas, Ganga Plain, Thar Desert', climate: 'Tropical monsoon with regional variation' },
  japan: { name: 'Japan', capital: 'Tokyo', continent: 'Asia', currency: 'Yen', landmark: 'Mount Fuji and island arc', climate: 'Temperate, humid, with monsoon influence' },
  egypt: { name: 'Egypt', capital: 'Cairo', continent: 'Africa', currency: 'Egyptian Pound', landmark: 'Nile River and Sahara Desert', climate: 'Hot desert climate' },
  brazil: { name: 'Brazil', capital: 'Brasilia', continent: 'South America', currency: 'Brazilian Real', landmark: 'Amazon Basin', climate: 'Equatorial, tropical, and subtropical zones' },
  australia: { name: 'Australia', capital: 'Canberra', continent: 'Australia/Oceania', currency: 'Australian Dollar', landmark: 'Great Barrier Reef and Outback', climate: 'Mostly arid, tropical north, temperate coast' },
};

const GeographyChapters = {
  weather: [
    {
      name: 'Live Weather by Location',
      icon: '🌦️',
      boardTitle: 'Ask location -> weather',
      theory() {
        return `<h4>Weather and Location</h4><p>Weather describes the current condition of the atmosphere at a place. A weather app uses latitude and longitude to request data for that exact location.</p><ul><li><b>Latitude</b> tells how far north or south a place is.</li><li><b>Longitude</b> tells how far east or west a place is.</li><li>If location permission is denied, this app uses <b>Kanpur, India</b> as the fallback.</li><li>Weather data includes temperature, humidity, wind, clouds, pressure, and rain.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="geo-tool"><h4>Live Weather Finder</h4><p class="geo-muted">Allow location for your local weather. If blocked, Kanpur will load automatically.</p><div class="geo-actions"><button class="solve-btn" onclick="GeoTools.useMyLocation()">Use My Location</button><button class="solve-btn secondary" onclick="GeoTools.loadWeather(GeoCities.kanpur, 'Fallback: permission denied or unavailable')">Use Kanpur</button></div><div id="weatherStatus" class="sim-result">Waiting for location...</div><div id="weatherCards" class="weather-cards"></div><div id="forecastList" class="forecast-list"></div></div>`;
        GeoTools.useMyLocation();
      },
    },
    {
      name: 'City Weather Compare',
      icon: '🏙️',
      boardTitle: 'Compare cities',
      theory() {
        return `<h4>Comparing Weather</h4><p>Weather can be very different between cities because of altitude, distance from sea, latitude, wind, and local landforms.</p><ul><li>Coastal cities usually have smaller temperature ranges.</li><li>Desert and inland cities often heat and cool faster.</li><li>Higher places are generally cooler.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="geo-tool"><h4>Compare Two Cities</h4><div class="input-row"><div><label>City A</label><select id="cityA">${GeoTools.cityOptions('kanpur')}</select></div><div><label>City B</label><select id="cityB">${GeoTools.cityOptions('mumbai')}</select></div></div><button class="solve-btn" onclick="GeoTools.compareWeather()">Compare Weather</button><div id="compareResult" class="weather-cards"></div></div>`;
        GeoTools.compareWeather();
      },
    },
    {
      name: 'Weather Safety Adviser',
      icon: '🛡️',
      boardTitle: 'Weather safety',
      theory() {
        return `<h4>Weather Safety</h4><p>Weather information helps people decide what to wear, whether to carry water, avoid storms, protect crops, or plan travel.</p><ul><li>High temperature can cause heat stress.</li><li>Strong wind can affect travel and outdoor work.</li><li>Rain alerts help people avoid flooding and slippery roads.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="geo-tool"><h4>Safety Adviser</h4><div class="input-row"><div><label>Temperature (°C)</label><input type="number" id="safeTemp" value="36"></div><div><label>Wind (km/h)</label><input type="number" id="safeWind" value="18"></div><div><label>Rain (mm)</label><input type="number" id="safeRain" value="4"></div></div><button class="solve-btn" onclick="GeoTools.safety()">Get Advice</button><p id="safetyResult" class="sim-result"></p></div>`;
        GeoTools.safety();
      },
    },
    {
      name: 'Climate Zone Explorer',
      icon: '🌍',
      boardTitle: 'Climate zones',
      theory() {
        return `<h4>Climate Zones</h4><p>Climate is the long-term pattern of weather in a place. Temperature and rainfall help identify climate zones.</p><ul><li><b>Tropical:</b> hot and often wet.</li><li><b>Dry:</b> low rainfall.</li><li><b>Temperate:</b> moderate conditions.</li><li><b>Polar:</b> very cold.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="geo-tool"><h4>Climate Classifier</h4><div class="input-row"><div><label>Average Temperature (°C)</label><input type="number" id="climateTemp" value="28"></div><div><label>Annual Rainfall (mm)</label><input type="number" id="climateRain" value="900"></div></div><button class="solve-btn" onclick="GeoTools.climate()">Classify Climate</button><p id="climateResult" class="sim-result"></p></div>`;
        GeoTools.climate();
      },
    },
  ],
  world: [
    {
      name: 'Country Facts App',
      icon: '🏳️',
      boardTitle: 'Country facts',
      theory() {
        return `<h4>Country Facts</h4><p>Geographers study countries by location, population, capital, currency, physical features, climate, and culture.</p><ul><li>Capital cities are administrative centers.</li><li>Continents group countries into large land regions.</li><li>Physical features like rivers and mountains shape settlement and transport.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="geo-tool"><h4>Country Facts</h4><label>Country</label><select id="countryPick" onchange="GeoTools.countryFacts()">${Object.keys(GeoCountries).map(k => `<option value="${k}">${GeoCountries[k].name}</option>`).join('')}</select><div id="countryResult" class="fact-card"></div></div>`;
        GeoTools.countryFacts();
      },
    },
    {
      name: 'Capital Cities Game',
      icon: '🏛️',
      boardTitle: 'Capital quiz',
      theory() {
        return `<h4>Capital Cities</h4><p>A capital city is usually where a country's government works. Learning capitals improves political geography and map memory.</p>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="geo-tool"><h4>Capital Quiz</h4><p id="capitalQuestion" class="sim-result"></p><div id="capitalChoices" class="quiz-grid"></div><p id="capitalFeedback" class="sim-result"></p><button class="solve-btn" onclick="GeoTools.capitalQuiz()">New Question</button></div>`;
        GeoTools.capitalQuiz();
      },
    },
    {
      name: 'Coordinates and Distance',
      icon: '📍',
      boardTitle: 'Lat + Lon',
      theory() {
        return `<h4>Coordinates and Distance</h4><p>Coordinates identify exact positions on Earth. Distance between two places can be estimated using their latitude and longitude.</p><ul><li>Latitude lines run east-west.</li><li>Longitude lines run north-south.</li><li>The shortest surface distance is often estimated with great-circle distance.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="geo-tool"><h4>Distance Between Cities</h4><div class="input-row"><div><label>From</label><select id="distA">${GeoTools.cityOptions('kanpur')}</select></div><div><label>To</label><select id="distB">${GeoTools.cityOptions('delhi')}</select></div></div><button class="solve-btn" onclick="GeoTools.distance()">Calculate Distance</button><p id="distanceResult" class="sim-result"></p></div>`;
        GeoTools.distance();
      },
    },
    {
      name: 'Map Direction Helper',
      icon: '🧭',
      boardTitle: 'Direction sense',
      theory() {
        return `<h4>Directions</h4><p>Directions help us describe location and movement. The four main directions are North, South, East, and West.</p><ul><li>Latitude increasing means moving north.</li><li>Longitude increasing means moving east.</li><li>Maps usually place north at the top.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="geo-tool"><h4>Direction Helper</h4><div class="input-row"><div><label>From</label><select id="dirA">${GeoTools.cityOptions('kanpur')}</select></div><div><label>To</label><select id="dirB">${GeoTools.cityOptions('tokyo')}</select></div></div><button class="solve-btn" onclick="GeoTools.direction()">Find Direction</button><div class="compass"><span id="compassNeedle"></span></div><p id="directionResult" class="sim-result"></p></div>`;
        GeoTools.direction();
      },
    },
    {
      name: 'Disaster Preparedness',
      icon: '⚠️',
      boardTitle: 'Be prepared',
      theory() {
        return `<h4>Disaster Preparedness</h4><p>Geography helps us understand natural hazards and prepare for them. Preparedness reduces risk.</p><ul><li>Floods are linked with heavy rainfall and poor drainage.</li><li>Earthquakes happen due to sudden movement in Earth's crust.</li><li>Cyclones bring strong winds and heavy rain.</li><li>Preparedness includes alerts, safe shelter, emergency kits, and evacuation plans.</li></ul>`;
      },
      simulator(c) {
        c.innerHTML = `<div class="geo-tool"><h4>Emergency Kit Builder</h4><label><input type="checkbox" class="kit" value="Water"> Water</label><label><input type="checkbox" class="kit" value="Torch"> Torch</label><label><input type="checkbox" class="kit" value="First aid"> First aid</label><label><input type="checkbox" class="kit" value="Radio"> Radio</label><label><input type="checkbox" class="kit" value="Dry food"> Dry food</label><button class="solve-btn" onclick="GeoTools.kit()">Check Kit</button><p id="kitResult" class="sim-result"></p></div>`;
        GeoTools.kit();
      },
    },
  ],
};

const GeoTools = {
  fallback: GeoCities.kanpur,
  codeText(code) {
    const map = { 0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Depositing fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle', 61: 'Slight rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Snow', 80: 'Rain showers', 95: 'Thunderstorm' };
    return map[code] || `Weather code ${code}`;
  },
  cityOptions(selected) {
    return Object.keys(GeoCities).map(k => `<option value="${k}" ${k === selected ? 'selected' : ''}>${GeoCities[k].name}</option>`).join('');
  },
  async useMyLocation() {
    const status = document.getElementById('weatherStatus');
    status.textContent = 'Requesting location permission...';
    if (!navigator.geolocation) {
      this.loadWeather(this.fallback, 'Geolocation is not supported. Showing Kanpur.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => this.loadWeather({ name: 'Your location', lat: pos.coords.latitude, lon: pos.coords.longitude }, 'Location allowed'),
      () => this.loadWeather(this.fallback, 'Location denied or unavailable. Showing Kanpur.'),
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 300000 }
    );
  },
  async fetchWeather(place) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather service unavailable');
    return res.json();
  },
  async loadWeather(place, note = '') {
    const status = document.getElementById('weatherStatus');
    const cards = document.getElementById('weatherCards');
    const forecast = document.getElementById('forecastList');
    status.textContent = `Loading weather for ${place.name}...`;
    cards.innerHTML = '';
    forecast.innerHTML = '';
    try {
      const data = await this.fetchWeather(place);
      const c = data.current;
      status.innerHTML = `<b>${place.name}</b> ${note ? `- ${note}` : ''}<br><small>Lat ${place.lat.toFixed(3)}, Lon ${place.lon.toFixed(3)}</small>`;
      cards.innerHTML = [
        ['Temperature', `${c.temperature_2m}°C`],
        ['Feels Like', `${c.apparent_temperature}°C`],
        ['Weather', this.codeText(c.weather_code)],
        ['Humidity', `${c.relative_humidity_2m}%`],
        ['Wind', `${c.wind_speed_10m} km/h`],
        ['Clouds', `${c.cloud_cover}%`],
        ['Pressure', `${c.pressure_msl} hPa`],
        ['Rain Now', `${c.rain ?? c.precipitation ?? 0} mm`],
      ].map(([a, b]) => `<div class="weather-tile"><span>${a}</span><b>${b}</b></div>`).join('');
      forecast.innerHTML = data.daily.time.slice(0, 5).map((day, i) => `<div class="forecast-day"><b>${day}</b><span>${this.codeText(data.daily.weather_code[i])}</span><small>${data.daily.temperature_2m_min[i]}°C - ${data.daily.temperature_2m_max[i]}°C | Rain ${data.daily.precipitation_sum[i]} mm</small></div>`).join('');
    } catch (err) {
      status.innerHTML = `Could not fetch live weather. ${place.name === 'Kanpur, India' ? 'Kanpur fallback selected.' : 'Trying Kanpur fallback...'}`;
      if (place.name !== this.fallback.name) this.loadWeather(this.fallback, 'Fallback after weather error');
      else cards.innerHTML = `<div class="weather-tile"><span>Offline</span><b>Check internet and retry.</b></div>`;
    }
  },
  async compareWeather() {
    const a = GeoCities[document.getElementById('cityA').value];
    const b = GeoCities[document.getElementById('cityB').value];
    const box = document.getElementById('compareResult');
    box.innerHTML = '<p class="sim-result">Loading comparison...</p>';
    try {
      const [wa, wb] = await Promise.all([this.fetchWeather(a), this.fetchWeather(b)]);
      box.innerHTML = [a, b].map((city, i) => {
        const w = i === 0 ? wa.current : wb.current;
        return `<div class="weather-tile"><span>${city.name}</span><b>${w.temperature_2m}°C</b><small>${this.codeText(w.weather_code)} | Wind ${w.wind_speed_10m} km/h</small></div>`;
      }).join('');
    } catch {
      box.innerHTML = '<p class="sim-result">Could not load live comparison. Check internet and try again.</p>';
    }
  },
  safety() {
    const t = Number(document.getElementById('safeTemp').value);
    const w = Number(document.getElementById('safeWind').value);
    const r = Number(document.getElementById('safeRain').value);
    const advice = [];
    if (t >= 38) advice.push('Heat alert: drink water, avoid afternoon sun, and rest in shade.');
    else if (t <= 8) advice.push('Cold alert: wear warm layers.');
    if (w >= 40) advice.push('Strong wind: avoid loose banners, weak branches, and risky travel.');
    if (r >= 20) advice.push('Heavy rain: avoid waterlogged roads and keep electronics dry.');
    if (!advice.length) advice.push('Normal conditions: good for ordinary outdoor activity.');
    document.getElementById('safetyResult').innerHTML = advice.join('<br>');
  },
  climate() {
    const t = Number(document.getElementById('climateTemp').value);
    const r = Number(document.getElementById('climateRain').value);
    let zone = 'Temperate';
    if (t >= 24 && r >= 1000) zone = 'Tropical wet';
    else if (r < 250) zone = 'Desert / dry';
    else if (t <= 5) zone = 'Polar / cold';
    else if (t >= 24 && r < 700) zone = 'Tropical dry';
    document.getElementById('climateResult').innerHTML = `Likely climate zone: <b>${zone}</b>. Temperature and rainfall are two key climate clues.`;
  },
  countryFacts() {
    const c = GeoCountries[document.getElementById('countryPick').value];
    document.getElementById('countryResult').innerHTML = `<h4>${c.name}</h4><p><b>Capital:</b> ${c.capital}</p><p><b>Continent:</b> ${c.continent}</p><p><b>Currency:</b> ${c.currency}</p><p><b>Major feature:</b> ${c.landmark}</p><p><b>Climate:</b> ${c.climate}</p>`;
  },
  capitalQuiz() {
    const keys = Object.keys(GeoCountries);
    const answerKey = keys[Math.floor(Math.random() * keys.length)];
    const answer = GeoCountries[answerKey];
    const choices = [...new Set([answer.capital, ...keys.filter(k => k !== answerKey).slice(0, 3).map(k => GeoCountries[k].capital)])].sort(() => Math.random() - 0.5);
    document.getElementById('capitalQuestion').innerHTML = `What is the capital of <b>${answer.name}</b>?`;
    document.getElementById('capitalChoices').innerHTML = choices.map(choice => `<button onclick="GeoTools.checkCapital('${choice.replace(/'/g, "\\'")}', '${answer.capital.replace(/'/g, "\\'")}')">${choice}</button>`).join('');
    document.getElementById('capitalFeedback').textContent = '';
  },
  checkCapital(choice, answer) {
    document.getElementById('capitalFeedback').innerHTML = choice === answer ? 'Correct. Nice map memory.' : `Not quite. Correct answer: <b>${answer}</b>.`;
  },
  distance() {
    const a = GeoCities[document.getElementById('distA').value];
    const b = GeoCities[document.getElementById('distB').value];
    const km = this.haversine(a, b);
    document.getElementById('distanceResult').innerHTML = `${a.name} to ${b.name}: about <b>${Math.round(km)} km</b> by great-circle distance.`;
  },
  direction() {
    const a = GeoCities[document.getElementById('dirA').value];
    const b = GeoCities[document.getElementById('dirB').value];
    const ns = b.lat > a.lat ? 'north' : 'south';
    const ew = b.lon > a.lon ? 'east' : 'west';
    const angle = Math.atan2(b.lon - a.lon, b.lat - a.lat) * 180 / Math.PI;
    document.getElementById('compassNeedle').style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
    document.getElementById('directionResult').innerHTML = `From ${a.name}, ${b.name} is generally to the <b>${ns}-${ew}</b>.`;
  },
  kit() {
    const checked = [...document.querySelectorAll('.kit:checked')].map(el => el.value);
    document.getElementById('kitResult').innerHTML = checked.length >= 4 ? `Good kit: ${checked.join(', ')}.` : `Add more essentials. Current kit: ${checked.join(', ') || 'none'}.`;
  },
  haversine(a, b) {
    const R = 6371;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLon = (b.lon - a.lon) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  },
};

window.GeoCities = GeoCities;
window.GeographyChapters = GeographyChapters;
window.GeoTools = GeoTools;
