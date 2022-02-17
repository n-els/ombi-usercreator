const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

/* ***********************************************
 *** URL to your Ombi installation is saved here.
 *** You need to store your admin login credentials here
 *** for the script to automatically login to the admin panel.
 **************************************************/

const ombiURL = 'http://localhost:5000/';
const admin = {
  username: 'admin',
  password: 'admin',
};

/* ***********************************************
 *** You will find the SpreadsheetId,
 *** when you open the Spreadsheet in your Browser
 *** Here is the sheetName with the stored adressesrequired.
 *** The name of the field (usually content of field C1)
 *** needs to be stored in the "fieldName" constant
 *** The stored URL will convert your
 *** specific Sheet to JSON-Data.
 **************************************************/

const spreadsheetID = '1UdQSxlq-pYvuTnkhNbHlWi1-m12q5hdYLi6PkMb5gbA';
const sheetName = 'Anfragen';
const fieldName = 'E-Mail-Adresse';
const URL = `https://gsx2json.com/api?id=${spreadsheetID}&sheet=${sheetName}`;

/************************************************
 *** adminLogin(page)
 *** This async function will automatically login
 *** to your admin panel.This function requires
 *** your previously stored admin data.
 **************************************************/

async function adminLogin(page) {
  await page.waitForTimeout(500);
  await page.type('#username-field', admin.username);
  await page.type('#password-field', admin.password);
  await page.waitForTimeout(500);
  page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
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
  await page.goto(`${ombiURL}usermanagement/user`);
  await page.waitForTimeout(1000);
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
  const res = await fetch(URL);
  const json = await res.json();
  return { json };
};

const getData = async function () {
  const data = await fetchData();
  return data.json.columns[fieldName];
};

async function start() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(ombiURL);
  const users = await getData();

  await adminLogin(page);

  for (let i = 0; i < users.length; i++) {
    const user = { username: users[i], password: 'test1234', email: users[i] };
    await createUser(page, user);
  }

  console.log(`${users.length} Users successfully created!`);

  await browser.close();
}

start();
