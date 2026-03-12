--
name: db-cipher
description: Asegura que todas las operaciones de base de datos pasen por el túnel de cifrado de SQLCipher.
triggers: - Al modificar `src/db/connection.js`Al realizar consultas SQL
---
# Reglas de Cifrado SQLite

1. **Llave Maestra:** Verificar que se ejecute `db.pragma("key = '" + process.env.DB_PASSWORD + "'")` inmediatamente después de `new Database()`.
2. **Prevenir Inyección:** Prohibir el uso de strings template en queries; usar siempre `prepare()` con parámetros (`?`).
3. **Cierre Seguro:** Asegurar que la base de datos se cierre correctamente en procesos de terminación (`SIGINT`, `SIGTERM`) para evitar corrupción del archivo cifrado.