//leer primero todo el DOM
document.addEventListener("DOMContentLoaded", function() {

    //Obtener todo el formulario de inicio de sesión
    const loginForm = document.getElementById("loginForm");
  
    // Evento de inicio de sesión del boton
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault(); // Evitar que se envíe el formulario
  
      //Obtener los valores de nick y password
      const nick = document.getElementById("nick").value;
      const password = document.getElementById("password").value;
  
      // Realizar la solicitud al backend para verificar las credenciales
      fetch("/autenticar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nick, password })
      })

      //procesar la respuesta del servidor
      .then(response => {
        if (!response.ok) {
          // Si la respuesta no es OK, lanza un error
          throw new Error('Hubo un problema con la respuesta');
        }
        return response.json();
      })

      //manejar la respuesta JSON
      .then(data => {
        if (data.mensaje === "Autenticado con éxito") {
          // Si las credenciales son válidas, cargar la lista de libros
          window.location.href = "principal.html";
        } else {
          // Si las credenciales son inválidas, mostrar un mensaje de error
          alert("Credenciales incorrectas");
        }
      })

      //Manejar los errores
      .catch(error => {
        console.error("Error:", error);
        alert("Error de red o de servidor: " + error.message);
      });
    });
   })