// ==========================================================================
// CONTROLADOR DEL PORTAL MÉDICO Y DISPARADOR DE LA AGENDA
// ==========================================================================

// Elementos del Modal de Agenda
const modalAgendaBackdrop = document.getElementById("modal-agenda");
const btnAbrirAgendaHeader = document.getElementById("btn-abrir-agenda-header");
const btnAbrirAgendaBanner = document.getElementById("btn-abrir-agenda-banner");
const btnCerrarAgenda = document.getElementById("btn-cerrar-agenda");
const contenedorPacientes = document.getElementById("contenedor-pacientes");

// ── Funciones de Apertura / Cierre del Modal de Agenda ─────────────────────
function abrirAgenda() {
    if (!modalAgendaBackdrop) return;
    modalAgendaBackdrop.classList.add("active");
    modalAgendaBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (typeof renderCitas === "function") {
        renderCitas();
    }
}

function cerrarAgenda() {
    if (!modalAgendaBackdrop) return;
    modalAgendaBackdrop.classList.remove("active");
    modalAgendaBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

// ── Renderizado de Pacientes en el Dashboard desde la BD ──────────────────
async function renderizarPacientesDashboard() {
    if (!contenedorPacientes) return;
    contenedorPacientes.innerHTML = "";

    let citas = [];
    try {
        const respuesta = await fetch(`${API_BASE_URL}/api/citas`);
        if (respuesta.ok) {
            citas = await respuesta.json();
        }
    } catch (e) {
        console.warn("No se pudieron cargar citas para el dashboard:", e);
    }

    const statTotal = document.getElementById("stat-total");
    const statConfirmadas = document.getElementById("stat-confirmadas");
    const statPendientes = document.getElementById("stat-pendientes");

    const atendidas = citas.filter(c => c.estado_class === "atendida").length;
    const pendientes = citas.filter(c => ["confirmada", "pendiente", "reagendada"].includes(c.estado_class)).length;

    if (statTotal) statTotal.textContent = citas.length;
    if (statConfirmadas) statConfirmadas.textContent = atendidas;
    if (statPendientes) statPendientes.textContent = pendientes;

    if (citas.length === 0) {
        contenedorPacientes.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px 24px; color: #94a3b8; background: #fff; border-radius: 16px; border: 1px dashed #cbd5e1;">
                <p style="font-size: 16px; font-weight: 600; color: #64748b;">No hay citas registradas</p>
                <p style="font-size: 13.5px; color: #94a3b8; margin-top: 6px;">Las citas reservadas desde el formulario se guardarán en la base de datos y aparecerán aquí.</p>
            </div>
        `;
        return;
    }

    citas.forEach(p => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-paciente";
        const inicial = (p.paciente || "P").charAt(0).toUpperCase();

        tarjeta.innerHTML = `
            <div class="paciente-col-left">
                <div class="avatar-paciente">${inicial}</div>
                <div class="datos-paciente">
                    <h3 class="nombre">${p.paciente}</h3>
                    <p class="motivo">${p.motivo} <span style="color:#64748b; font-size:12px;">(${p.especialidad || 'Consulta'} - ${p.medico || 'Médico'})</span></p>
                </div>
            </div>
            <div class="paciente-col-center">
                <span class="hora-badge">🕒 ${p.hora} (${p.fecha})</span>
                <span class="status-badge status-${p.estado_class || 'confirmada'}">
                    <span class="status-dot"></span>${p.estado || 'Confirmada'}
                </span>
            </div>
            <div class="paciente-col-actions">
                <button type="button" class="btn-paciente-accion" onclick="abrirAgenda()">Ver en Agenda</button>
            </div>
        `;

        contenedorPacientes.appendChild(tarjeta);
    });
}

// ── Inicialización de Eventos ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // Escuchadores de botones de apertura de la Agenda
    if (btnAbrirAgendaHeader) {
        btnAbrirAgendaHeader.addEventListener("click", abrirAgenda);
    }
    if (btnAbrirAgendaBanner) {
        btnAbrirAgendaBanner.addEventListener("click", abrirAgenda);
    }
    if (btnCerrarAgenda) {
        btnCerrarAgenda.addEventListener("click", cerrarAgenda);
    }

    // Cerrar al hacer clic en el backdrop
    if (modalAgendaBackdrop) {
        modalAgendaBackdrop.addEventListener("click", (e) => {
            if (e.target === modalAgendaBackdrop) {
                cerrarAgenda();
            }
        });
    }

    // Cerrar con tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalAgendaBackdrop && modalAgendaBackdrop.classList.contains("active")) {
            cerrarAgenda();
        }
    });

    renderizarPacientesDashboard();
});
