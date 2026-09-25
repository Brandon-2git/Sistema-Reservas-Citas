// ==========================================================================
// LÓGICA DE AGENDA MÉDICA (HU AGENDA) - CONECTADA CON BASE DE DATOS
// ==========================================================================

function formatearFechaISO(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Obtener los días laborales (lunes a viernes) de la semana actual
function obtenerSemanaActual() {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 domingo, 1 lunes...
    const diffLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + diffLunes);

    const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const nombresMeses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const semana = [];
    for (let i = 0; i < 5; i++) {
        const d = new Date(lunes);
        d.setDate(lunes.getDate() + i);
        semana.push({
            fecha: d,
            fechaStr: formatearFechaISO(d),
            nombre: `${nombresDias[d.getDay()]} ${d.getDate()} de ${nombresMeses[d.getMonth()]}`
        });
    }
    return semana;
}

const SEMANA = obtenerSemanaActual();

// ── Estado ─────────────────────────────────────────────────────────────────
const hoyISO = formatearFechaISO(new Date());
const idxHoy = SEMANA.findIndex(d => d.fechaStr === hoyISO);
const HOY_IDX = idxHoy >= 0 ? idxHoy : 0;
let diaActual = HOY_IDX;
let vistaActual = 'hoy';

// Almacén de citas obtenidas desde la base de datos
let citasBaseDatos = [];

// ── Obtener citas desde el backend ─────────────────────────────────────────
async function cargarCitasDesdeBackend() {
    try {
        const resp = await fetch(`${API_BASE_URL}/api/citas`);
        if (resp.ok) {
            citasBaseDatos = await resp.json();
        } else {
            citasBaseDatos = [];
        }
    } catch (err) {
        console.warn("No se pudieron cargar citas desde el backend:", err);
        citasBaseDatos = [];
    }
}

// ── Renderizado de Citas en la Agenda ──────────────────────────────────────
async function renderCitas() {
    const diaLabel = document.getElementById('dia-label');
    const hoyBadge = document.getElementById('hoy-badge');
    const citasList = document.getElementById('citas-list');
    const chipTotal = document.getElementById('chip-total');
    const chipAtendidas = document.getElementById('chip-atendidas');
    const chipPendientes = document.getElementById('chip-pendientes');

    if (!citasList) return;

    // Recargar citas desde el backend para tener los datos más recientes
    await cargarCitasDesdeBackend();

    let citas = [];
    const diaSeleccionado = SEMANA[diaActual];

    if (vistaActual === 'hoy') {
        citas = citasBaseDatos.filter(c => c.fecha === diaSeleccionado.fechaStr);
        if (diaLabel) diaLabel.textContent = diaSeleccionado.nombre;
        if (hoyBadge) hoyBadge.style.display = diaSeleccionado.fechaStr === hoyISO ? 'block' : 'none';
    } else {
        // Vista Semana Completa: Todas las citas registradas
        citas = [...citasBaseDatos];
        if (diaLabel) diaLabel.textContent = `Semana del ${SEMANA[0].nombre} al ${SEMANA[4].nombre}`;
        if (hoyBadge) hoyBadge.style.display = 'none';
    }

    // Chips
    const atendidas = citas.filter(c => c.estado_class === 'atendida').length;
    const pendientes = citas.filter(c => ['confirmada', 'pendiente', 'reagendada'].includes(c.estado_class)).length;
    
    if (chipTotal) chipTotal.textContent = `${citas.length} citas ${vistaActual === 'hoy' ? 'hoy' : 'en la semana'}`;
    if (chipAtendidas) chipAtendidas.textContent = `${atendidas} atendidas`;
    if (chipPendientes) chipPendientes.textContent = `${pendientes} pendientes`;

    // Limpiar lista
    citasList.innerHTML = '';

    if (citas.length === 0) {
        citasList.innerHTML = `
            <div style="text-align:center; padding:60px 20px; color:#94a3b8; background:#fff; border-radius:16px; border:1px solid #e2e8f0;">
                <svg style="width:48px;height:48px;margin-bottom:12px;opacity:.4;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <p style="font-size:15px;font-weight:600;color:#64748b;">Sin citas programadas para este día</p>
                <p style="font-size:13px;color:#94a3b8;margin-top:4px;">Los pacientes que agenden citas desde el formulario se registrarán en la base de datos y aparecerán aquí.</p>
            </div>`;
        return;
    }

    citas.forEach((cita, index) => {
        const article = document.createElement('article');
        article.className = `cita-card ${cita.es_siguiente ? 'cita-active' : ''}`;
        article.id = `cita-${cita.id}`;
        article.setAttribute('role', 'button');
        article.setAttribute('tabindex', '0');

        article.innerHTML = `
            <div class="cita-time-block">
                <span class="cita-hora">${cita.hora}</span>
                <span class="cita-duracion">${cita.duracion || 45}m</span>
            </div>
            <div class="cita-divider divider-${cita.estado_class || 'confirmada'}"></div>
            <div class="cita-info">
                <p class="cita-nombre">${cita.paciente}</p>
                <p class="cita-tel">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-phone">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.79 19.79 19.79 0 01.13 2.18 2 2 0 012.11 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                    ${cita.telefono}
                </p>
                ${cita.motivo ? `<p class="cita-nota" style="font-weight:500;">Motivo: ${cita.motivo}</p>` : ''}
                ${cita.nota ? `<p class="cita-nota">"${cita.nota}"</p>` : ''}
                <p style="font-size:12px; color:#64748b; margin-top:2px;">${cita.especialidad || ''} • ${cita.medico || ''}</p>
                ${cita.es_siguiente ? `
                    <p class="cita-siguiente-tag">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-next">
                            <polyline points="13 17 18 12 13 7"/><line x1="6" y1="12" x2="18" y2="12"/>
                        </svg>
                        Siguiente paciente
                    </p>` : ''}
            </div>
            <div class="cita-status-block">
                <span class="status-badge status-${cita.estado_class || 'confirmada'}">
                    <span class="status-dot"></span>${cita.estado || 'Confirmada'}
                </span>
                <svg class="cita-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </div>`;

        article.style.opacity = '0';
        article.style.transform = 'translateY(8px)';
        citasList.appendChild(article);

        requestAnimationFrame(() => {
            setTimeout(() => {
                article.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
                article.style.opacity = '1';
                article.style.transform = 'translateY(0)';
            }, index * 30);
        });
    });
}

// ── Navegación entre días ──────────────────────────────────────────────────
function cambiarDia(delta) {
    const nuevo = diaActual + delta;
    if (nuevo < 0 || nuevo >= SEMANA.length) return;
    diaActual = nuevo;
    vistaActual = 'hoy';
    const btnHoy = document.getElementById('btn-hoy');
    const btnSemana = document.getElementById('btn-semana');
    if (btnHoy) btnHoy.classList.add('active');
    if (btnSemana) btnSemana.classList.remove('active');
    renderCitas();
}

// ── Cambio de vista Hoy / Semana ───────────────────────────────────────────
function cambiarVista(vista) {
    vistaActual = vista;
    const btnHoy = document.getElementById('btn-hoy');
    const btnSemana = document.getElementById('btn-semana');
    if (btnHoy) btnHoy.classList.toggle('active', vista === 'hoy');
    if (btnSemana) btnSemana.classList.toggle('active', vista === 'semana');
    renderCitas();
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderCitas();
});
