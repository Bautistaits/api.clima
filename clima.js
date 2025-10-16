let botonClima = document.querySelector('#botonClima');
let fechaInput = document.querySelector('#fechaClima');
let resultado = document.querySelector('#resultadoClima');

let latitud = -34.61;
let longitud = -58.38;

botonClima.onclick = function () {
  let fecha = fechaInput.value;
  if (!fecha) return alert('Seleccioná una fecha primero');

  let url = https://archive-api.open-meteo.com/v1/archive?latitude=${latitud}&longitude=${longitud}&start_date=${fecha}&end_date=${fecha}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=America/Argentina/Buenos_Aires;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      let clima = data.daily;
      if (!clima || clima.time.length === 0) {
        resultado.innerHTML = <p>No hay datos disponibles para esa fecha.</p>;
        return;
      }

      resultado.innerHTML = `
        <h3>Clima para ${clima.time[0]}</h3>
        <p>🌡️ Temp. Máx: ${clima.temperature_2m_max[0]}°C</p>
        <p>🌡️ Temp. Mín: ${clima.temperature_2m_min[0]}°C</p>
        <p>💧 Precipitación: ${clima.precipitation_sum[0]} mm</p>
        <p>💨 Viento Máx: ${clima.windspeed_10m_max[0]} km/h</p>
      `;
    })
    .catch(err => {
      console.error('Error al obtener el clima:', err);
      resultado.innerHTML = <p>Ocurrió un error al consultar el clima.</p>;
    });
};
