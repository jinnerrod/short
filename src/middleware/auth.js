/**
 * Middleware para proteger rutas privadas.
 * Si no está autenticado, redirige al login o lanza error 401.
 */
const requireAuth = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) {
        return next();
    }
    // Si es una petición API, mandamos JSON; si es web, redirección
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    res.redirect('/login');
};

module.exports = { requireAuth };