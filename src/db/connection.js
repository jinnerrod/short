`const Database = require('better-sqlite3-multiple-ciphers');
const argon2 = require('argon2');
require('dotenv').config();

// 1. Conectar a la DB (crea el archivo si no existe)
const db = new Database('acortador_seguro.db', { verbose: console.log });

// 2. Aplicar CIFRADO inmediatamente (SQLCipher)
// Esto hace que el archivo .db sea ilegible sin la llave
db.pragma(`key = '${process.env.DB_ENCRYPTION_KEY}'`);

// 3. Configuración inicial de tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS urls(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    url TEXT,
    descripcion TEXT,
    clicks INTEGER DEFAULT 0,
    created_at TEXT
)
    `);

/**
 * Función para verificar al único administrador
 * @param {string} password - Contraseña enviada desde el login
 * @returns {Promise<boolean>}
 */
async function verificarAdmin(password) {
    try {
        // En un sistema monousuario, comparamos contra el hash del .env
        return await argon2.verify(process.env.ADMIN_PASSWORD_HASH, password);
    } catch (err) {
        console.error("Error en verificación:", err);
        return false;
    }
}

/**
 * Utilidad para generar tu hash inicial (Ejecútalo una vez y guárdalo en .env)
 */
async function generarHashInicial(password) {
    const hash = await argon2.hash(password);
    console.log("Copia este hash en tu archivo .env como ADMIN_PASSWORD_HASH:");
    console.log(hash);
}

module.exports = { db, verificarAdmin, generarHashInicial };`