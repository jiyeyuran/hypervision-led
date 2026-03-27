import { jsonError } from '../../../src/lib/server/response';

export const onRequestGet = async (context: any) => {
  const key = String(context.params.key ?? '');
  if (!key) {
    return jsonError('File key is required', 400);
  }
  const object = await context.env.ASSETS_R2.get(key);
  if (!object) {
    return jsonError('File not found', 404);
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=3600');
  return new Response(object.body, { headers });
};
