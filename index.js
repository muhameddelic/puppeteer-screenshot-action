const core = require("@actions/core");
const puppeteer = require("puppeteer-core");
const io = require("@actions/io");
const imgur = require("imgur");

(async () => {
  const screenshotDir = `${process.env.GITHUB_WORKSPACE}/screenshots/`;
  await io.mkdirP(screenshotDir);

  const url = core.getInput("url");
  const width = parseInt(core.getInput("width"));
  const height = parseInt(core.getInput("height"));

  const timestamp = new Date().getTime();
  const screenshotFile = `${screenshotDir}/screenshot-${timestamp}.png`;

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    defaultViewport: { width, height }
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2"
  });
  await page.waitFor(3000);
  await page.screenshot({
    fullPage: true,
    path: screenshotFile
  });
  await browser.close();

  const result = await imgur.uploadFile(screenshotFile);
  console.log(result);

  core.exportVariable("TIMESTAMP", timestamp);
})();
