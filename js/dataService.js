const CLAVE_STORAGE = "legajoDeAlumnos";
const URL_LEGAJO = "./data/legajo.json"; 

export async function getAlumnos() {
    const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
    if (datosGuardados) {
        return JSON.parse(datosGuardados);
    } else {
        try {
            const respuesta = await fetch(URL_LEGAJO);
            if (!respuesta.ok) {
                throw new Error(`Error de red: ${respuesta.status}`);
            }
            const alumnosIniciales = await respuesta.json();
            saveAlumnos(alumnosIniciales);
            return alumnosIniciales;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de carga',
                text: `No se pudieron cargar los datos iniciales. ${error.message}`
            });
            return [];
        }
    }
}

export function saveAlumnos(alumnos) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(alumnos));
}