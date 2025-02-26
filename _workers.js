// Example Cloudflare Worker for Rocky Mountain Weddings
// This is a starting point - customize as needed

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Get the current URL
  const url = new URL(request.url);
  
  // Pass through all non-document requests (images, scripts, etc)
  if (!isDocumentRequest(request)) {
    return fetch(request);
  }
  
  // Fetch the original response
  const response = await fetch(request);
  
  // Clone the response so we can modify it
  const newResponse = new Response(response.body, response);
  
  // Add custom response headers
  newResponse.headers.set('X-Powered-By', 'Rocky Mountain Weddings');
  
  return newResponse;
}

// Helper function to determine if this is a document request
function isDocumentRequest(request) {
  const url = new URL(request.url);
  const contentType = request.headers.get('Accept');
  
  // Check if request is for HTML content
  if (contentType && contentType.includes('text/html')) {
    return true;
  }
  
  // Check if URL path indicates HTML content
  if (url.pathname.endsWith('/') || 
      url.pathname.endsWith('.html') || 
      !url.pathname.includes('.')) {
    return true;
  }
  
  return false;
} 