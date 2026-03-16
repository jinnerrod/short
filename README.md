# URL Shortener

Acortador de URLs seguro para un solo usuario, construido con Astro + Node.js y SQLite.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | [Astro 5](https://astro.build) (SSR, modo standalone) |
| Runtime | Node.js (`@astrojs/node`) |
| Base de datos | SQLite vía `better-sqlite3` |
| Autenticación | SHA-256 con comparación timing-safe + sesiones en memoria |

---

## Estructura del proyecto

```
src/
├── db/
│   └── db.ts              # Conexión SQLite e inicialización de tabla
├── lib/
│   ├── auth.ts            # Verificación de contraseña
│   └── session.ts         # Gestión de tokens de sesión (en memoria)
├── middleware.ts           # Protección de rutas admin
├── utils/
│   └── base62.ts          # Generador de códigos cortos (Base62, 6 caracteres)
└── pages/
    ├── index.astro         # Redirige al sitio principal
    ├── login.astro         # Pantalla de inicio de sesión
    ├── logout.astro        # Cierre de sesión (GET → /login)
    ├── admin.astro         # Panel de administración
    ├── add.astro           # Formulario para acortar URLs
    ├── [short].ts          # Redirección pública por código
    └── api/
        ├── auth/
        │   └── login.ts   # POST /api/auth/login
        └── admin/
            ├── shorten.ts # POST /api/admin/shorten
            ├── update.ts  # POST /api/admin/update
            └── delete.ts  # POST /api/admin/delete
```

---

## Esquema de base de datos

Tabla: `urls`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INTEGER PK | Autoincremental |
| `code` | TEXT UNIQUE | Código corto (6 chars Base62) |
| `url` | TEXT | URL de destino |
| `descripcion` | TEXT | Descripción opcional |
| `clicks` | INTEGER | Contador de visitas (default 0) |
| `created_at` | TEXT | Fecha de creación (`datetime('now')`) |

---

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar:

```env
PORT=4321
ADMIN_PASSWORD=cambia_esta_contrasena
NODE_ENV=development   # producción: "production"
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (default 4321) |
| `ADMIN_PASSWORD` | Contraseña en texto plano del administrador |
| `NODE_ENV` | `development` o `production` (activa cookies `Secure` en producción) |

> **Nota:** La contraseña nunca se almacena — en cada login se hashea con SHA-256 y se compara de forma timing-safe con el hash de `ADMIN_PASSWORD`.

---

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

---

## API

Todos los endpoints `/api/admin/*` requieren sesión activa (cookie `session`).

### `POST /api/auth/login`

Inicia sesión.

**Body:**
```json
{ "password": "tu-contraseña" }
```

**Respuestas:**
- `200` `{ "ok": true }` — sesión creada
- `401` `{ "error": "Credenciales inválidas" }` — contraseña incorrecta

---

### `GET /logout`

Destruye la sesión y redirige a `/login`.

---

### `POST /api/admin/shorten`

Crea un enlace corto.

**Body:**
```json
{ "url": "https://ejemplo.com", "descripcion": "Texto opcional" }
```

**Respuestas:**
- `200` `{ "short": "/aB3x9z", "id": 1, "url": "...", "descripcion": "..." }`
- `400` `{ "error": "URL inválida" }`
- `500` `{ "error": "Error al generar código único" }` (colisión extrema)

---

### `POST /api/admin/update`

Actualiza URL y descripción de un enlace existente.

**Body:**
```json
{ "id": 1, "url": "https://nuevo-destino.com", "descripcion": "Nueva desc" }
```

**Respuestas:**
- `200` `{ "ok": true }`
- `400` URL o ID inválidos
- `404` `{ "error": "URL no encontrada" }`

---

### `POST /api/admin/delete`

Elimina un enlace.

**Body:**
```json
{ "id": 1 }
```

**Respuestas:**
- `200` `{ "ok": true }`
- `400` ID inválido
- `404` `{ "error": "URL no encontrada" }`

---

### `GET /:code`

Redirección pública. Incrementa el contador de clicks y redirige (302) a la URL destino.

- `302` → destino
- `404` `Not found` — código inexistente

---

## Rutas protegidas

El middleware (`src/middleware.ts`) bloquea el acceso sin sesión a:

| Patrón | Tipo | Sin sesión |
|---|---|---|
| `/admin`, `/admin/*` | Página | Redirige a `/login` |
| `/add`, `/add/*` | Página | Redirige a `/login` |
| `/api/admin/*` | API | `401 { "error": "No autorizado" }` |

---

## Seguridad

- **Contraseña:** comparación timing-safe (SHA-256) — evita ataques de tiempo
- **Sesiones:** tokens de 32 bytes aleatorios (`crypto.randomBytes`) en memoria
- **Cookies:** `httpOnly`, `sameSite: strict`, `secure` en producción, expiración 8h
- **SQL:** únicamente prepared statements — sin interpolación de strings
- **Códigos:** Base62 con rechazo de bytes para evitar sesgo de módulo
- **URLs:** validación de protocolo `http:`/`https:` antes de insertar
- **Logout:** página GET en `/logout` — evita bloqueo CSRF de `@astrojs/node` v9
