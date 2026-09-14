console.log("registro.js cargado");
const formulario = document.getElementById("registroForm");

formulario.addEventListener("submit", async function(event) {
    console.log("submit interceptado");

    event.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value,
        apellidoPaterno: document.getElementById("apellidoPaterno").value,
        apellidoMaterno: document.getElementById("apellidoMaterno").value,
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        telefono: document.getElementById("telefono").value,
        correo: document.getElementById("correo").value,
        contrasena: document.getElementById("contrasena").value
    };

    const respuesta = await fetch(`${API_BASE_URL}/pacientes/registro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (respuesta.ok) {
        alert(resultado.mensaje);
    } else {
        alert("Error: " + JSON.stringify(resultado.error));
    }
});