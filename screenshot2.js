const puppeteer = require('puppeteer-core');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: 'new'
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1349, height: 999 });
    
    console.log("Navigating to http://localhost:3001");
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
    
    console.log("Taking pure background screenshot...");
    await page.screenshot({ 
      path: '/Users/admin/.gemini/antigravity-ide/brain/7478dab7-76b6-4917-9fae-279fbd168d60/pure_hero_background.png',
      clip: { x: 0, y: 0, width: 1349, height: 999 }
    });
    
    await browser.close();
    console.log("Done");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
