export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Sirf /i/ paths handle karo
  if (!path.startsWith('/i/')) {
    return context.next();
  }
  
  const key = path.replace('/i/', '');
  
  if (!env.IMAGES_KV) {
    return new Response('KV NOT BOUND', { status: 500 });
  }

  const data = await env.IMAGES_KV.get(key);
  
  if (!data) return new Response('Not found: ' + key, { status: 404 });
  
  try {
    const imageData = JSON.parse(data);
    const binary = atob(imageData.data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    return new Response(bytes, {
      headers: {
        'Content-Type': imageData.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (err) {
    return new Response('Error: ' + err.message, { status: 500 });
  }
}
