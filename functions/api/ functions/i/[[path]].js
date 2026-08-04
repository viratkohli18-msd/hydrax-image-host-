export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const key = url.pathname.replace('/i/', '');
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
  };

  if (!env.IMAGES_KV) {
    return new Response('KV NOT BOUND', { status: 500 });
  }

  const data = await env.IMAGES_KV.get(key);
  
  if (!data) return new Response('Not found', { status: 404 });
  
  const imageData = JSON.parse(data);
  const binary = atob(imageData.data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  return new Response(bytes, {
    headers: {
      'Content-Type': imageData.contentType,
      'Cache-Control': 'public, max-age=31536000',
      ...corsHeaders
    }
  });
}
