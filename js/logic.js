import { generarId } from './utils.js';
import { saveAlumnos } from './dataService.js';
import { renderizarLegajo, DOMElements, CONSTANTES_UI } from '../ui.js';

let alumnos = [];
let alumnoSeleccionadoId = null;
let materiaSeleccionadaId = null;

export function setAlumnos(newAlumnos) {
    alumnos = newAlumnos;
}

export function getEstado() {
    return { alumnos, alumnoSeleccionadoId, materiaSeleccionadaId };
}

export function setAlumnoSeleccionado(id) {
    alumnoSeleccionadoId = id;
    materiaSeleccionadaId = null;
}

export function setMateriaSeleccionada(id) {
    materiaSeleccionadaId = id;
}

export function actualizarUI() {
    renderizarLegajo(alumnos, alumnoSeleccionadoId, materiaSeleccionadaId);
}

export function agregarAlumno() {
    if (alumnos.length >= CONSTANTES_UI.MAX_ALUMNOS) {
        Swal.fire({
            icon: 'warning',
            title: 'Ojo!',
            text: `No puedes agregar más de ${CONSTANTES_UI.MAX_ALUMNOS} alumnos.`,
            confirmButtonColor: '#28a745'
        });
        return;
    }
    
    Swal.fire({
        title: 'Agregar nuevo alumno',
        input: 'text',
        inputLabel: 'Nombre del alumno:',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545',
        inputValidator: (value) => {
            if (!value || value.trim() === '') {
                return 'El nombre no puede estar vacío.';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const nuevoAlumno = {
                id: generarId(),
                nombre: result.value.trim(),
                materias: []
            };
            alumnos.push(nuevoAlumno);
            setAlumnoSeleccionado(nuevoAlumno.id);
            saveAlumnos(alumnos);
            actualizarUI();
            Swal.fire({
                icon: 'success',
                title: 'Alumno Agregado',
                text: `El alumno "${result.value.trim()}" ha sido creado.`,
                confirmButtonColor: '#28a745'
            });
        }
    });
}

export function modificarAlumno() {
    const alumno = alumnos.find(a => a.id === alumnoSeleccionadoId);
    if (!alumno) return;

    Swal.fire({
        title: 'Modificar nombre',
        input: 'text',
        inputValue: alumno.nombre,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        inputValidator: (value) => {
            if (!value || value.trim() === '') {
                return 'El nombre no puede estar vacío.';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            alumno.nombre = result.value.trim();
            saveAlumnos(alumnos);
            actualizarUI();
            Swal.fire({
                icon: 'success',
                title: 'Modificado',
                text: 'Nombre del alumno actualizado.',
                confirmButtonColor: '#28a745'
            });
        }
    });
}

export function eliminarAlumno() {
    const alumno = alumnos.find(a => a.id === alumnoSeleccionadoId);
    if (!alumno) return;

    Swal.fire({
        title: '¿Estás seguro?',
        text: `Se eliminará a ${alumno.nombre} y todo su legajo.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d'
    }).then((result) => {
        if (result.isConfirmed) {
            alumnos = alumnos.filter(a => a.id !== alumnoSeleccionadoId);
            alumnoSeleccionadoId = null;
            materiaSeleccionadaId = null;
            saveAlumnos(alumnos);
            actualizarUI();
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'Alumno eliminado con éxito.',
                confirmButtonColor: '#28a745'
            });
        }
    });
}

export function agregarMateria() {
    const alumno = alumnos.find(a => a.id === alumnoSeleccionadoId);
    if (!alumno) return;

    const nombreMateria = DOMElements.nuevaMateriaInput.value.trim();
    if (!nombreMateria) {
        Swal.fire({
            icon: 'warning',
            title: 'Ojo!',
            text: 'El nombre de la materia no puede estar vacío.',
            confirmButtonColor: '#28a745'
        });
        return;
    }

    const nuevaMateria = {
        id: generarId(),
        nombre: nombreMateria,
        notas: []
    };
    alumno.materias.push(nuevaMateria);
    saveAlumnos(alumnos);
    actualizarUI();
    DOMElements.nuevaMateriaInput.value = '';
    Swal.fire({
        icon: 'success',
        title: 'Materia Agregada',
        text: 'La materia ha sido creada.',
        confirmButtonColor: '#28a745'
    });
}

export function modificarMateria() {
    const { alumnos, alumnoSeleccionadoId, materiaSeleccionadaId } = getEstado();
    const alumno = alumnos.find(a => a.id === alumnoSeleccionadoId);
    const materia = alumno?.materias.find(m => m.id === materiaSeleccionadaId);
    if (!materia) return;

    Swal.fire({
        title: 'Modificar nombre de materia',
        input: 'text',
        inputValue: materia.nombre,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        inputValidator: (value) => {
            if (!value || value.trim() === '') {
                return 'El nombre no puede estar vacío.';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            materia.nombre = result.value.trim();
            saveAlumnos(alumnos);
            actualizarUI();
            Swal.fire({
                icon: 'success',
                title: 'Modificada',
                text: `La materia ha sido renombrada a "${result.value.trim()}".`,
                confirmButtonColor: '#28a745'
            });
        }
    });
}

export function eliminarMateria() {
    const { alumnos, alumnoSeleccionadoId, materiaSeleccionadaId } = getEstado();
    const alumno = alumnos.find(a => a.id === alumnoSeleccionadoId);
    if (!alumno) return;
    const materia = alumno.materias.find(m => m.id === materiaSeleccionadaId);
    if (!materia) return;

    Swal.fire({
        title: '¿Estás seguro?',
        text: `Se eliminará la materia "${materia.nombre}" y todas sus notas.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d'
    }).then((result) => {
        if (result.isConfirmed) {
            alumno.materias = alumno.materias.filter(m => m.id !== materiaSeleccionadaId);
            setMateriaSeleccionada(null);
            saveAlumnos(alumnos);
            actualizarUI();
            Swal.fire({
                icon: 'success',
                title: 'Eliminada',
                text: 'La materia ha sido eliminada.',
                confirmButtonColor: '#28a745'
            });
        }
    });
}

export function agregarNota() {
    const { alumnos, alumnoSeleccionadoId, materiaSeleccionadaId } = getEstado();
    const alumno = alumnos.find(a => a.id === alumnoSeleccionadoId);
    const materia = alumno?.materias.find(m => m.id === materiaSeleccionadaId);
    if (!materia) return;

    const notaNumerica = parseFloat(DOMElements.nuevaNotaInput.value);

    if (materia.notas.length >= CONSTANTES_UI.MAX_NOTAS_POR_MATERIA) {
        Swal.fire({
            icon: 'warning',
            title: 'Ojo!',
            text: `No puedes agregar más de ${CONSTANTES_UI.MAX_NOTAS_POR_MATERIA} notas a esta materia.`,
            confirmButtonColor: '#28a745'
        });
        return;
    }
    
    if (isNaN(notaNumerica) || notaNumerica < 1 || notaNumerica > 10) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ingresa una nota válida entre 1 y 10.',
            confirmButtonColor: '#28a745'
        });
        return;
    }

    materia.notas.push(notaNumerica);
    saveAlumnos(alumnos);
    actualizarUI();
    DOMElements.nuevaNotaInput.value = '';
    Swal.fire({
        icon: 'success',
        title: 'Nota Agregada',
        text: 'La nota ha sido añadida.',
        confirmButtonColor: '#28a745'
    });
}

export function manejarAccionNota(target) {
    const notaItem = target.closest('li');
    if (!notaItem) return;

    const notaIndex = parseInt(notaItem.dataset.notaIndex);
    const { alumnos, alumnoSeleccionadoId, materiaSeleccionadaId } = getEstado();
    const alumno = alumnos.find(a => a.id === alumnoSeleccionadoId);
    const materia = alumno?.materias.find(m => m.id === materiaSeleccionadaId);
    if (!materia) return;
    
    if (target.dataset.accion === 'eliminar') {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta nota será eliminada permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                materia.notas.splice(notaIndex, 1);
                saveAlumnos(alumnos);
                actualizarUI();
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminada',
                    text: 'La nota ha sido eliminada.',
                    confirmButtonColor: '#28a745'
                });
            }
        });
    } else if (target.dataset.accion === 'modificar') {
        const notaActual = materia.notas[notaIndex];
        Swal.fire({
            title: 'Modificar nota',
            input: 'number',
            inputValue: notaActual,
            inputAttributes: { min: 1, max: 10, step: 0.1 },
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                const nuevaNota = parseFloat(result.value);
                if (!isNaN(nuevaNota) && nuevaNota >= 1 && nuevaNota <= 10) {
                    materia.notas[notaIndex] = nuevaNota;
                    saveAlumnos(alumnos);
                    actualizarUI();
                    Swal.fire({
                        icon: 'success',
                        title: 'Modificada',
                        text: 'La nota ha sido modificada.',
                        confirmButtonColor: '#28a745'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Debes ingresar un valor numérico entre 1 y 10.',
                        confirmButtonColor: '#28a745'
                    });
                }
            }
        });
    }
}