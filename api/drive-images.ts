export const config = {
  runtime: 'edge',
};

const IMAGE_EXTENSION = /\.(?:avif|gif|jpe?g|png|webp)$/i;
const isCoverImage = (name: string) => name.replace(/\.[^.]+$/, '').trim().toLocaleLowerCase('it') === 'copertina';

const decodeHtml = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const extractFolderId = (value: string) => {
  const pathMatch = value.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (pathMatch) return pathMatch[1];

  try {
    const url = new URL(value);
    return url.searchParams.get('id') ?? '';
  } catch {
    return /^[a-zA-Z0-9_-]+$/.test(value) ? value : '';
  }
};

export const parsePublicFolderImages = (html: string) => {
  const images: Array<{ id: string; name: string; url: string }> = [];
  const entryPattern = /<div class="flip-entry"[\s\S]*?<div class="flip-entry-last-modified">/g;
  const entries = html.match(entryPattern) ?? [];

  for (const entry of entries) {
    const fileId = entry.match(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/)?.[1];
    const encodedName = entry.match(/<div class="flip-entry-title">([\s\S]*?)<\/div>/)?.[1];
    const name = encodedName ? decodeHtml(encodedName.replace(/<[^>]+>/g, '')).trim() : '';

    if (!fileId || !IMAGE_EXTENSION.test(name)) continue;

    images.push({
      id: fileId,
      name,
      url: `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w2000`,
    });
  }

  return images.sort((first, second) => {
    const coverPriority = Number(isCoverImage(second.name)) - Number(isCoverImage(first.name));
    return coverPriority || first.name.localeCompare(second.name, 'it', { numeric: true });
  });
};

export default async function handler(request: Request) {
  const requestUrl = new URL(request.url);
  const folderId = extractFolderId(requestUrl.searchParams.get('folder') ?? '');

  if (!folderId) {
    return Response.json({ error: 'Link cartella non valido', images: [] }, { status: 400 });
  }

  try {
    const folderResponse = await fetch(
      `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}#grid`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GemutCapitalListings/1.0)',
        },
      },
    );

    if (!folderResponse.ok) {
      return Response.json(
        { error: 'Cartella non disponibile o non pubblica', images: [] },
        { status: folderResponse.status === 404 ? 404 : 502 },
      );
    }

    const images = parsePublicFolderImages(await folderResponse.text());

    return Response.json(
      { images },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        },
      },
    );
  } catch {
    return Response.json({ error: 'Impossibile leggere la cartella pubblica', images: [] }, { status: 502 });
  }
}
