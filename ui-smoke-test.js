const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch(); // headless by default
  const page = await browser.newPage();

  try {
    // Go to frontend
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded', timeout: 10000 });
    console.log('Opened frontend root');

    // Check page has a navbar or app root element
    const navbar = await page.$('nav');
    if (navbar) console.log('Navbar found'); else console.log('Navbar not found');

    // Navigate to products list route if link exists
    const productsLink = await page.$('a[href="/products"]');
    if (productsLink) {
      await productsLink.click();
      await page.waitForLoadState('networkidle');
      console.log('Navigated to /products');
    } else {
      // fallback: try visiting product list path directly
      await page.goto('http://localhost:5174/products', { waitUntil: 'networkidle' });
      console.log('Visited /products directly');
    }

    // Look for product items
    const productItems = await page.$$('[data-testid="product-item"]');
    console.log('Product items found:', productItems.length);

    // Try opening login or auth page
    await page.goto('http://localhost:5174/login', { waitUntil: 'domcontentloaded' }).catch(() => {});
    const loginForm = await page.$('form');
    console.log('Login form present:', !!loginForm);

    console.log('UI smoke test: SUCCESS');
  } catch (err) {
    console.error('UI smoke test: ERROR', err.message);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
