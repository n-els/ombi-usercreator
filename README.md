
# User Creator Script
## _for Ombi Request Tool_

UCS is a free, fast and lightweight script which automatically
generates user accounts for users without a Plex Account.

You need the email addresses of the users to be created
stored in a Google Spreadsheet.
This process can also be automated using Google Forms. But this is optional.

A small video tutorial will follow soon!

## Installation

UCS requires [Node.js](https://nodejs.org/) to run.

First download the zip or clone the repo:

```
git clone https://github.com/n-els/ombi-usercreator.git
```

Install the dependencies with:

```sh
cd ombi-usercreator
npm install
```

## First Usage

Start UCS:

```sh
npm run start
```
![1](https://user-images.githubusercontent.com/78740982/154693138-04e81c24-8bb5-4af0-9e6f-fd4e8bc56249.jpg)

Press `2` to start setting up the JSON File for Ombi Settings:

![2](https://user-images.githubusercontent.com/78740982/154693238-56626990-40d1-4a3a-90af-957263ddd6ad.jpg)

Now you need to type or paste the URL of your Ombi Installation
and press enter. (Usually it should be everything before `/discover`)

![3](https://user-images.githubusercontent.com/78740982/154693396-7f89a7af-f100-4fe8-a8d9-2af94190a4a0.jpg)

In the next steps you  will type in the
username and password of the admin account.

Then you will be back in the main menu.

Now you should set up your Spreadsheet settings.
You must make sure your Google Sheet is set to be shared to 'anyone with the link'.

Press `3`to start the process.

In the first step you need to type/paste the ID of your Spreadsheet.
(You will find the ID in the URL of your Spreadsheet.)

![4](https://user-images.githubusercontent.com/78740982/154693538-41fab322-517c-4cab-9086-f5bd2aa7fe4b.jpg)

Next step will ask you for the specific sheet name,
where your data is saved.

![5](https://user-images.githubusercontent.com/78740982/154693555-5b6bae19-2ed3-4b31-8cbb-9d294b24c288.jpg)

(in this case it would be "*Anfragen*")

The last step will ask you for columnName:

![6](https://user-images.githubusercontent.com/78740982/154693566-53a81eb0-16c2-4619-900c-1fc1e98bc24e.jpg)

(in this case it would be "*E-Mail-Adresse*")

Now the setup should be done!

## Usage

You can finally let the script automatically start generating the users.
Just press `1` in the main menu.
