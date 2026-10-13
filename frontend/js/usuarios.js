// js/usuarios.js

const cuerpoTabla = document.getElementById("cuerpoTablaUsuarios");
const formularioMedico = document.getElementById("formularioMedico");

const btnAltaMedico = document.getElementById("btnAltaMedico");
const vistaUsuarios = document.getElementById("vistaUsuarios");
const vistaAltaMedico = document.getElementById("vistaAltaMedico");

const buscarUsuario = document.getElementById("buscarUsuario");
const listaEspecialidades = document.getElementById("listaEspecialidades");
const btnSelectorEspecialidades = document.getElementById("btnSelectorEspecialidades");
const panelEspecialidades = document.getElementById("panelEspecialidades");
const buscarEspecialidad = document.getElementById("buscarEspecialidad");
const resumenEspecialidades = document.getElementById("resumenEspecialidades");
const sinResultadosEspecialidades = document.getElementById("sinResultadosEspecialidades");

const TEXTO_SELECCION_VACIA = "Especialidad";

const totalUsuarios = document.getElementById("totalUsuarios");
const totalPacientes = document.getElementById("totalPacientes");
const totalMedicos = document.getElementById("totalMedicos");
const totalAdministradores = document.getElementById("totalAdministradores");


// ======================================================
// VARIABLES
// ======================================================

// Guarda todos los usuarios obtenidos del backend.
let usuarios = [];

// Guarda el tipo de usuario seleccionado.
// "" = todos
let tipoSeleccionado = "";


// ======================================================
// CARGAR USUARIOS
// ======================================================

// Obtiene los usuarios desde el backend.
async function cargarUsuarios() {

    try {

        const respuesta = await fetch(
            `${API_BASE_URL}/usuarios`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los usuarios.");
        }

        usuarios = await respuesta.json();

        actualizarContadores();

        mostrarUsuarios();

    } catch (error) {

        console.error("Error al cargar usuarios:", error);

        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="5">
                    Error al cargar los usuarios.
                </td>
            </tr>
        `;
    }
}


// ======================================================
// MOSTRAR USUARIOS
// ======================================================

// Filtra los usuarios y los muestra en la tabla.
function mostrarUsuarios() {

    const textoBusqueda =
        buscarUsuario.value.toLowerCase().trim();

    const usuariosFiltrados = usuarios.filter((usuario) => {

        // Filtro por tipo.
        const coincideTipo =
            tipoSeleccionado === "" ||
            usuario.tipo?.toLowerCase() === tipoSeleccionado;

        // Filtro por nombre o correo.
        const nombreCompleto = `
            ${usuario.nombre || ""}
            ${usuario.apellidoPaterno || ""}
            ${usuario.apellidoMaterno || ""}
        `.toLowerCase();

        const correo =
            (usuario.correo || "").toLowerCase();

        const coincideBusqueda =
            nombreCompleto.includes(textoBusqueda) ||
            correo.includes(textoBusqueda);

        return coincideTipo && coincideBusqueda;
    });


    cuerpoTabla.innerHTML = "";


    if (usuariosFiltrados.length === 0) {

        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="5">
                    No se encontraron usuarios.
                </td>
            </tr>
        `;

        return;
    }


    usuariosFiltrados.forEach((usuario) => {

        const fila = document.createElement("tr");

        const nombreCompleto = `
            ${usuario.nombre || ""}
            ${usuario.apellidoPaterno || ""}
            ${usuario.apellidoMaterno || ""}
        `.trim();


        // Iniciales para el avatar.
        const iniciales =
            obtenerIniciales(usuario.nombre, usuario.apellidoPaterno);


        // Texto del rol.
        const rol =
            usuario.tipo || "Sin rol";

        const claseRol =
            usuario.tipo?.toLowerCase() === "administrador"
                ? "rol-admin"
                : usuario.tipo?.toLowerCase() === "medico"
                    ? "rol-medico"
                    : "rol-default";

        const claseAvatar =
            usuario.tipo?.toLowerCase() === "administrador"
                ? "avatar-admin"
                : usuario.tipo?.toLowerCase() === "medico"
                    ? "avatar-medico"
                    : "avatar-default";

        // Texto del estado.
        const estado =
            usuario.activo ? "Activo" : "Inactivo";


        fila.innerHTML = `
            <td>
                <div class="usuario">

                    <div class="usuario-avatar ${claseAvatar}">

                        ${iniciales}
                    </div>

                    <div>
                        <div class="usuario-nombre">
                            ${nombreCompleto}
                        </div>

                        <div class="usuario-correo">
                            ${usuario.correo || ""}
                        </div>
                    </div>

                </div>
            </td>

            <td>

                <span class="rol ${claseRol}">

                    ${rol}
                </span>
            </td>

            <td>
                ${usuario.telefono || "Sin teléfono"}
            </td>

            <td>
                <span class="estado ${usuario.activo ? "" : "inactiva"}">
                    ${estado}
                </span>
            </td>

            <td>
                <div class="acciones">

                    <!-- Botón editar -->
                    ${usuario.tipo?.toLowerCase() === "medico" ? `
                        <button
                            type="button"
                            class="accion btn-editar"
                            data-id="${usuario.id}"
                            title="Editar usuario"
                        >
                            ✎
                        </button>
                    ` : ""}
                    </button>

                    <!-- Toggle activar / desactivar -->
                    <button
                        type="button"
                        class="toggle ${usuario.activo ? "activo" : ""}"
                        data-id="${usuario.id}"
                        data-activo="${usuario.activo}"
                        title="${usuario.activo ? "Desactivar usuario" : "Activar usuario"}"
                    >
                        <span class="toggle-circulo"></span>
                    </button>

                </div>
            </td>
        `;

        cuerpoTabla.appendChild(fila);
    });
}


// ======================================================
// OBTENER INICIALES
// ======================================================

function obtenerIniciales(nombre, apellidoPaterno) {

    const primeraInicial =
        nombre ? nombre.charAt(0).toUpperCase() : "";

    const segundaInicial =
        apellidoPaterno
            ? apellidoPaterno.charAt(0).toUpperCase()
            : "";

    return primeraInicial + segundaInicial;
}


// ======================================================
// CONTADORES
// ======================================================

function actualizarContadores() {

    totalUsuarios.textContent =
        usuarios.length;


    totalPacientes.textContent =
        usuarios.filter(
            (usuario) =>
                usuario.tipo?.toLowerCase() === "paciente"
        ).length;


    totalMedicos.textContent =
        usuarios.filter(
            (usuario) =>
                usuario.tipo?.toLowerCase() === "medico"
        ).length;


    totalAdministradores.textContent =
        usuarios.filter(
            (usuario) =>
                usuario.tipo?.toLowerCase() === "administrador"
        ).length;
}


// ======================================================
// FILTROS POR TIPO
// ======================================================

const botonesFiltro =
    document.querySelectorAll(".filter-tab");


botonesFiltro.forEach((boton) => {

    boton.addEventListener("click", () => {

        // Quita el estado activo de todos.
        botonesFiltro.forEach((boton) => {
            boton.classList.remove("active");
        });

        // Activa el botón seleccionado.
        boton.classList.add("active");

        // Obtiene el tipo del atributo data-tipo.
        tipoSeleccionado =
            boton.dataset.tipo;

        mostrarUsuarios();
    });
});

// BUSCADOR
buscarUsuario.addEventListener("input", () => {

    mostrarUsuarios();

});

// ACTIVAR / DESACTIVAR USUARIO
cuerpoTabla.addEventListener("click", async (evento) => {

    if (!evento.target.closest(".toggle")) {
        return;
    }
    const botonToggle = evento.target.closest(".toggle");
    const id = botonToggle.dataset.id;
    const activoActual =
        evento.target.dataset.activo === "true";


    try {

        const respuesta = await fetch(
            `${API_BASE_URL}/usuarios/${id}`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    activo: !activoActual
                })
            }
        );


        const resultado =
            await respuesta.json();


        if (respuesta.ok) {
            // Vuelve a cargar los usuarios.
            cargarUsuarios();
        } else {

            alert(
                "Error: " +
                JSON.stringify(resultado.error)
            );
        }

    } catch (error) {

        console.error(
            "Error al actualizar usuario:",
            error
        );

        alert(
            "No se pudo actualizar el usuario."
        );
    }
});

// ======================================================
// SELECTOR DE ESPECIALIDADES
// ======================================================

// Quita acentos y mayusculas para que "cardio" encuentre "Cardiología".
function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// Abre o cierra el panel desplegable.
function alternarPanelEspecialidades(abrir) {

    panelEspecialidades.hidden = !abrir;

    btnSelectorEspecialidades.setAttribute(
        "aria-expanded",
        String(abrir)
    );

    if (abrir) {
        buscarEspecialidad.focus();
    }
}

// Muestra las especialidades marcadas como etiquetas en el campo.
function actualizarResumenEspecialidades() {

    const marcadas = listaEspecialidades.querySelectorAll(
        'input[type="checkbox"]:checked'
    );

    resumenEspecialidades.innerHTML = "";

    if (marcadas.length === 0) {
        resumenEspecialidades.textContent = TEXTO_SELECCION_VACIA;
        resumenEspecialidades.classList.remove("con-seleccion");
        return;
    }

    marcadas.forEach((casilla) => {
        const etiqueta = document.createElement("span");
        etiqueta.className = "chip-especialidad";
        etiqueta.textContent = casilla.dataset.etiqueta;
        resumenEspecialidades.appendChild(etiqueta);
    });

    resumenEspecialidades.classList.add("con-seleccion");
}

// Oculta las opciones que no coinciden con lo escrito en el buscador.
function filtrarEspecialidadesDelSelector() {

    const texto = normalizarTexto(buscarEspecialidad.value.trim());
    let visibles = 0;

    listaEspecialidades
        .querySelectorAll(".opcion-especialidad")
        .forEach((opcion) => {
            const coincide = normalizarTexto(opcion.dataset.nombre)
                .includes(texto);

            opcion.hidden = !coincide;

            if (coincide) {
                visibles++;
            }
        });

    sinResultadosEspecialidades.hidden = visibles !== 0;
}

// Obtiene las especialidades del backend y crea una opcion por cada una.
async function cargarEspecialidades() {

    try {

        const respuesta = await fetch(
            `${API_BASE_URL}/especialidades`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener las especialidades.");
        }

        const especialidades = await respuesta.json();

        listaEspecialidades.innerHTML = "";

        if (especialidades.length === 0) {

            listaEspecialidades.innerHTML = `
                <span class="texto-ayuda">
                    Aún no hay especialidades registradas.
                    Créalas en la sección Especialidades.
                </span>
            `;

            return;
        }

        especialidades.forEach((especialidad) => {

            const opcion = document.createElement("label");
            opcion.className = "opcion-especialidad";
            opcion.dataset.nombre = especialidad.nombre;

            const casilla = document.createElement("input");
            casilla.type = "checkbox";
            casilla.name = "especialidad";
            casilla.value = especialidad.id;
            casilla.dataset.etiqueta =
                `${especialidad.icono || ""} ${especialidad.nombre}`.trim();

            const icono = document.createElement("span");
            icono.className = "opcion-icono";
            icono.textContent = especialidad.icono || "";

            const nombre = document.createElement("span");
            nombre.textContent = especialidad.nombre;

            opcion.append(casilla, icono, nombre);
            listaEspecialidades.appendChild(opcion);
        });

        actualizarResumenEspecialidades();

    } catch (error) {

        console.error("Error al cargar especialidades:", error);

        listaEspecialidades.innerHTML = `
            <span class="texto-ayuda">
                Error al cargar las especialidades.
            </span>
        `;
    }
}

// Abrir o cerrar con el campo.
btnSelectorEspecialidades.addEventListener("click", () => {
    alternarPanelEspecialidades(panelEspecialidades.hidden);
});

// Cerrar al hacer clic fuera del selector.
document.addEventListener("click", (evento) => {
    if (!evento.target.closest("#selectorEspecialidades")) {
        alternarPanelEspecialidades(false);
    }
});

// Cerrar con la tecla Escape.
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !panelEspecialidades.hidden) {
        alternarPanelEspecialidades(false);
        btnSelectorEspecialidades.focus();
    }
});

// Filtrar mientras se escribe.
buscarEspecialidad.addEventListener("input", filtrarEspecialidadesDelSelector);

// Actualizar las etiquetas al marcar o desmarcar.
listaEspecialidades.addEventListener("change", actualizarResumenEspecialidades);

// Al limpiar el formulario (despues de registrar), reiniciar etiquetas y buscador.
formularioMedico.addEventListener("reset", () => {
    setTimeout(() => {
        actualizarResumenEspecialidades();
        filtrarEspecialidadesDelSelector();
    }, 0);
});

// ALTA DE MÉDICO
formularioMedico.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const horasMaximas =
            document.getElementById(
                "horasMaximas"
            ).value;

        // Especialidades marcadas (ids numericos).
        const especialidadIds = Array.from(
            listaEspecialidades.querySelectorAll(
                'input[type="checkbox"]:checked'
            )
        ).map((casilla) => Number(casilla.value));

        if (especialidadIds.length === 0) {
            alert("Selecciona al menos una especialidad.");
            return;
        }

        const datos = {
            nombre:
                document.getElementById("nombre").value,

            apellidoPaterno:
                document.getElementById(
                    "apellidoPaterno"
                ).value,

            apellidoMaterno:
                document.getElementById(
                    "apellidoMaterno"
                ).value || null,

            correo:
                document.getElementById("correo").value,

            telefono:
                document.getElementById("telefono").value ||
                null,

            contrasena:
                document.getElementById("contrasena").value,

            cedulaProfesional:
                document.getElementById(
                    "cedulaProfesional"
                ).value,

            consultorio:
                document.getElementById(
                    "consultorio"
                ).value || null,

            horasMaximas:
                horasMaximas
                    ? Number(horasMaximas)
                    : null,
            especialidadIds: especialidadIds
        };


        try {

            const respuesta = await fetch(
                `${API_BASE_URL}/usuarios/medicos`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(datos)
                }
            );


            const resultado =
                await respuesta.json();


            if (respuesta.ok) {

                alert(resultado.mensaje);

                formularioMedico.reset();

                // Volvemos a cargar la tabla.
                cargarUsuarios();

            } else {
                console.log("Respuesta del servidor:", JSON.stringify(resultado, null, 2));
                alert(
                    "Error: " +
                    JSON.stringify(resultado.error)
                );
            }

        } catch (error) {

            console.error(
                "Error al registrar médico:",
                error
            );

            alert(
                "No se pudo registrar el médico."
            );
        }
    }
);


// ======================================================
// CAMBIAR ENTRE VISTAS
// ======================================================

btnAltaMedico.addEventListener("click", () => {

    vistaUsuarios.classList.toggle("oculto");

    vistaAltaMedico.classList.toggle("visible");


    if (
        vistaAltaMedico.classList.contains("visible")
    ) {

        btnAltaMedico.innerHTML = `
            <span>←</span>
            Volver a usuarios
        `;

    } else {

        btnAltaMedico.innerHTML = `
            <span>+</span>
            Dar de alta médico
        `;
    }
});


// ======================================================
// CARGA INICIAL
// ======================================================

cargarUsuarios();
cargarEspecialidades();