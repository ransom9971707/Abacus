// Tiny zero-dependency web server for previewing or self-hosting the site.
// (You can also skip this file entirely and upload the "public" folder to
//  Netlify, Vercel, GitHub Pages or any web host.)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.glb': 'model/gltf-binary',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

// Allows exactly what the site uses: Google Fonts, the 3D viewer, scroll effects and Google Maps.
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://unpkg.com https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' blob: data: https://unpkg.com https://www.gstatic.com",
  "worker-src 'self' blob:",
  'frame-src https://www.google.com https://maps.google.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

async function send(res, status, file, method) {
  const ext = path.extname(file).toLowerCase();
  const body = await readFile(file);
  res.writeHead(status, {
    ...SECURITY_HEADERS,
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Content-Length': body.length,
    'Cache-Control': ext === '.html' || ext === '.json' ? 'no-cache' : 'public, max-age=86400',
  });
  res.end(method === 'HEAD' ? undefined : body);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end();
    }

    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';

    // Never serve hidden files, and never leave the public folder.
    const file = path.normalize(path.join(ROOT, pathname));
    if (!file.startsWith(ROOT + path.sep) || pathname.split('/').some((part) => part.startsWith('.'))) {
      res.writeHead(403, SECURITY_HEADERS);
      return res.end('Forbidden');
    }

    for (const candidate of path.extname(file) ? [file] : [file, `${file}.html`]) {
      try {
        return await send(res, 200, candidate, req.method);
      } catch {
        /* try the next candidate */
      }
    }
    return await send(res, 404, path.join(ROOT, '404.html'), req.method);
  } catch {
    res.writeHead(400, SECURITY_HEADERS);
    return res.end('Bad request');
  }
});

server.listen(PORT, () => console.log(`Clinic website running at http://localhost:${PORT}`));
