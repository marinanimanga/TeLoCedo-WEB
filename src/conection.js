import mysql from 'mysql2/promise'; // Importar la versión de promesas de mysql2

// Crear el pool de conexiones
const pool = mysql.createPool({
    connectionLimit: 10, // Establecer el límite de conexiones
    host: 'mysql.ovejaferoz.com',
    user: 'willyberto',
    password: 'C0s4sC0mun1st4s',
    database: 'willy'
});

// Función para obtener una conexión del pool
const obtenerConexion = async () => {
    try {
        return await pool.getConnection(); // Obtener una conexión del pool
    } catch (err) {
        console.error('Error al obtener una conexión del pool:', err.message);
        throw err;
    }
};

// Función para liberar una conexión de vuelta al pool
const liberarConexion = async (connection) => {
    try {
        if (connection) {
            await connection.release(); // Liberar la conexión de vuelta al pool
        }
    } catch (err) {
        console.error('Error al liberar la conexión al pool:', err.message);
        throw err;
    }
};

const conectar = async () => {
    let connection;
    try {
        connection = await obtenerConexion(); // Obtener una conexión del pool
        console.log('MySQL connected');
        return connection; // Devolver la conexión para que pueda ser utilizada
    } catch (err) {
        console.error('Error al conectar a MySQL:', err.message);
        if (connection) {
            await liberarConexion(connection); // Liberar la conexión en caso de error
        }
        throw err;
    }
};

export { conectar, liberarConexion, pool };

