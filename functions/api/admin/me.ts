import { requireAdmin } from '../../../src/lib/server/access';
import { jsonError, jsonOk } from '../../../src/lib/server/response';

export const onRequestGet = async (context: any) => {
  const user = await requireAdmin(context.request, context.env);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  return jsonOk({ success: true, data: user });
};
