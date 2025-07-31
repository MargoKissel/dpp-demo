// lib/normalizeImageUrl.ts
export function normalizeImageUrl(raw?: string): string | null {
  if (!raw) return null;

  // Google Drive «/file/d/…/view» → «/uc?export=view&id=…»
  const g = raw.match(/drive.google.com\/file\/d\/([^/]+)/);
  if (g) return `https://drive.google.com/uc?export=view&id=${g[1]}`;

  // Dropbox «?dl=0» → «?raw=1» (выдаёт именно файл)
  if (raw.includes('dropbox.com')) return raw.replace(/\?dl=\d/, '?raw=1');

  // Если это уже прямая картинка или другой CDN — оставляем как есть
  return raw;
}
