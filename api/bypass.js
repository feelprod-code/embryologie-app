export default function handler(req, res) {
  // Aggressive no-cache headers on a server-rendered route
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Hard HTML that forces immediate raw localstorage injection and service worker termination
  res.status(200).send(`
    <html>
      <head><title>Bypass</title></head>
      <body>
        <h1>Réinitialisation en cours...</h1>
        <script>
          window.localStorage.setItem('DEV_BYPASS_AUTH', 'true');
          if ('serviceWorker' in window.navigator) {
            window.navigator.serviceWorker.getRegistrations()
              .then(function(r) { 
                for(let i=0; i<r.length; i++) r[i].unregister(); 
              })
              .then(function() {
                 setTimeout(function() { window.location.href = '/'; }, 1000);
              });
          } else {
            window.location.href = '/';
          }
        </script>
      </body>
    </html>
  `);
}
