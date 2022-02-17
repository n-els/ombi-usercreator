const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

// Required Ombi-Data
const ombiURL = 'http://localhost:5000/';
const admin = {
  username: 'admin',
  password: 'admin',
};

// Required Google Spreadsheet Data
const spreadsheetID = '1UdQSxlq-pYvuTnkhNbHlWi1-m12q5hdYLi6PkMb5gbA';
const sheetName = 'Anfragen';
const URL = `https://gsx2json.com/api?id=${spreadsheetID}&sheet=${sheetName}`;

// const users = [
//   {
//     username: 'tester1',
//     email: 'test@test.com',
//     streamingCountry: 'DE',
//     password: 'test123',
//   },
//   {
//     username: 'tester2',
//     email: 'test@test.com',
//     streamingCountry: 'DE',
//     password: 'test123',
//   },
//   {
//     username: 'tester3',
//     email: 'test@test.com',
//     streamingCountry: 'DE',
//     password: 'test123',
//   },
//   {
//     username: 'tester4',
//     email: 'test@test.com',
//     streamingCountry: 'DE',
//     password: 'test123',
//   },
//   {
//     username: 'tester5',
//     email: 'test@test.com',
//     streamingCountry: 'DE',
//     password: 'test123',
//   },
// ];

async function adminLogin(page) {
  await page.waitForTimeout(500);
  await page.type('#username-field', admin.username);
  await page.type('#password-field', admin.password);
  await page.waitForTimeout(500);
  page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
}

async function createUser(page, user) {
  await page.goto(`${ombiURL}usermanagement/user`);
  await page.waitForTimeout(2000);
  await page.type('#username', user.username);
  await page.waitForTimeout(2000);
  await page.type('#password', user.password);
  await page.waitForTimeout(2000);
  await page.type('#confirmPass', user.password);
  await page.waitForTimeout(2000);
  await page.click('#roleRequestMovie');
  await page.waitForTimeout(2000);
  await page.click('[data-test="createuserbtn"]');
  await page.waitForTimeout(2000);
}

const fetchData = async function () {
  const res = await fetch(URL);
  const json = await res.json();
  return { json };
};

const getData = async function () {
  const data = await fetchData();
  return data.json.columns['E-Mail-Adresse'];
};

async function start(users) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(ombiURL);

  await adminLogin(page);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await createUser(page, user);
  }

  console.log(`${users.length} Users successfully created!`);

  await browser.close();
}

start(users);
