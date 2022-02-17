const puppeteer = require('puppeteer');
const ombiURL = 'http://localhost:5000/';

const admin = {
  username: 'admin',
  password: 'admin',
};

const user = {
  username: 'tester45',
  email: 'test@test.com',
  streamingCountry: 'DE',
  password: 'test123',
};

async function start() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(ombiURL);

  // Admin Login
  await page.waitForTimeout(500);
  await page.type('#username-field', admin.username);
  await page.type('#password-field', admin.password);
  await page.waitForTimeout(500);
  page.keyboard.press('Enter');
  await page.waitForTimeout(1000);

  // Go to User Creation
  await page.goto(`${ombiURL}usermanagement/user`);
  await page.waitForTimeout(2000);
  await page.type('#username', user.username);
  await page.type('#password', user.password);
  await page.type('#confirmPass', user.password);
  await page.click('#roleRequestMovie');
  await page.click('[data-test="createuserbtn"]');

  await browser.close();
}

start();
