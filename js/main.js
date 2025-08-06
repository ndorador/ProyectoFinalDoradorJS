import { getAlumnos } from '../dataService.js';
import { setAlumnos, setAlumnoSeleccionado, setMateriaSeleccionada, actualizarUI, agregarAlumno, modificarAlumno, eliminarAlumno, agregarMateria, modificarMateria, eliminarMateria, agregarNota, manejarAccionNota } from '../logic.js';
import { DOMElements } from '../ui.js';


DOMElements.listaAlumnos.addEventListener('click', (e) => {
    const boton = e.target.closest('button.alumno-btn');
    if (boton) {
        setAlumnoSeleccionado(parseInt(boton.dataset.id));
        actualizarUI();
    }
});

DOMElements.listaDeMaterias.addEventListener('click', (e) => {
    const boton = e.target.closest('button.materia-btn');
    if (boton) {
        setMateriaSeleccionada(parseInt(boton.dataset.id));
        actualizarUI();
    }
});

DOMElements.listaDeNotas.addEventListener('click', (e) => {
    const notaItem = e.target.closest('li.tarea-item');
    const botonAccion = e.target.closest('button[data-accion]');
    if (notaItem && botonAccion) {
        manejarAccionNota(e.target);
    }
});

DOMElements.agregarAlumnoBtn.addEventListener('click', agregarAlumno);
DOMElements.modificarAlumnoBtn.addEventListener('click', modificarAlumno);
DOMElements.eliminarAlumnoBtn.addEventListener('click', eliminarAlumno);

DOMElements.agregarMateriaBtn.addEventListener('click', agregarMateria);
DOMElements.modificarMateriaBtn.addEventListener('click', modificarMateria);
DOMElements.eliminarMateriaBtn.addEventListener('click', eliminarMateria);

DOMElements.agregarNotaBtn.addEventListener('click', agregarNota);

document.addEventListener('DOMContentLoaded', async () => {
    const alumnosIniciales = await getAlumnos();
    setAlumnos(alumnosIniciales);
    actualizarUI();
});