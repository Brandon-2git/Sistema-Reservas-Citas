/* ==========================================================
   Lógica de interactividad para la pantalla de Login
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos las referencias a los elementos visuales del formulario
    const botonVerContrasena = document.querySelector('.boton-mostrar-clave');
    const campoContrasena = document.querySelector('#contrasena');
    
    // Validamos que los elementos existan en el DOM antes de asignar el evento
    if (botonVerContrasena && campoContrasena) {
        const iconoOjo = botonVerContrasena.querySelector('i');

        // Evento para alternar la visibilidad de la contraseña al hacer clic en el botón del ojo
        botonVerContrasena.addEventListener('click', () => {
            // Verificamos el estado actual: si el tipo es 'password', está oculta
            const esContrasenaOculta = campoContrasena.getAttribute('type') === 'password';
            
            // Alternamos el tipo del campo de texto entre 'password' y 'text'
            campoContrasena.setAttribute('type', esContrasenaOculta ? 'text' : 'password');
            
            // Actualizamos la clase del icono gráfico para que refleje el estado
            if (esContrasenaOculta) {
                iconoOjo.classList.remove('fa-eye-slash');
                iconoOjo.classList.add('fa-eye');
            } else {
                iconoOjo.classList.remove('fa-eye');
                iconoOjo.classList.add('fa-eye-slash');
            }
        });
    }

    // ==========================================================
    // Integración con el Backend (Flask) para el Login
    // ==========================================================
    const formulario = document.getElementById('formularioLogin');
    const emailInput = document.getElementById('correo');
    const passwordInput = document.getElementById('contrasena');
    const mensajeError = document.getElementById('mensajeError');

    if (formulario) {
        formulario.addEventListener('submit', async function(evento) {
            evento.preventDefault(); // Evita recargar la página

            const datosUsuario = {
                correo: emailInput.value,
                contrasena: passwordInput.value
            };

            // Ocultar mensaje de error previo si lo hay
            mensajeError.style.display = 'none';

            try {
                // Hacemos la petición al backend en el puerto 5000
                const respuesta = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosUsuario)
                });

                const datosRespuesta = await respuesta.json();

                if (respuesta.ok) {
                    // Éxito: Guardamos el token
                    localStorage.setItem('miToken', datosRespuesta.token);
                    
                    // Redirigir al dashboard (asegúrate de que esta página exista)
                    // Por ahora redirigimos a index.html si no hay dashboard
                    window.location.href = '../index.html'; 
                } else {
                    // Mostrar error devuelto por el servidor
                    mensajeError.textContent = datosRespuesta.error || 'Correo o contraseña incorrectos.';
                    mensajeError.style.display = 'block';
                }

            } catch (error) {
                console.error("Error de conexión:", error);
                mensajeError.textContent = 'Error al conectar con el servidor. ¿Está el backend encendido?';
                mensajeError.style.display = 'block';
            }
        });
    }
});
