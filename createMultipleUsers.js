const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const rl = require('readline-sync');

/* ***********************************************
 *** URL to your Ombi installation is saved here.
 *** You need to store your admin login credentials here
 *** for the script to automatically login to the admin panel.
 **************************************************/

const ombiSettings = {
  ombiURL: 'http://localhost:5000/',
  admin: {
    username: 'admin',
    password: 'admin',
  },
};

/* ***********************************************
 *** You will find the SpreadsheetId,
 *** when you open the Spreadsheet in your Browser
 *** Here is the sheetName with the stored eMails required.
 *** The stored URL will convert your
 *** specific Sheet to JSON-Data.
 **************************************************/

const spreadsheetSettings = {
  ID: '1UdQSxlq-pYvuTnkhNbHlWi1-m12q5hdYLi6PkMb5gbA',
  sheetName: 'Anfragen',
};

let convertURL = `https://gsx2json.com/api?id=${spreadsheetSettings.ID}&sheet=${spreadsheetSettings.sheetName}`;

/* ***********************************************
 *** This function will lead you
 *** through the process of configuring
 *** your Ombi Settings.
 **************************************************/

function configureOmbi() {
  ombiSettings.ombiURL = rl.question('Type your Ombi URL: ');
  ombiSettings.admin.username = rl.question('Type your admin username: ');
  ombiSettings.admin.password = rl.question('Type your admin password: ');
}

/* ***********************************************
 *** This function will lead you
 *** through the process of configuring
 *** your Spreadsheet Settings.
 **************************************************/

function configureSpreadsheet() {
  spreadsheetSettings.ID = rl.question('Type the Spreadsheet ID: ');
  spreadsheetSettings.sheetName = rl.question('Type the specific Sheet Name: ');
  convertURL = `https://gsx2json.com/api?id=${spreadsheetSettings.ID}&sheet=${spreadsheetSettings.sheetName}`;
}

/************************************************
 *** adminLogin(page)
 *** This async function will
 *** automatically login to your admin panel.
 *** This function require your admin data.
 **************************************************/

async function adminLogin(page) {
  await page.waitForTimeout(100);
  await page.type('#username-field', ombiSettings.admin.username);
  await page.type('#password-field', ombiSettings.admin.password);
  await page.waitForTimeout(500);
  page.keyboard.press('Enter');
  await page.waitForTimeout(500);
}

/************************************************
 *** createUser(page, user)
 *** This async function will
 *** automatically create a User with the
 *** delivered user data. It will fill out
 *** the username, email and password fields.
 *** Then it will give the user automatically
 *** the role to request Movies.
 *** You could add additional form fields here.
 **************************************************/

async function createUser(page, user) {
  await page.goto(`${ombiSettings.ombiURL}usermanagement/user`);
  await page.waitForTimeout(300);
  await page.type('#username', user.username);
  await page.waitForTimeout(100);
  await page.type('#emailAddress', user.email);
  await page.waitForTimeout(100);
  await page.type('#password', user.password);
  await page.waitForTimeout(100);
  await page.type('#confirmPass', user.password);
  await page.waitForTimeout(100);
  await page.click('#roleRequestMovie');
  await page.waitForTimeout(100);
  await page.click('[data-test="createuserbtn"]');
  await page.waitForTimeout(100);
}

const fetchData = async function () {
  const res = await fetch(convertURL);
  const json = await res.json();
  return { json };
};

const getData = async function () {
  const data = await fetchData();
  return data.json.columns['E-Mail-Adresse'];
};

async function start() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(ombiSettings.ombiURL);
  const users = await getData();
  console.log(`We found ${users.length} Users in your spreadsheet.`);

  await adminLogin(page);

  for (let i = 0; i < users.length; i++) {
    const user = { username: users[i], password: 'test1234', email: users[i] };
    await createUser(page, user);
  }

  console.log(`${users.length} Users successfully created!`);
  console.log('You can exit the script now.');

  await browser.close();
}

console.log('\nWelcome to the Ombi User Creator Script!');
const selection = rl.question(`How do you want to continue?\n
1. Generate users
2. Set your Ombi settings
3. Set your spreadsheet settings \n \n`);

if (selection == 1) {
  console.log('Starting..');
  start();
} else if (selection == 2) {
  configureOmbi();
  console.log('Ombi Settings successfully configured!');
} else if (selection == 3) {
  configureSpreadsheet();
  console.log('Spreadsheet Settings successfully configured!');
}
