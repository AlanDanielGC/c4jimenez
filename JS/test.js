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
  document.getElementById("siguiente").style.display = "none"; // Oculta el botón "Siguiente".

  // Convierte el objeto de resultados en un array [clave, valor] y lo ordena de mayor a menor.
  const sortedResults = Object.entries(resultados).sort((a, b) => b[1] - a[1]);

  // Toma los 3 mejores resultados.
  const topThree = sortedResults.slice(0, 3);

  // Construye el HTML final.
  let html = `
    <h2>¡Resultados del Test!</h2>
    <p>Basado en tus respuestas, estas son las áreas que más se alinean con tus intereses:</p>
    <ol>`;
  
  // Itera sobre el top 3 para crear una lista ordenada.
  topThree.forEach(([area, score], index) => {
    // Busca el nombre descriptivo en nuestro diccionario. Si no lo encuentra, usa el nombre original.
    const nombreArea = nombresDeAreas[area] || area.charAt(0).toUpperCase() + area.slice(1);
    html += `<li><strong>${index + 1}. ${nombreArea}</strong> (Puntuación: ${score})</li>`;
  });

  html += `
    </ol>
    <p>Te recomendamos usar estos resultados como guía para explorar las carreras disponibles. ¡Mucho éxito!</p>
    <button class="btn" onclick="location.reload()">Realizar Test de Nuevo</button>
  `;

  // Muestra el resultado en la página.
  contenedor.innerHTML = html;
}