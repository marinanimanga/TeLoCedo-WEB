import { conectar, liberarConexion } from './conection.js';
import PasswordHashing from './PasswordHashing.js';

class RegistrarUsuario {
  constructor(nick, nom_usuario, ape1, ape2, correo, password, autor) {
    this.nick = nick;
    this.nom_usuario = nom_usuario;
    this.ape1 = ape1;
    this.ape2 = ape2;
    this.correo = correo;
    this.password = password;
    this.autor = autor;
  }

  async registrarUsuario() {
    let connection;

   try{
    connection = await conectar();

    //Acceso a las variables del objeto actual, no las locales o globales.
    if (!this.nick || !this.nom_usuario || !this.correo || !this.password || !this.autor) {
        throw new Error('Datos incompletos');
    }

    const salt = PasswordHashing.generateSalt();
    const consulta = `
        INSERT INTO usuarios (nom_usuario, apellido1, apellido2, nick, password, correo, salt, autor_lector)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const codificada = PasswordHashing.hashPassword(this.password, salt);

    await connection.query(consulta, [this.nom_usuario, this.ape1, this.ape2, this.nick, codificada, this.correo, salt, this.autor]);


  } catch (error) {
    
    console.error("Error al insertar usuario (en la clase RU):", error);
    throw new Error('Error al insertar usuario (en la clase RU): ' + error.message);

      } finally {
        if (connection) {
            await liberarConexion(connection); // Asegurarse de liberar la conexión
        }
    }
  }
}

export {RegistrarUsuario as default};
