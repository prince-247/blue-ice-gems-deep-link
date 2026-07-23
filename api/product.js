export default function handler(req, res) {
  const productHandle = req.url.split('/products/')[1];

  const shopifyDomain = 'blueicegems.com';
  const flutterAppScheme = 'blueicegems://';
  const appStoreUrl = 'https://apps.apple.com/in/app/mirror-glass-world-wide/id6752894020';
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=your.package.name';

  const userAgent = req.headers['user-agent'] || '';
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  const appDeepLink = `${flutterAppScheme}product/${productHandle}`;
  const webUrl = `https://${shopifyDomain}/products/${productHandle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <script type="text/javascript">
    const isIOS = ${isIOS};
    const isAndroid = ${isAndroid};

    const appLink = '${appDeepLink}';
    const appStore = '${appStoreUrl}';
    const playStore = '${playStoreUrl}';
    const webUrl = '${webUrl}';

    function tryOpenApp() {
      const now = Date.now();
      const timeout = 1500;

      // Set up fallback
      let hasVisibilityChanged = false;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          hasVisibilityChanged = true;
        }
      });

      // Try opening app
      window.location.href = appLink;

      // After delay, fallback if app didn’t open
      setTimeout(() => {
        if (!hasVisibilityChanged) {
          // Always fall back to the actual product page on the web.
          // (Previously Android went to the Play Store instead of the
          // product page here — that's a separate bug from the DNS issue.)
          window.location.replace(webUrl);
        }
      }, timeout);
    }

    window.onload = tryOpenApp;
  </script>
</head>
<body>
  <p>Redirecting to Blue Ice Gems app...</p>
</body>
</html>
`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
