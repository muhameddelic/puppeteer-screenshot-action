const core = require("@actions/core");
const puppeteer = require("puppeteer-core");
const io = require("@actions/io");
const os = require("os");
const fs = require("fs");

function chromePath() {
  switch (os.type()) {
    case 'Windows_NT':
      return 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
    default:
      return '/usr/bin/google-chrome';
  }
}

(async () => {
  await io.mkdirP(`${process.env.GITHUB_WORKSPACE}/screenshots/`);

  console.log("OS Info --");
  console.log(os.type());
  console.log(os.release());
  console.log(process.env.RUNNER_CONTEXT);
  console.log(os.arch());
  console.log("-- End OS Info")

  const runnerContext = JSON.parse(process.env.RUNNER_CONTEXT);
  console.log("runnerContext", runnerContext);

  console.log("toolcache", fs.readdirSync(runnerContext.tool_cache));

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
