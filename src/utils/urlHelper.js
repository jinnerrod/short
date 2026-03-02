import fs from 'fs';
import path from 'path';

// Apunta al JSON dentro de /public
const dataPath = path.resolve('./public/urls.json');

// Genera un código alfanumérico único
export function generateShortCode(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Guarda la URL en el JSON, evitando duplicados
export function saveUrl(originalUrl) {
    const urls = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Si ya existe, devuelve el código existente
    for (const [key, value] of Object.entries(urls)) {
        if (value === originalUrl) return key;
    }

    let code;
    do {
        code = generateShortCode();
    } while (urls[code]); // asegura código único

    urls[code] = originalUrl;
    fs.writeFileSync(dataPath, JSON.stringify(urls, null, 2));
    return code;
}

// Obtiene la URL a partir del código
export function getUrl(code) {
    const urls = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    return urls[code] || null;
}