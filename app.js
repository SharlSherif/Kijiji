const puppeteer = require("puppeteer-extra");
const { Intercept, clearFieldAndType } = require("./helpers");
const fakeUa = require("fake-useragent");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

let email = "archesdev@gmail.com";
let password = "YicF$f5Qmaa$7gj";
let address = "LA, Cairo";
let name = "Holy Crap!";

(async () => {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: false,
    ignoreDefaultArgs: ["--disable-extensions"],
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1920x1080",
    ],
  });

  global.browser = browser;

  await SignIn();
  await ChangeSettings();
})();
async function SendAnEmail() {}
async function ChangeSettings() {
  const page = await global.browser.newPage();
  await page.goto("https://www.kijiji.ca/t-settings.html");
  // name : #ProfileName
  // address : #Address
  //  document.querySelector("[for=sendFeatureNotificationEmail]")
  // pwd: #confirmPassword
  // document.querySelector("#ConfirmPasswordSection .actions button")

  await clearFieldAndType(page, "#ProfileName", name);
  await clearFieldAndType(page, "#Address", address);

  await page.click("[for=sendFeatureNotificationEmail]");

  await clearFieldAndType(page, "#confirmPassword", password);

  // an artificial delay so that kijij doesnt suspect much of us.
  await page.waitFor(1200);

  await page.click("#ConfirmPasswordSection .actions button");

  let path = `./screenshots/${Date.now()}`;

  // take and save a screenshot
  await page.screenshot({
    path,
    fullPage: true,
    quality: 70,
  });
}

async function SignIn() {
  const page = await global.browser.newPage();
  await page.goto("https://www.kijiji.ca/t-login.html", {
    timeout: 0,
    waitUntil: "networkidle0",
  });

  await clearFieldAndType(page, "#emailOrNickname", email);
  await clearFieldAndType(page, "#password", password);

  await page.waitFor(1200);
  await page.$eval(
    "#mainPageContent > div > div > div > div > form > button",
    (btn) => btn.click()
  );
  await page.waitForNavigation();
  await page.close();
}
