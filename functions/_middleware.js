export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // If path starts with /i/, let it go to [[path]].js
  if (url.pathname.startsWith('/i/')) {
    return context.next();
  }
  
  return context.next();
}

