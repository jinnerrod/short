--
name: auth-validator
description: Valida que las rutas de administración y el manejo de sesiones sigan el estándar de seguridad monousuario.
triggers: - Al crear o modificar rutas en `src/routes/`Al configurar middlewares de Express o Fastify
---
# Procedimiento de Validación de Autenticación

Cada vez que se trabaje en el sistema de login o acceso al panel:
1. **Verificar Hasheo:** Asegurar que `argon2.verify()` se use para comparar la entrada del usuario con el hash en SQLite.
2. **Middleware de Protección:** Confirmar que las rutas `/admin` o `/dashboard` tengan un middleware que verifique la sesión (JWT o Session Cookie).
3. *Manejo de Errores:** No revelar si el error fue por "usuario inexistente" o "contraseña incorrecta"; usar mensajes genéricos como "Credenciales inválidas".
4. **Rate Limiting:** Sugerir el uso de `express-rate-limit` para evitar ataques de fuerza bruta al login, incluso siendo monousuario.