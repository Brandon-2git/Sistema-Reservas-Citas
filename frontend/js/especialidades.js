// js/especialidades.js

// ======================================================
// ELEMENTOS DEL DOM
// ======================================================

const formulario = document.getElementById("formularioEspecialidad");
const inputNombre = document.getElementById("nombreEspecialidad");
const inputDescripcion = document.getElementById("descripcionEspecialidad");
const inputIcono = document.getElementById("icono");
const iconoSeleccionado = document.getElementById("iconoSeleccionado");
const btnElegirIcono = document.getElementById("btnElegirIcono");
const selectorEmoji = document.getElementById("selectorEmoji");
const mensajeFormulario = document.getElementById("mensajeFormulario");
const cuerpoTabla = document.getElementById("cuerpoTablaEspecialidades");
const btnGuardar = formulario.querySelector('button[type="submit"]');

const TEXTO_SIN_ICONO = "Sin icono";


// ======================================================
// TABLA DE ESPECIALIDADES
// ======================================================

// Crea una celda con texto. Se usa textContent y no innerHTML
// para que un nombre con caracteres especiales no se interprete como HTML.
function crearCelda(texto, clase) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    if (clase) {
        celda.className = clase;
    }
    return celda;
}

// Muestra una sola fila con un mensaje (lista vacia o error).
function mostrarFilaUnica(texto) {
    cuerpoTabla.innerHTML = "";

    const fila = document.createElement("tr");
    const celda = crearCelda(texto, "esp-vacio");
    celda.colSpan = 4;

    fila.appendChild(celda);
    cuerpoTabla.appendChild(fila);
}

function mostrarEspecialidades(lista) {
    if (lista.length === 0) {
        mostrarFilaUnica("Aún no hay especialidades registradas.");
        return;
    }

    cuerpoTabla.innerHTML = "";

    lista.forEach(item => {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(item.icono || "-", "esp-icono-celda"));
        fila.appendChild(crearCelda(item.nombre));
        fila.appendChild(crearCelda(item.descripcion || "-"));
        fila.appendChild(crearCelda(item.medicos));

        cuerpoTabla.appendChild(fila);
    });
}

// Obtiene las especialidades desde el backend y las pinta en la tabla.
async function cargarEspecialidades() {
    try {
        const respuesta = await fetch(`${API_BASE_URL}/especialidades`);

        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}`);
        }

        mostrarEspecialidades(await respuesta.json());

    } catch (error) {
        console.error("Error al cargar especialidades:", error);
        mostrarFilaUnica("Error al cargar las especialidades.");
    }
}


// ======================================================
// MENSAJES DEL FORMULARIO
// ======================================================

// tipo: "exito" o "error" (clases de especialidades.css)
function mostrarMensaje(texto, tipo) {
    mensajeFormulario.textContent = texto;
    mensajeFormulario.className = `esp-mensaje ${tipo}`;
}

// El backend responde "error" como texto (regla de negocio)
// o como lista (errores de validacion de Pydantic).
function textoDeError(error) {
    if (typeof error === "string") {
        return error;
    }

    if (Array.isArray(error)) {
        return error
            .map(e => `${(e.loc || []).join(".")}: ${e.msg}`)
            .join(" | ");
    }

    return "No se pudo registrar la especialidad.";
}


// ======================================================
// SELECTOR DE ICONO
// ======================================================

// Muestra u oculta el selector de emojis.
btnElegirIcono.addEventListener("click", () => {
    selectorEmoji.hidden = !selectorEmoji.hidden;
});

// Al elegir un emoji se guarda en el input oculto y se muestra en la vista previa.
selectorEmoji.addEventListener("emoji-click", (evento) => {
    const emoji = evento.detail.unicode;

    inputIcono.value = emoji;
    iconoSeleccionado.textContent = emoji;
    iconoSeleccionado.classList.add("con-icono");

    selectorEmoji.hidden = true;
});

function reiniciarIcono() {
    inputIcono.value = "";
    iconoSeleccionado.textContent = TEXTO_SIN_ICONO;
    iconoSeleccionado.classList.remove("con-icono");
}


// ======================================================
// REGISTRAR ESPECIALIDAD
// ======================================================

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Solo se envian los campos opcionales que tienen valor
    const datos = { nombre: inputNombre.value.trim() };

    const descripcion = inputDescripcion.value.trim();
    if (descripcion) {
        datos.descripcion = descripcion;
    }

    if (inputIcono.value) {
        datos.icono = inputIcono.value;
    }

    btnGuardar.disabled = true;
    mostrarMensaje("", "");

    try {
        const respuesta = await fetch(`${API_BASE_URL}/especialidades`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const cuerpo = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje(textoDeError(cuerpo.error), "error");
            return;
        }

        mostrarMensaje("Especialidad registrada.", "exito");
        formulario.reset();
        reiniciarIcono();
        await cargarEspecialidades();

    } catch (error) {
        console.error("Error al registrar especialidad:", error);
        mostrarMensaje(
            "No se pudo registrar la especialidad. Revisa que el servidor esté activo.",
            "error"
        );

    } finally {
        btnGuardar.disabled = false;
    }
});


// ======================================================
// INICIO
// ======================================================

cargarEspecialidades();