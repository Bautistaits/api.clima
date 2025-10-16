let botonClima = document.querySelector('#botonClima');
let fechaInput = document.querySelector('#fechaClima');
let ciudadInput = document.querySelector('#ciudad');
let resultado = document.querySelector('#resultadoClima');

botonClima.onclick = function () {
  let fecha = fechaInput.value;
  let ciudad = ciudadInput.value.trim();

  if (!ciudad) return alert('Escribí una ciudad primero.');
  if (!fecha) return alert('Seleccioná una fecha.');

  resultado.innerHTML = "<p>Buscando clima...</p>";

  let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es&format=json`;

  fetch(geoUrl)
    .then(geoRes => geoRes.json())
    .then(geoData => {
      if (!geoData.results || geoData.results.length === 0) {
        resultado.innerHTML = "<p>No se encontró esa ciudad. Intentá con otra.</p>";
        throw "Ciudad no encontrada"; 
      }

      let { latitude, longitude, name, country } = geoData.results[0];
      let climaUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${fecha}&end_date=${fecha}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;

      return fetch(climaUrl)
        .then(climaRes => climaRes.json())
        .then(climaData => {
          let clima = climaData.daily;
          if (!clima || clima.time.length === 0) {
            resultado.innerHTML = "<p>No hay datos disponibles para esa fecha.</p>";
            return;
          }

          resultado.innerHTML = `
            <h3>Clima en ${name}, ${country}</h3>
            <p>📅 Fecha: ${clima.time[0]}</p>
            <p>🌡️ Temp. Máx: ${clima.temperature_2m_max[0]}°C</p>
            <p>🌡️ Temp. Mín: ${clima.temperature_2m_min[0]}°C</p>
            <p>💧 Precipitación: ${clima.precipitation_sum[0]} mm</p>
            <p>💨 Viento Máx: ${clima.windspeed_10m_max[0]} km/h</p>
          `;
        });
    })
    .catch(err => {
      console.error("Error:", err);
      if (err !== "Ciudad no encontrada") {
        resultado.innerHTML = "<p>Ocurrió un error al consultar el clima.</p>";
      }
    });
};
