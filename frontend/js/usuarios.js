// js/usuarios.js

const cuerpoTabla = document.getElementById("cuerpoTablaUsuarios");
const formularioMedico = document.getElementById("formularioMedico");

const btnAltaMedico = document.getElementById("btnAltaMedico");
const vistaUsuarios = document.getElementById("vistaUsuarios");
const vistaAltaMedico = document.getElementById("vistaAltaMedico");

const buscarUsuario = document.getElementById("buscarUsuario");

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


        // Texto del estado.
        const estado =
            usuario.activo ? "Activo" : "Inactivo";


        fila.innerHTML = `
            <td>
                <div class="usuario">

                    <div class="usuario-avatar">
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
                <span class="rol">
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


// ALTA DE MÉDICO
formularioMedico.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const horasMaximas =
            document.getElementById(
                "horasMaximas"
            ).value;


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
                    : null
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