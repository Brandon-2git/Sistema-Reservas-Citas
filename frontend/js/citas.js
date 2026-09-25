// ==========================================================================
// LÓGICA DE CITAS Y VENTANA EMERGENTE DE ESPECIALIDADES MÉDICAS
// ==========================================================================

const ESPECIALIDADES = [
    {
        id: 1,
        nombre: "Medicina General",
        descripcion: "Consultas generales y seguimiento de salud integral para toda la familia",
        medicos: 4,
        icono: "🩺",
        doctores: ["Dr. Roberto Silva", "Dra. Carmen Soto", "Dr. Alejandro Ramos", "Dra. Laura Vega"]
    },
    {
        id: 2,
        nombre: "Cardiología",
        descripcion: "Diagnóstico, prevención y tratamiento avanzado de enfermedades del corazón",
        medicos: 3,
        icono: "❤️",
        doctores: ["Dr. Roberto Silva", "Dr. Hugo Morales", "Dra. Patricia Reyes"]
    },
    {
        id: 3,
        nombre: "Dermatología",
        descripcion: "Cuidado clínico y estético de la piel, cabello y uñas",
        medicos: 2,
        icono: "🧴",
        doctores: ["Dra. Sofía Martínez", "Dr. Fernando Ortiz"]
    },
    {
        id: 4,
        nombre: "Neurología",
        descripcion: "Tratamiento de afecciones del sistema nervioso central y periférico",
        medicos: 3,
        icono: "🧠",
        doctores: ["Dr. Carlos Herrera", "Dra. Marcela Campos", "Dr. Esteban Solís"]
    },
    {
        id: 5,
        nombre: "Ortopedia",
        descripcion: "Lesiones musculares, fracturas y afecciones del sistema musculoesquelético",
        medicos: 2,
        icono: "🦴",
        doctores: ["Dr. Javier Mendoza", "Dra. Gabriela Torres"]
    },
    {
        id: 6,
        nombre: "Pediatría",
        descripcion: "Atención médica preventiva y especializada de niños y adolescentes",
        medicos: 3,
        icono: "👶",
        doctores: ["Dra. Andrea Morales", "Dr. Ricardo Cruz", "Dra. Mónica Paz"]
    },
    {
        id: 7,
        nombre: "Ginecología",
        descripcion: "Salud integral de la mujer, control prenatal y cuidado ginecológico",
        medicos: 2,
        icono: "🌸",
        doctores: ["Dra. Elena Vázquez", "Dra. Lucía Navarro"]
    }
];

let especialidadSeleccionada = null;

// Elementos del DOM
const modalBackdrop = document.getElementById("modal-especialidades");
const btnAbrirModal = document.getElementById("btn-abrir-modal");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
const inputBusqueda = document.getElementById("input-busqueda");
const gridEspecialidades = document.getElementById("grid-especialidades");
const displayEspecialidad = document.getElementById("display-especialidad");
const selectMedico = document.getElementById("select-medico");
const formCita = document.getElementById("form-reserva-cita");
const toastAlert = document.getElementById("toast-alert");

// ── Renderizado de tarjetas de especialidades ─────────────────────────────
function renderEspecialidades(lista) {
    gridEspecialidades.innerHTML = "";

    if (lista.length === 0) {
        gridEspecialidades.innerHTML = `
            <div class="no-results">
                <p>No se encontraron especialidades que coincidan con la búsqueda.</p>
            </div>
        `;
        return;
    }

    lista.forEach(item => {
        const isSelected = especialidadSeleccionada && especialidadSeleccionada.id === item.id;
        const card = document.createElement("article");
        card.className = `card-esp ${isSelected ? 'active' : ''}`;
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Seleccionar especialidad ${item.nombre}`);

        card.innerHTML = `
            <div>
                <div class="card-icon">${item.icono}</div>
                <h3 class="card-title">${item.nombre}</h3>
                <p class="card-desc">${item.descripcion}</p>
            </div>
            <div class="card-footer">
                <span>${item.medicos} médicos disponibles</span>
                <span class="card-arrow">›</span>
            </div>
        `;

        card.addEventListener("click", () => {
            seleccionarEspecialidad(item);
        });

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                seleccionarEspecialidad(item);
            }
        });

        gridEspecialidades.appendChild(card);
    });
}

// ── Filtrado en tiempo real ────────────────────────────────────────────────
function filtrarEspecialidades() {
    const texto = (inputBusqueda.value || "").toLowerCase().trim();
    const filtradas = ESPECIALIDADES.filter(item => 
        item.nombre.toLowerCase().includes(texto) ||
        item.descripcion.toLowerCase().includes(texto)
    );
    renderEspecialidades(filtradas);
}

// ── Selección de especialidad ──────────────────────────────────────────────
function seleccionarEspecialidad(especialidad) {
    especialidadSeleccionada = especialidad;

    // Actualizar visualización en el formulario
    displayEspecialidad.className = "especialidad-display selected";
    displayEspecialidad.innerHTML = `
        <span class="esp-icon">${especialidad.icono}</span>
        <div>
            <strong>${especialidad.nombre}</strong>
            <span style="font-size: 12px; color: #475569; display: block;">${especialidad.medicos} médicos disponibles</span>
        </div>
    `;

    // Actualizar médicos disponibles en el selector
    selectMedico.innerHTML = `<option value="">Selecciona un médico disponible...</option>`;
    if (especialidad.doctores && especialidad.doctores.length > 0) {
        especialidad.doctores.forEach(doc => {
            const opt = document.createElement("option");
            opt.value = doc;
            opt.textContent = doc;
            selectMedico.appendChild(opt);
        });
        selectMedico.disabled = false;
    } else {
        selectMedico.disabled = true;
    }

    cerrarModal();
    mostrarToast(`Especialidad seleccionada: ${especialidad.nombre}`);
}

// ── Control de la Ventana Emergente (Modal) ────────────────────────────────
function abrirModal() {
    modalBackdrop.classList.add("active");
    modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (inputBusqueda) {
        inputBusqueda.value = "";
        filtrarEspecialidades();
        setTimeout(() => inputBusqueda.focus(), 150);
    }
}

function cerrarModal() {
    modalBackdrop.classList.remove("active");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

// ── Mensajes Toast ─────────────────────────────────────────────────────────
function mostrarToast(mensaje, esExito = true) {
    if (!toastAlert) return;
    toastAlert.textContent = mensaje;
    toastAlert.className = `toast-alert show ${esExito ? 'success' : ''}`;
    setTimeout(() => {
        toastAlert.className = "toast-alert";
    }, 3200);
}

// ── Eventos y Configuración Inicial ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // Render inicial dentro del modal
    renderEspecialidades(ESPECIALIDADES);

    // Botón para abrir la ventana emergente
    btnAbrirModal.addEventListener("click", abrirModal);

    // Botón para cerrar
    btnCerrarModal.addEventListener("click", cerrarModal);

    // Cerrar al hacer clic en el fondo oscuro
    modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) {
            cerrarModal();
        }
    });

    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalBackdrop.classList.contains("active")) {
            cerrarModal();
        }
    });

    // Inicializar fecha con hoy si está vacía
    const inputFecha = document.getElementById("fecha-cita");
    if (inputFecha && !inputFecha.value) {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        inputFecha.value = `${yyyy}-${mm}-${dd}`;
        inputFecha.min = `${yyyy}-${mm}-${dd}`;
    }

    // Envío del formulario de cita hacia el backend
    formCita.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!especialidadSeleccionada) {
            abrirModal();
            mostrarToast("Por favor selecciona una especialidad médica", false);
            return;
        }

        const paciente = document.getElementById("nombre-paciente").value.trim();
        const telefono = document.getElementById("tel-paciente").value.trim();
        const medico = selectMedico.value;
        const fecha = document.getElementById("fecha-cita").value;
        const hora = document.getElementById("hora-cita").value;
        const motivo = document.getElementById("motivo-cita").value.trim();
        const nota = document.getElementById("nota-cita") ? document.getElementById("nota-cita").value.trim() : "";

        if (!paciente || !telefono || !medico || !fecha || !hora || !motivo) {
            mostrarToast("Por favor completa todos los campos requeridos", false);
            return;
        }

        const citaPayload = {
            paciente,
            telefono,
            especialidad: especialidadSeleccionada.nombre,
            medico,
            fecha,
            hora,
            motivo,
            nota: nota || null,
            duracion: 45
        };

        const btnSubmit = formCita.querySelector("button[type='submit']");
        const originalHtml = btnSubmit ? btnSubmit.innerHTML : "";
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `Guardando cita...`;
        }

        try {
            const respuesta = await fetch(`${API_BASE_URL}/api/citas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(citaPayload)
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                const errorMsg = data.error ? (typeof data.error === "string" ? data.error : JSON.stringify(data.error)) : "Error al registrar cita en la base de datos";
                throw new Error(errorMsg);
            }

            mostrarToast(`✓ Cita guardada en base de datos para ${paciente} con ${medico}`, true);
            formCita.reset();
            especialidadSeleccionada = null;
            displayEspecialidad.className = "especialidad-display";
            displayEspecialidad.innerHTML = `
                <span class="esp-icon">🏥</span>
                <span>Ninguna especialidad seleccionada</span>
            `;
            selectMedico.innerHTML = `<option value="">Primero selecciona una especialidad...</option>`;
            selectMedico.disabled = true;

            if (inputFecha) {
                const hoy = new Date();
                const yyyy = hoy.getFullYear();
                const mm = String(hoy.getMonth() + 1).padStart(2, '0');
                const dd = String(hoy.getDate()).padStart(2, '0');
                inputFecha.value = `${yyyy}-${mm}-${dd}`;
            }

        } catch (error) {
            console.error("Error al registrar cita:", error);
            mostrarToast(`Error: ${error.message || "No se pudo conectar con el servidor"}`, false);
        } finally {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalHtml;
            }
        }
    });

    // Botón limpiar formulario
    const btnLimpiar = document.getElementById("btn-limpiar");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            especialidadSeleccionada = null;
            displayEspecialidad.className = "especialidad-display";
            displayEspecialidad.innerHTML = `
                <span class="esp-icon">🏥</span>
                <span>Ninguna especialidad seleccionada</span>
            `;
            selectMedico.innerHTML = `<option value="">Primero selecciona una especialidad...</option>`;
            selectMedico.disabled = true;
            if (inputFecha) {
                const hoy = new Date();
                const yyyy = hoy.getFullYear();
                const mm = String(hoy.getMonth() + 1).padStart(2, '0');
                const dd = String(hoy.getDate()).padStart(2, '0');
                inputFecha.value = `${yyyy}-${mm}-${dd}`;
            }
        });
    }
});
