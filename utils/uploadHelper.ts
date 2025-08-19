import mime from 'mime-types';

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Build a safe object path like `<uuid>/<timestamp>_<slug>`
 */
export function buildObjectPath(userUUID: string, filename: string) {
  const slug = slugify(filename);
  const ts = Date.now();
  return `${userUUID}/documents/${ts}_${slug}`;
}

export function getContentType(fileName: string) {
  return mime.lookup(fileName) || 'application/octet-stream';
}