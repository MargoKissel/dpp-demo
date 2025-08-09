// lib/normalizeImageUrl.ts
export function normalizeImageUrl(input?: string | null): string | null {
  if (!input) return null;
  try {
    const u = new URL(input);

    // Google Drive → прямой файл
    if (u.hostname.includes('drive.google.com')) {
      // /file/d/<id>/view
      const m = u.pathname.match(/\/file\/d\/([^/]+)/);
      const id = m?.[1] || u.searchParams.get('id');
      if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
    }

    // Dropbox share → прямой файл
    if (u.hostname.endsWith('dropbox.com')) {
      u.searchParams.set('dl', '1');
      return u.toString();
    }

    return input;
  } catch {
    return input;
  }
}
