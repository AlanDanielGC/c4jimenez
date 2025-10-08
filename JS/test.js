// Array con las 20 preguntas
const preguntas = [
  "¿Te interesa resolver problemas matemáticos?",
  "¿Te gustaría ayudar a otras personas?",
  "¿Te gusta trabajar con creatividad?",
  "¿Disfrutas aprender cosas nuevas rápidamente?",
  "¿Prefieres trabajar en equipo que solo?",
  "¿Te interesa la tecnología y la informática?",
  "¿Tienes paciencia para explicar a otros?",
  "¿Te atraen las artes visuales o música?",
  "¿Te gusta analizar datos y estadísticas?",
  "¿Disfrutas leer y escribir textos largos?",
  "¿Te interesa la investigación científica?",
  "¿Prefieres trabajos prácticos que teóricos?",
  "¿Te motiva la enseñanza y educación?",
  "¿Tienes facilidad para dibujar o diseñar?",
  "¿Te gusta resolver problemas complejos?",
  "¿Disfrutas socializar y comunicar ideas?",
  "¿Te interesa el desarrollo de software?",
  "¿Te motiva ayudar a la comunidad?",
  "¿Disfrutas la creatividad en proyectos artísticos?",
  "¿Te gusta planear y organizar actividades?"
];

// Opciones fijas
const opciones = [
  {texto: "Sí", valor: "ingenieria"},
  {texto: "No", valor: "humanidades"},
  {texto: "Depende", valor: "arte"},
  {texto: "A veces", valor: "arte"},
  {texto: "A veces", valor: "arte"}
];

let indice = 0;
let resultados = { ingenieria: 0, humanidades: 0, arte: 0 };

const contenedor = document.getElementById("contenedor");
const botonSiguiente = document.getElementById("siguiente");

window.onload = mostrarPregunta;

function mostrarPregunta() {
  contenedor.innerHTML = "";

  const titulo = document.createElement("h3");
  titulo.textContent = preguntas[indice];
  contenedor.appendChild(titulo);

  opciones.forEach(op => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "respuesta";
    input.value = op.valor;
    label.appendChild(input);
    label.appendChild(document.createTextNode(op.texto));
    contenedor.appendChild(label);
    contenedor.appendChild(document.createElement("br"));
  });

  botonSiguiente.textContent = (indice === preguntas.length - 1) ? "Terminar Test" : "Siguiente";
}

botonSiguiente.addEventListener("click", function() {
  const seleccion = document.querySelector('input[name="respuesta"]:checked');
  if (!seleccion) { 
    alert("Selecciona una respuesta antes de continuar."); 
    return; 
  }

  resultados[seleccion.value]++;
  indice++;

  if (indice < preguntas.length) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
});

function mostrarResultado() {
  contenedor.innerHTML = "";
  botonSiguiente.style.display = "none";

  const orden = Object.entries(resultados)
    .sort((a,b) => b[1]-a[1])
    .map(e => e[0]);

  const mejores = orden.slice(0,2);

  let mensaje = `<h2>Resultado final</h2>`;
  mensaje += `<p>Te recomendamos estas opciones de carrera:</p><ul>`;
  mejores.forEach(opt => {
    if (opt === "ingenieria") mensaje += "<li>Ingeniería / Carreras Tecnológicas</li>";
    if (opt === "humanidades") mensaje += "<li>Humanidades / Educación / Psicología / Derecho</li>";
    if (opt === "arte") mensaje += "<li>Arte / Diseño / Música / Artes Visuales</li>";
  });
  mensaje += "</ul>";
  mensaje += `<button id="volver">Volver a la página principal</button>`;
  contenedor.innerHTML = mensaje;

  document.getElementById("volver").addEventListener("click", function() {
    window.location.href = "index.html";
  });
}
