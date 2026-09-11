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
});
