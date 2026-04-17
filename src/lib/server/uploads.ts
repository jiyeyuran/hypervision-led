import type { AppEnv } from './types';

const IMAGE_CONTENT_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

function safeExtension(name: string, contentType: string): string {
  const byName = name.toLowerCase().match(/\.([a-z0-9]{2,5})$/u);
  if (byName) return byName[1];
  switch (contentType) {
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    default:
      return 'bin';
  }
}

export interface UploadedImage {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export async function uploadPublicImage(
  env: AppEnv,
  file: File,
  folder = 'blog',
  origin?: string,
): Promise<UploadedImage | { error: string }> {
  if (!IMAGE_CONTENT_TYPES.has(file.type)) {
    return { error: 'Only PNG / JPEG / WEBP / GIF images are supported.' };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { error: 'Image exceeds 8MB limit.' };
  }
  const ext = safeExtension(file.name, file.type);
  const id = crypto.randomUUID().replace(/-/g, '');
  const key = `public/${folder}/${id}.${ext}`;
  await env.ASSETS_R2.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });
  const base = origin ?? '';
  return {
    key,
    url: `${base}/api/public/files/${key}`,
    size: file.size,
    contentType: file.type,
  };
}
