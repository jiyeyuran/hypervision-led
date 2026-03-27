function withCors(headers: Headers) {
  headers.set('access-control-allow-origin', '*');
  headers.set('access-control-allow-methods', 'GET,POST,OPTIONS');
  headers.set('access-control-allow-headers', 'content-type,cf-access-jwt-assertion');
}

export const onRequest = async (context: any) => {
  if (context.request.method === 'OPTIONS') {
    const headers = new Headers();
    withCors(headers);
    return new Response(null, { status: 204, headers });
  }
  const response = await context.next();
  withCors(response.headers);
  return response;
};
