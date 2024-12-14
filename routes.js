import express from 'express';
import { conectar, liberarConexion, pool } from './src/conection.js';
import Authentication from './src/Authentication.js';
import RegistrarUsuario from './src/RegistrarUsuario.js';

const router = express.Router();
let connection;

//Ruta para servir la pag HTML
router.get('/', function(req, res) {
    res.sendFile('vistas/login.html', { root: './' });
});


//Ruta para autenticar un usuario
router.post('/autenticar', async (req, res) => {
    const { nick, password } = req.body;
    let connection;

    try {
        connection = await conectar();

        //Las validaciones se hacen en la seccion del controlador

        const consulta = "SELECT password, salt FROM usuarios WHERE nick = ?";
        const [rows, fields] = await connection.execute(consulta, [nick]);

        if (rows.length > 0) {
            const passwordHash = rows[0].password;
            const salt = rows[0].salt;

            const autenticado = Authentication.authenticate(password, passwordHash, salt);

            if (autenticado) {
                res.json({ mensaje: "Autenticado con éxito" });
            } else {
                res.status(401).json({ mensaje: "Credenciales inválidas" });
            }
        } else {
            res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ mensaje: "Error del servidor" });
    } finally {
        if (connection) {
            await liberarConexion(connection);
        }
    }
});

router.post('/registrar', async (req, res) => {
    const { nick, nom_usuario, ape1, ape2, correo, password, autor } = req.body;

    try {
    connection = await conectar();
    const usuario = new RegistrarUsuario(nick, nom_usuario, ape1, ape2, correo, password, autor);
    await usuario.registrarUsuario();
      res.json({ success: true, message: 'Usuario registrado exitosamente'});
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    } finally {
        if (connection) {
            await liberarConexion(connection); // Asegúrate de liberar la conexión
        }
    }
  });


// Endpoint para buscar libros
router.post('/buscar', async (req, res) => {
    try {
        const { titulo, nombreAutor, apellidos, categoria } = req.body;

        console.log("Datos recibidos del frontend:", titulo, nombreAutor, apellidos, categoria);

        let query = `
            SELECT libros.id, libros.id_usuario, libros.titulo, libros.categoria, 
            usuarios.id AS usuario_id, usuarios.nom_usuario AS nombreAutor, usuarios.apellido1, usuarios.apellido2
            FROM libros
            INNER JOIN usuarios ON libros.id_usuario = usuarios.id
        `;
        const params = [];

        if (categoria && categoria !== "Seleccione una categoría" && !titulo && !nombreAutor && !apellidos) {
            query += ' WHERE libros.categoria = ?';
            params.push(categoria);
        } else {
            const conditions = [];
            if (titulo) {
                conditions.push('libros.titulo LIKE ?');
                params.push(`%${titulo}%`);
            }
            if (nombreAutor) {
                conditions.push('usuarios.nom_usuario LIKE ?');
                params.push(`%${nombreAutor}%`);
            }
            if (apellidos) {
                conditions.push('(usuarios.apellido1 LIKE ? OR usuarios.apellido2 LIKE ?)');
                params.push(`%${apellidos}%`, `%${apellidos}%`);
            }
            if (categoria && categoria !== "Seleccione una categoría") {
                conditions.push('libros.categoria = ?');
                params.push(categoria);
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }
        }

        const [rows, fields] = await pool.execute(query, params);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).send('Error fetching books');
    }
});



// Endpoint para obtener los detalles de un libro
router.get('/libro/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows, fields] = await pool.execute('SELECT * FROM libros WHERE id = ?', [id]);

        if (rows.length === 0) {
            res.status(404).send('Book not found');
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        console.error('Error fetching book details:', err);
        res.status(500).send('Error fetching book details');
    }
});

// Endpoint para obtener las categorías
router.get('/obtenerCategorias', (req, res) => {
    pool.execute('SELECT id, titulo, categoria FROM libros')
        .then(([rows, fields]) => {
            res.json(rows);
        })
        .catch(err => {
            console.error('Error fetching categorias:', err);
            res.status(500).send('Error fetching categories');
        });
});

router.get('/libro/contenido/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows, fields] = await pool.execute('SELECT archivo FROM libros WHERE id = ?', [id]);

        if (rows.length === 0 || !rows[0].archivo) {
            res.status(404).send('Archivo del libro no encontrado');
        } else {
            const archivo = rows[0].archivo;
            res.send(archivo);
        }
    } catch (err) {
        console.error('Error al obtener el contenido del libro:', err);
        res.status(500).send('Error al obtener el contenido del libro');
    }
});



export default router;