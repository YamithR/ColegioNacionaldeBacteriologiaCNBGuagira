// capture_gif.js
// Usage:
// 1) Install puppeteer: npm install puppeteer
// 2) Run: node capture_gif.js --url=file:///<absolute-path-to>/index.html --frames=60 --fps=15 --outdir=frames

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const argv = require('minimist')(process.argv.slice(2));
const url = argv.url || argv.u || 'index.html';
const frames = parseInt(argv.frames || argv.f || 60, 10);
const fps = parseInt(argv.fps || argv.r || 15, 10);
const outdir = argv.outdir || 'frames';

(async () => {
  if (!fs.existsSync(outdir)) fs.mkdirSync(outdir, { recursive: true });

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Open the page
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for the invitation element to be present
  await page.waitForSelector('.invitation', { timeout: 5000 });

  // Get bounding box of the invitation element
  const rect = await page.evaluate(() => {
    const el = document.querySelector('.invitation');
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
  });

  // Set viewport slightly larger to capture shadows
  await page.setViewport({ width: Math.max(rect.width + 40, 600), height: Math.max(rect.height + 40, 800) });

  // Recalculate element position after viewport change
  const rect2 = await page.evaluate(() => {
    const el = document.querySelector('.invitation');
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
  });

  console.log('Capture area:', rect2);

  // Give a small delay so animations initialize
  await new Promise(resolve => setTimeout(resolve, 800));

  const delay = Math.round(1000 / fps);
  for (let i = 0; i < frames; i++) {
    const filename = path.join(outdir, `frame${String(i).padStart(3, '0')}.png`);
    await page.screenshot({ path: filename, clip: { x: rect2.x, y: rect2.y, width: rect2.width, height: rect2.height } });
    process.stdout.write(`Captured ${filename}\r`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  await browser.close();
  console.log('\nDone. Run ffmpeg to convert frames to GIF (see README).');
})();
