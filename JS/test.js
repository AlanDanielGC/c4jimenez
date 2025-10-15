// --- Variables Globales ---
let preguntas = [];
let indice = 0;
// Inicializa los resultados. Si agregas más categorías en tu XML, añádelas aquí.
let resultados = { ingenieria: 0, humanidades: 0, arte: 0 };

// --- Diccionario de Nombres de Áreas ---
// Para mostrar nombres más descriptivos en los resultados.
const nombresDeAreas = {
  ingenieria: "Ingenierías y Tecnología",
  humanidades: "Ciencias Sociales y Humanidades",
  arte: "Artes y Creatividad"
};

// --- Flujo Principal ---
window.onload = function() {
  // Se inicia la carga de preguntas en cuanto la página esté lista.
  cargarPreguntas();
  // Se asigna el evento al botón "Siguiente".
  document.getElementById("siguiente").addEventListener("click", siguientePregunta);
};

/**
 * Carga las preguntas desde el archivo XML de forma asíncrona.
 * Incluye manejo de errores si el archivo no se encuentra.
 */
function cargarPreguntas() {
  fetch("XML/datos.xml") // Asegúrate que la ruta a tu archivo sea correcta.
    .then(response => {
      // Si la respuesta del servidor no es exitosa (ej. error 404), lanza un error.
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: No se pudo encontrar el archivo.`);
      }
      return response.text();
    })
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      preguntas = Array.from(xml.getElementsByTagName("pregunta"));
      // Una vez cargadas las preguntas, muestra la primera.
      mostrarPregunta();
    })
    .catch(error => {
      // Si algo falla durante el fetch, muestra un mensaje de error al usuario.
      console.error("Error al cargar las preguntas:", error);
      const contenedor = document.getElementById("contenedor");
      contenedor.innerHTML = `<p style="color: red;"><strong>Error:</strong> No se pudo cargar el test. Por favor, revisa la consola para más detalles e intenta de nuevo más tarde.</p>`;
      document.getElementById("siguiente").style.display = "none";
    });
}

/**
 * Genera el HTML para la pregunta actual y lo muestra en el contenedor.
 */
function mostrarPregunta() {
  const contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = ""; // Limpia el contenido anterior.

  const p = preguntas[indice];
  const texto = p.getElementsByTagName("texto")[0].textContent;
  const opciones = p.getElementsByTagName("opcion");

  // Crea el título de la pregunta
  const titulo = document.createElement("h3");
  titulo.textContent = `${indice + 1}. ${texto}`;
  contenedor.appendChild(titulo);
  
  const form = document.createElement("form");

  // Crea las opciones de respuesta (radio buttons)
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
              <input type="radio" id="${opcionId}" name="respuesta" value="${op.getAttribute("valor")}">
              <label for="${opcionId}" class="opcion-label">${op.textContent}</label>
          </div>
      `;
      i++;
  }

  html += `
          </form>
      </div>
  `;
  contenedor.innerHTML = html;
}

/**
 * Valida la selección, guarda el resultado y avanza a la siguiente pregunta o muestra el resultado final.
 */
function siguientePregunta() {
  const seleccion = document.querySelector('input[name="respuesta"]:checked');
  
  // Valida que el usuario haya seleccionado una opción.
  if (!seleccion) {
    alert("Por favor, selecciona una respuesta antes de continuar.");
    return;
  }

  // Incrementa la puntuación del área seleccionada.
  resultados[seleccion.value]++;

  // Avanza al siguiente índice.
  indice++;

  // Decide si mostrar la siguiente pregunta o el resultado final.
  if (indice < preguntas.length) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
}

/**
 * Calcula el top 3 de áreas y muestra los resultados finales al usuario.
 */
function mostrarResultado() {
    const contenedor = document.getElementById("contenedor");
    document.getElementById("siguiente").style.display = "none";

    // Mapeo de áreas a sus URLs y clases de color para los botones y barras
    const areaInfo = {
        ingenieria: { url: 'ingenieria.html', clase: 'area-ingenieria' },
        humanidades: { url: 'ciencias_social.html', clase: 'area-ciencias-social' },
        arte: { url: 'artes_humanidades.html', clase: 'area-artes-humanidades' }
        // Si agregas más áreas, añádelas aquí.
    };
    
    // Calcula la puntuación total para la barra de progreso
    const puntuacionTotal = Object.values(resultados).reduce((sum, score) => sum + score, 0);

    // Ordena los resultados de mayor a menor
    const sortedResults = Object.entries(resultados).sort((a, b) => b[1] - a[1]);

    // Extrae el resultado principal y los secundarios
    const [topArea, topScore] = sortedResults[0];
    const otherResults = sortedResults.slice(1);

    // Construye el HTML final
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