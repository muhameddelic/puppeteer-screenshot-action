const core = require("@actions/core");
const puppeteer = require("puppeteer-core");
const io = require("@actions/io");
const os = require("os");

function chromePath() {
  switch (os.type()) {
    case 'Windows_NT':
      return 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
    case 'Darwin':
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    default:
      return '/usr/bin/google-chrome';
  }
}

(async () => {
  await io.mkdirP(`${process.env.GITHUB_WORKSPACE}/screenshots/`);

  const url = core.getInput("url");

  const timestamp = new Date().getTime();
  const width = parseInt(core.getInput("width"));
  const height = parseInt(core.getInput("height"));

  const browser = await puppeteer.launch({
    executablePath: chromePath(),
    defaultViewport: { width, height }
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2"
  });
  await page.waitFor(3000);
  await page.screenshot({
    fullPage: true,
    path: `${process.env.GITHUB_WORKSPACE}/screenshots/screenshot-${timestamp}.png`
  });
  await browser.close();

  core.exportVariable("TIMESTAMP", timestamp);
})();
