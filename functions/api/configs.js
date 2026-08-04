export async function onRequestGet(context) {
  const { env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const stored = await env.IMAGES_KV.get('silent_configs', 'json');
    
    if (stored) {
      return new Response(JSON.stringify(stored), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Default configs
    return new Response(JSON.stringify({
      configs: {
        vless: '',
        vmess: '',
        trojan: '',
        ss: ''
      },
      telegramLink: '',
      telegramUsername: '',
      userPassword: 'silent2026'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json();
    
    const dataToStore = {
      configs: {
        vless: body.configs?.vless || '',
        vmess: body.configs?.vmess || '',
        trojan: body.configs?.trojan || '',
        ss: body.configs?.ss || ''
      },
      telegramLink: body.telegramLink || '',
      telegramUsername: body.telegramUsername || '',
      userPassword: body.userPassword || 'silent2026',
      updatedAt: new Date().toISOString()
    };

    await env.IMAGES_KV.put('silent_configs', JSON.stringify(dataToStore));

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Configs saved!'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
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
  
