const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const { db, verificarAdmin } = require('./db/connection'); // Tu archivo anterior
const { requireAuth } = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Sesión Segura
app.use(session({
    store: new SQLiteStore({ db: 'sessions.db', dir: './' }),
    secret: process.env.SESSION_SECRET || 'cambiame-por-algo-largo',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        httpOnly: true, // Evita robo de sesión por JS (XSS)
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

// --- RUTAS PÚBLICAS ---

// Login: Procesa la entrada del único usuario
app.post('/login', async (req, res) => {
    const { password } = req.body;
    const esValido = await verificarAdmin(password);

    if (esValido) {
        req.session.isAuthenticated = true;
        return res.json({ success: true, message: 'Acceso concedido' });
    }
    res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
});

// Redirección de acortador (Pública)
app.get('/:slug', (req, res) => {
    const link = db.prepare('SELECT url FROM links WHERE slug = ?').get(req.params.slug);
    if (link) {
        db.prepare('UPDATE links SET clicks = clicks + 1 WHERE slug = ?').run(req.params.slug);
        return res.redirect(link.url);
    }
    res.status(404).send('Enlace no encontrado');
});

// --- RUTAS PROTEGIDAS (Admin) ---

// Crear nuevo enlace corto (Protegido por nuestro middleware)
app.post('/admin/shorten', requireAuth, (req, res) => {
    const { slug, url } = req.body;
    try {
        db.prepare('INSERT INTO links (slug, url) VALUES (?, ?)').run(slug, url);
        res.json({ success: true, shortUrl: `/${slug}` });
    } catch (err) {
        res.status(400).json({ error: 'El slug ya existe o datos inválidos' });
    }
});

app.listen(3000, () => console.log('Servidor listo en puerto 3000'));