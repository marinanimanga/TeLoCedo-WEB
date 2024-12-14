//función general: asegura que el script no se ejecute hasta que todo el contenido del DOM esté compñetamente cargado y procesado.
document.addEventListener("DOMContentLoaded", function(){

    //acceso al formulario de registro y su botón mediante sus ID
    const registerForm = document.getElementById("registroForm");
    const btnRegistrarse = document.getElementById("botonRegistrarse");

    let autor;

    btnRegistrarse.addEventListener("click", async function(event){
        event.preventDefault();

        const nick = document.getElementById("nick").value;
        const nom_usuario = document.getElementById("nombre").value;
        const ape1 = document.getElementById("apellido1").value;
        const ape2 = document.getElementById("apellido2").value;
        const correo = document.getElementById("email").value;
        const correo2 = document.getElementById("email2").value; // Obtener el valor del segundo campo de correo electrónico
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value; // Obtener el valor del segundo campo de contraseña

        let elementoActivo = document.querySelector('input[name="autorLector"]:checked');
        if(elementoActivo) {
            autor = elementoActivo.value;
        } else {
            alert("No se ha seleccionado ninguna de las dos opciones. Por favor, seleccione 'Autor' o 'Lector'");
        }

        // Verificar que los correos electrónicos coincidan
        if (correo !== correo2) {
            alert("Los correos electrónicos no coinciden. Por favor, asegúrate de escribir el mismo correo en ambos campos.");
            return; // Salir de la función si los correos electrónicos no coinciden
        }

        // Verificar que las contraseñas coincidan
        if (password !== password2) {
            alert("Las contraseñas no coinciden. Por favor, asegúrate de escribir la misma contraseña en ambos campos.");
            return; // Salir de la función si las contraseñas no coinciden
        }
        
        console.log({ nick, nom_usuario, ape1, ape2, correo, password, autor });

        try{
            const response = await fetch("/registrar", {
                
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nick, nom_usuario, ape1, ape2, correo, password, autor })
            })
            console.log('Response:', response);
            if (!response.ok){
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();

            if(data && data.success){
                alert("REGISTRADO");
                registerForm.reset(); //Limpiar el formulario
            } else {
                alert("Error en el registro: " + data.message);
            }
        } catch (err) {
            console.error("Error: " + err);
            alert("Error al registrar el usuario en la clase registro");
        }
        }
    )
});

        
//         .then(response => {
//             if(!response.ok){
                
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log(data);
//             if (data != null && data.success) {
//                 alert("Registro exitoso");
//                 registerForm.reset(); // Limpiar el formulario de registro
//             } else {
//                 alert("Error en el registro: " + data.message);
//             }
//         })
//         .catch(error => {
//             console.error("Error:", error);
//             alert("Error al registrar usuario");
//         });
//     });
// });
