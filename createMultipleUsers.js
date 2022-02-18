const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const rl = require('readline-sync');
const fs = require('fs');

/* ***********************************************
 *** URL to your Ombi installation is saved here.
 *** You need to store your admin login credentials here
 *** for the script to automatically login to the admin panel.
 **************************************************/

const ombiSettings = JSON.parse(fs.readFileSync('./data/ombi.json', 'utf8'));

/* ***********************************************
 *** You will find the SpreadsheetId,
 *** when you open the Spreadsheet in your Browser
 *** Here is the sheetName with the stored eMails required.
 *** The stored URL will convert your
 *** specific Sheet to JSON-Data.
 **************************************************/

const spreadsheetSettings = JSON.parse(
  fs.readFileSync('./data/spreadsheet.json', 'utf8')
);

let convertURL = `https://gsx2json.com/api?id=${spreadsheetSettings.ID}&sheet=${spreadsheetSettings.sheetName}`;

function writeJSONFile(object, datapath) {
  const jsonString = JSON.stringify(object);
  fs.writeFileSync(datapath, jsonString);
}

/* ***********************************************
 *** This function will lead you
 *** through the process of configuring
 *** your Ombi Settings.
 **************************************************/

function configureOmbi() {
  const ombiURL = rl.question('Type your Ombi URL: ');
  const username = rl.question('Type your admin username: ');
  const password = rl.question('Type your admin password: ');

  const ombiData = {
    ombiURL: ombiURL,
    admin: {
      username: username,
      password: password,
    },
  };

  writeJSONFile(ombiData, './data/ombi.json');
}

/* ***********************************************
 *** This function will lead you
 *** through the process of configuring
 *** your Spreadsheet Settings.
 **************************************************/

function configureSpreadsheet() {
  const spreadID = rl.question('Type the Spreadsheet ID: ');
  const sheetName = rl.question('Type the specific Sheet Name: ');

  const ssData = {
    ID: spreadID,
    sheetName: sheetName,
  };

  writeJSONFile(ssData, './data/spreadsheet.json');

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

function menu() {
  console.log('\nWelcome to the Ombi User Creator Script!');
  const selection = rl.question(`How do you want to continue?\n
  1. Generate users
  2. Set your Ombi settings
  3. Set your Spreadsheet settings \n \n`);

  if (selection == 1) {
    console.log('Generating..');
    createMultipleUsers();
    menu();
  } else if (selection == 2) {
    configureOmbi();
    console.log('Ombi Settings successfully configured!');
    menu();
  } else if (selection == 3) {
    configureSpreadsheet();
    console.log('Spreadsheet Settings successfully configured!');
    menu();
  }
}

async function createMultipleUsers() {
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

  await browser.close();
}

menu();
