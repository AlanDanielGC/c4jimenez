let preguntas = [];
let indice = 0;
let resultados = { ingenieria: 0, humanidades: 0, arte: 0 };


const nombresDeAreas = {
  ingenieria: "Ingenierías y Tecnología",
  humanidades: "Ciencias Sociales y Humanidades",
  arte: "Artes y Creatividad"
};

window.onload = function() {
  cargarPreguntas();
  document.getElementById("siguiente").addEventListener("click", siguientePregunta);
};


function cargarPreguntas() {
  fetch("XML/datos.xml")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: No se pudo encontrar el archivo.`);
      }
      return response.text();
    })
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      preguntas = Array.from(xml.getElementsByTagName("pregunta"));
      mostrarPregunta();
    })
    .catch(error => {
      console.error("Error al cargar las preguntas:", error);
      const contenedor = document.getElementById("contenedor");
      contenedor.innerHTML = `<p style="color: red;"><strong>Error:</strong> No se pudo cargar el test. Por favor, revisa la consola para más detalles e intenta de nuevo más tarde.</p>`;
      document.getElementById("siguiente").style.display = "none";
    });
}


function mostrarPregunta() {
  const contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = ""; // Limpia el contenido anterior.

  const p = preguntas[indice];
  const texto = p.getElementsByTagName("texto")[0].textContent;
  const opciones = p.getElementsByTagName("opcion");

  const titulo = document.createElement("h3");
  titulo.textContent = `${indice + 1}. ${texto}`;
  contenedor.appendChild(titulo);
  
  const form = document.createElement("form");

  for (let op of opciones) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "respuesta";
    input.value = op.getAttribute("valor");
    
    label.appendChild(input);
    label.appendChild(document.createTextNode(op.textContent));
    form.appendChild(label);
    form.appendChild(document.createElement("br"));
  }
  contenedor.appendChild(form);


  const progreso = ((indice + 1) / preguntas.length) * 100;


  let html = `
      <div class="progress-bar-container">
          <div class="progress-bar-inner" style="width: ${progreso}%;"></div>
      </div>

      <div class="test-card">
          <div class="pregunta-header">
              <span class="pregunta-numero">Pregunta ${indice + 1} de ${preguntas.length}</span>
              <h3 class="pregunta-texto">${texto}</h3>
          </div>
          <form class="opciones-form">
  `;

  let i = 0;
  for (let op of opciones) {
    const opcionId = `opcion-${i}`;
    html += `
      <div class="opcion-container">
        <input type="radio" id="${opcionId}" name="respuesta" value="${op.getAttribute("valor")}" onclick="siguientePregunta()">
        <label for="${opcionId}" class="opcion-label">${op.textContent}</label>
      </div>
    `;
    i++;
  }

  html += `
      </form>
    </div>
  `;
  contenedor.style.transition = "opacity 0.35s";
  contenedor.style.opacity = 0;
  setTimeout(() => {
    contenedor.innerHTML = html;
    contenedor.style.opacity = 1;
    
    const btnSiguiente = document.getElementById("siguiente");
    if (btnSiguiente) btnSiguiente.style.display = "none";
  }, 350);
}


function siguientePregunta() {
  const seleccion = document.querySelector('input[name="respuesta"]:checked');
  
  if (!seleccion) {
    alert("Por favor, selecciona una respuesta antes de continuar.");
    return;
  }

  resultados[seleccion.value]++;

  indice++;

  if (indice < preguntas.length) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
}


function mostrarResultado() {
    const contenedor = document.getElementById("contenedor");
  const btnSiguiente = document.getElementById("siguiente");
  if (btnSiguiente) btnSiguiente.style.display = "none";

    const areaInfo = {
        ingenieria: { url: 'ingenieria.html', clase: 'area-ingenieria' },
        humanidades: { url: 'ciencias_social.html', clase: 'area-ciencias-social' },
        arte: { url: 'artes_humanidades.html', clase: 'area-artes-humanidades' }
    };
    
    const puntuacionTotal = Object.values(resultados).reduce((sum, score) => sum + score, 0);

    const sortedResults = Object.entries(resultados).sort((a, b) => b[1] - a[1]);

    const [topArea, topScore] = sortedResults[0];
    const otherResults = sortedResults.slice(1);

    let html = `
    <div class="results-card">
        <h2>¡Resultados del Test!</h2>
        <p>Basado en tus respuestas, tu principal área de interés es:</p>

        <div class="top-result-card ${areaInfo[topArea]?.clase || ''}">
            <h3 class="result-area-name">${nombresDeAreas[topArea] || topArea}</h3>
            <div class="result-score-bar">
                <div class="result-score-bar-inner" style="width: ${(topScore / puntuacionTotal * 100) || 100}%;">
                    <span>Puntuación: ${topScore}</span>
                </div>
            </div>
            <a href="${areaInfo[topArea]?.url || '#'}" class="btn btn-explore">Explorar Carreras</a>
        </div>

        <h4>Otras áreas de interés:</h4>
        <div class="other-results-list">
    `;

    otherResults.forEach(([area, score]) => {
        html += `
            <a href="${areaInfo[area]?.url || '#'}" class="other-result-item">
                <span>${nombresDeAreas[area] || area}</span>
                <span class="other-score">Puntuación: ${score}</span>
            </a>
        `;
    });

    html += `
        </div>
        <button class="btn btn-restart" onclick="location.reload()">Realizar Test de Nuevo</button>
    </div>
    `;

    contenedor.innerHTML = html;
}