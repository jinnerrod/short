# Project Context
Secure Single-User URL Shortener

This project is a **secure single-user URL shortener** built with Node.js and SQLite.
The system includes an **admin panel for managing links** and public routes for redirection.

Claude should prioritize:
- Security
- Simplicity
- Maintainability
- Minimal dependencies

---

# Tech Stack

Runtime:
- Node.js

Framework:
- Express.js

Database:
- SQLite using `better-sqlite3-multiple-ciphers` (SQLCipher support)

Security:
- Argon2 for password hashing
- express-session for authentication
- dotenv for environment configuration

Utilities:
- Node.js `crypto` for slug generation

---

# Project Architecture
src/
app.js
db/
connection.js
auth/
auth.js
middleware/
requireAuth.js
routes/
admin.js
public.js
utils/
slugger.js


Responsibilities:

- `db/` → database initialization and queries
- `auth/` → password verification logic
- `middleware/` → authentication protection
- `routes/` → express endpoints
- `utils/` → reusable helpers

---

# Security Rules (Critical)

Claude must always enforce the following:

### Password Handling

- Passwords must **never be stored in plaintext**
- Use `argon2.hash()` for hashing
- Use `argon2.verify()` for login validation

### SQLite Encryption

Immediately after database creation:

db.pragma(key='${process.env.DB_ENCRYPTION_KEY}')


This ensures **SQLCipher encryption at rest**.

### SQL Injection Prevention

Never construct SQL queries using string interpolation.

Use prepared statements:

db.prepare("SELECT * FROM links WHERE slug = ?")

### Authentication Protection

All admin routes must require:


requireAuth middleware


Protected routes include:


/admin/*
/api/admin/*


### Session Security

Cookies must include:


httpOnly: true
secure: NODE_ENV === "production"
sameSite: "strict"


---

# Link Generation Rules

Short links must:

- Be generated using `crypto.randomBytes`
- Use **base64url encoding**
- Default length: **6 characters**

Example:


crypto.randomBytes(6).toString("base64url").slice(0,6)


Before insertion:

- Verify slug does not already exist.

---

# Database Schema

Table: `urls`
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 code TEXT UNIQUE,
 url TEXT,
 descripcion TEXT,
 clicks INTEGER DEFAULT 0,
 created_at TEXT

---

# Coding Guidelines

Claude should follow these conventions:

### File Style

- CommonJS modules
- Small focused files
- Avoid monolithic files

### Error Handling

Return safe error messages.

Bad:


User does not exist


Good:


Invalid credentials


### Logging

Use minimal console logging in development.

Never log:

- passwords
- tokens
- secrets

---

# Common Commands

Install dependencies


npm install


Run development server


npm run dev


Run tests


npm test


---

# Environment Variables

Required `.env` variables:


PORT=3000
DB_ENCRYPTION_KEY=your-secret-key
SESSION_SECRET=your-session-secret
ADMIN_PASSWORD_HASH=argon2-hash
NODE_ENV=development


---

# Claude Behavior Guidelines

When generating code Claude should:

1. Prefer **secure defaults**
2. Avoid unnecessary dependencies
3. Keep the project **minimal and auditable**
4. Prioritize **readability over cleverness**
5. Suggest security improvements when possible

Claude should **not introduce complex frameworks** unless explicitly requested.