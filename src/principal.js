document.addEventListener('DOMContentLoaded', function() {
    const categoriaSelect = document.getElementById('categoria');

    // Obtener y poblar las categorías al cargar la página
    fetch('obtenerCategorias')
    .then(response => response.json())
    .then(data => {
        data.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.text = categoria.categoria;
            categoriaSelect.add(option);
        });
    })
    .catch(error => console.error('Error al obtener las categorías:', error));

    // Manejar la búsqueda de libros al enviar el formulario
    document.getElementById('buscarLibro').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const titulo = document.getElementById('titulo').value;
        const nombreAutor = document.getElementById('nombreAutor').value;
        const apellidos = document.getElementById('apellidos').value;
        const categoria = categoriaSelect.options[categoriaSelect.selectedIndex].text;

        console.log("Valor de categoría enviado al servidor: ", nombreAutor, apellidos); // Agregar este console.log

        fetch('buscar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, nombreAutor, apellidos, categoria })
        })
        .then(response => response.json())
        .then(data => mostrarResultados(data))
        .catch(error => console.error('Error:', error));
    });

    // Función para mostrar los resultados de la búsqueda
    function mostrarResultados(libros) {
        
        const tbody = document.querySelector('#tabla-resultados tbody');
        tbody.innerHTML = ''; // Limpiar tabla antes de mostrar nuevos resultados
        
        libros.forEach(libro => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${libro.titulo}</td>
                <td>${libro.nombreAutor}</td>
                <td>${libro.apellidos}</td>
                <td>${libro.categoria}</td>
                <td>
                    <button class="detalle-btn" data-id="${libro.id}">Ver Detalles</button>
                </td>
            `;

            tbody.appendChild(row);
        });

        // Asignar evento a los botones de detalles
        document.querySelectorAll('.detalle-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                window.location.href = `detallesLibro.html?id=${id}`;
            });
        });
    }
});



