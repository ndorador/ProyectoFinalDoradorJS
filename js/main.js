const notaInput = document.getElementById('notaInput');
const agregarNotaBtn = document.getElementById('agregarNotaBtn');
const limpiarNotasBtn = document.getElementById('limpiarNotasBtn');
const listaNotasContainer = document.getElementById('listaNotasContainer');
const mensajeNoNotas = document.getElementById('mensajeNoNotas');
const calcularPromedioBtn = document.getElementById('calcularPromedioBtn');
const promedioValorSpan = document.getElementById('promedioValor');
const estadoAprobacionSpan = document.getElementById('estadoAprobacion');
const mensajeErrorDiv = document.getElementById('mensajeError');


const NOTA_MINIMA_APROBACION = 5;
const CLAVE_STORAGE = "notasAlumno"; 
const MAX_NOTAS = 10; 
const MIN_NOTAS_PARA_CALCULAR = 2; 

let notas = cargarNotasDesdeStorage();


function cargarNotasDesdeStorage() {
    const notasGuardadas = localStorage.getItem(CLAVE_STORAGE);
    return notasGuardadas ? JSON.parse(notasGuardadas) : [];
}

function guardarNotasEnStorage() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(notas));
}


function mostrarError(mensaje) {
    mensajeErrorDiv.textContent = mensaje;
    mensajeErrorDiv.style.display = 'block'; 
}


function ocultarError() {
    mensajeErrorDiv.textContent = '';
    mensajeErrorDiv.style.display = 'none'; 
}


function agregarNota() {
    ocultarError(); 

  
    if (notas.length >= MAX_NOTAS) {
        mostrarError(`No se permiten más de ${MAX_NOTAS} notas. Limpia las notas para agregar nuevas.`);
        notaInput.value = ''; 
        return;
    }

    const notaTexto = notaInput.value;
    const notaNumerica = parseFloat(notaTexto);

    
    if (notaTexto === '' || isNaN(notaNumerica) || notaNumerica < 1 || notaNumerica > 10) {
        mostrarError("Por favor, ingresa una nota válida entre 1 y 10.");
        return;
    }
   

    notas.push(notaNumerica);
    guardarNotasEnStorage(); 
    renderizarNotas(); 
    notaInput.value = ''; 
}

function renderizarNotas() {
    listaNotasContainer.innerHTML = ''; 

    if (notas.length === 0) {
        mensajeNoNotas.style.display = 'block'; 
        listaNotasContainer.appendChild(mensajeNoNotas);
        return;
    } else {
        mensajeNoNotas.style.display = 'none';
    }

    notas.forEach((nota, index) => {
        const p = document.createElement('p');
        p.textContent = `Nota ${index + 1}: ${nota}`;
        listaNotasContainer.appendChild(p);
    });
}


function calcularPromedio() {
    ocultarError();

   
    if (notas.length < MIN_NOTAS_PARA_CALCULAR) {
        mostrarError(`Necesitas al menos ${MIN_NOTAS_PARA_CALCULAR} notas para calcular el promedio. Actualmente tienes ${notas.length}.`);
        promedioValorSpan.textContent = '--';
        estadoAprobacionSpan.textContent = '--';
        estadoAprobacionSpan.className = ''; 
        return;
    }

    let suma = 0;
    for (let i = 0; i < notas.length; i++) {
        suma += notas[i];
    }

    const promedio = suma / notas.length;
    promedioValorSpan.textContent = promedio.toFixed(2); 

    if (promedio >= NOTA_MINIMA_APROBACION) {
        estadoAprobacionSpan.textContent = 'Aprobado';
        estadoAprobacionSpan.className = 'status-approved'; 
    } else {
        estadoAprobacionSpan.textContent = 'Reprobado';
        estadoAprobacionSpan.className = 'status-failed';
    }
}


function limpiarNotas() {
    ocultarError();
    if (confirm("¿Estás seguro de que quieres limpiar todas las notas?")) {
        notas = []; 
        guardarNotasEnStorage(); 
        renderizarNotas(); 
        promedioValorSpan.textContent = '--'; 
        estadoAprobacionSpan.textContent = '--';
        estadoAprobacionSpan.className = '';
        mostrarError("Todas las notas han sido limpiadas.");
    }
}


agregarNotaBtn.addEventListener('click', agregarNota);

notaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        agregarNota();
    }
});

calcularPromedioBtn.addEventListener('click', calcularPromedio);

limpiarNotasBtn.addEventListener('click', limpiarNotas);

document.addEventListener('DOMContentLoaded', renderizarNotas);