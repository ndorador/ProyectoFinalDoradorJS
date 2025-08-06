import { CONSTANTES_UI } from './logic.js'; // Importamos las constantes desde logic.js

export const DOMElements = {
    listaAlumnos: document.getElementById('listaAlumnos'),
    tituloAlumno: document.getElementById('tituloAlumno'),
    mensajeSinAlumno: document.getElementById('mensajeSinAlumno'),
    legajoContainer: document.getElementById('legajoContainer'),
    listaDeMaterias: document.getElementById('listaDeMaterias'),
    notasContainer: document.getElementById('notasContainer'),
    listaDeNotas: document.getElementById('listaDeNotas'),
    nuevaMateriaInput: document.getElementById('nuevaMateriaInput'),
    agregarMateriaBtn: document.getElementById('agregarMateriaBtn'),
    nuevaNotaInput: document.getElementById('nuevaNotaInput'),
    agregarNotaBtn: document.getElementById('agregarNotaBtn'),
    promedioValorSpan: document.getElementById('promedioValor'),
    estadoAprobacionSpan: document.getElementById('estadoAprobacion'),
    resultBox: document.querySelector('.result-box'),
    agregarAlumnoBtn: document.getElementById('agregarAlumnoBtn'),
    modificarAlumnoBtn: document.getElementById('modificarAlumnoBtn'),
    eliminarAlumnoBtn: document.getElementById('eliminarAlumnoBtn'),
    modificarMateriaBtn: document.getElementById('modificarMateriaBtn'),
    eliminarMateriaBtn: document.getElementById('eliminarMateriaBtn'),
};

export function renderizarAlumnos(alumnos, alumnoSeleccionadoId) {
    DOMElements.listaAlumnos.innerHTML = '';
    DOMElements.agregarAlumnoBtn.disabled = alumnos.length >= CONSTANTES_UI.MAX_ALUMNOS;
    
    alumnos.forEach(alumno => {
        const boton = document.createElement('button');
        boton.textContent = alumno.nombre;
        boton.classList.add('alumno-btn');
        boton.dataset.id = alumno.id;
        if (alumno.id === alumnoSeleccionadoId) {
            boton.classList.add('active');
        }
        DOMElements.listaAlumnos.appendChild(boton);
    });
}

export function renderizarMaterias(alumno, materiaSeleccionadaId) {
    DOMElements.listaDeMaterias.innerHTML = '';
    
    const botonesActivos = !!materiaSeleccionadaId;
    DOMElements.modificarMateriaBtn.disabled = !botonesActivos;
    DOMElements.eliminarMateriaBtn.disabled = !botonesActivos;

    DOMElements.agregarMateriaBtn.disabled = !alumno;
    DOMElements.nuevaMateriaInput.disabled = !alumno;
    
    if (alumno.materias.length === 0) {
        DOMElements.listaDeMaterias.innerHTML = '<p>No hay materias cargadas para este alumno.</p>';
    } else {
        alumno.materias.forEach(materia => {
            const boton = document.createElement('button');
            boton.textContent = materia.nombre;
            boton.classList.add('materia-btn');
            boton.dataset.id = materia.id;
            if (materia.id === materiaSeleccionadaId) {
                boton.classList.add('active');
            }
            DOMElements.listaDeMaterias.appendChild(boton);
        });
    }
}

export function renderizarNotas(alumno, materiaSeleccionadaId) {
    const materia = alumno?.materias.find(m => m.id === materiaSeleccionadaId);
    
    if (!materia) {
        DOMElements.notasContainer.style.display = 'none';
        return;
    }

    DOMElements.notasContainer.style.display = 'block';
    DOMElements.listaDeNotas.innerHTML = '';
    
    const tieneMaximoNotas = materia.notas.length >= CONSTANTES_UI.MAX_NOTAS_POR_MATERIA;
    DOMElements.agregarNotaBtn.disabled = tieneMaximoNotas;
    DOMElements.nuevaNotaInput.disabled = tieneMaximoNotas;

    if (materia.notas.length === 0) {
        DOMElements.listaDeNotas.innerHTML = `<p class="no-tasks-message">No hay notas para esta materia.</p>`;
    } else {
        materia.notas.forEach((nota, index) => {
            const notaItem = document.createElement('li');
            notaItem.classList.add('tarea-item');
            notaItem.dataset.notaIndex = index;
            
            const descripcionSpan = document.createElement('span');
            descripcionSpan.className = 'task-description';
            descripcionSpan.textContent = `Nota ${index + 1}: ${nota}`;

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';
            
            const modBtn = document.createElement('button');
            modBtn.className = 'mod-btn';
            modBtn.textContent = 'Modificar';
            modBtn.dataset.accion = 'modificar';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.dataset.accion = 'eliminar';

            actionsDiv.appendChild(modBtn);
            actionsDiv.appendChild(deleteBtn);
            
            notaItem.appendChild(descripcionSpan);
            notaItem.appendChild(actionsDiv);
            DOMElements.listaDeNotas.appendChild(notaItem);
        });
    }
    calcularPromedio(materia);
}

function calcularPromedio(materia) {
    DOMElements.resultBox.classList.remove('reprobado-bg');

    if (materia.notas.length < CONSTANTES_UI.MIN_NOTAS_PARA_CALCULAR) {
        DOMElements.promedioValorSpan.textContent = '--';
        DOMElements.estadoAprobacionSpan.textContent = 'Faltan notas';
        DOMElements.estadoAprobacionSpan.className = 'status-failed';
        return;
    }
    
    const sumaNotas = materia.notas.reduce((acumulador, nota) => acumulador + nota, 0);
    const promedio = sumaNotas / materia.notas.length;
    
    DOMElements.promedioValorSpan.textContent = promedio.toFixed(2);
    
    if (promedio >= CONSTANTES_UI.NOTA_MINIMA_APROBACION) {
        DOMElements.estadoAprobacionSpan.textContent = 'Aprobado';
        DOMElements.estadoAprobacionSpan.className = 'status-approved';
    } else {
        DOMElements.estadoAprobacionSpan.textContent = 'Reprobado';
        DOMElements.estadoAprobacionSpan.className = 'status-failed';
        DOMElements.resultBox.classList.add('reprobado-bg');
    }
}

export function renderizarLegajo(alumnos, alumnoSeleccionadoId, materiaSeleccionadaId) {
    const alumno = alumnos.find(a => a.id === alumnoSeleccionadoId);
    
    const alumnoSeleccionado = !!alumno;
    DOMElements.modificarAlumnoBtn.disabled = !alumnoSeleccionado;
    DOMElements.eliminarAlumnoBtn.disabled = !alumnoSeleccionado;

    renderizarAlumnos(alumnos, alumnoSeleccionadoId);
    
    if (!alumno) {
        DOMElements.tituloAlumno.textContent = 'Selecciona un alumno';
        DOMElements.mensajeSinAlumno.style.display = 'block';
        DOMElements.legajoContainer.style.display = 'none';
        return;
    }

    DOMElements.tituloAlumno.textContent = alumno.nombre;
    DOMElements.mensajeSinAlumno.style.display = 'none';
    DOMElements.legajoContainer.style.display = 'block';

    renderizarMaterias(alumno, materiaSeleccionadaId);
    renderizarNotas(alumno, materiaSeleccionadaId);
}