export async function onRequestPost(context) {
  const { request, env } = context;
  
  // DEBUG: Check if KV is bound
  if (!env.IMAGES_KV) {
    return new Response(JSON.stringify({
      error: 'KV NOT BOUND',
      env_keys: Object.keys(env),
      message: 'Please bind KV namespace in Pages Settings > Functions > KV namespace bindings'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No image' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const id = crypto.randomUUID();
    const key = `img_${id}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    
    const imageData = {
      data: base64,
      contentType: file.type || 'image/jpeg',
      filename: file.name,
      uploadedAt: new Date().toISOString()
    };
    
    await env.IMAGES_KV.put(key, JSON.stringify(imageData));
    
    return new Response(JSON.stringify({ 
      success: true,
      url: `${url.origin}/i/${key}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
