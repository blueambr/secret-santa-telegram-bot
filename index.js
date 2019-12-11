process.env["NTBA_FIX_319"] = 1;

const csv = require('csvtojson');
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const csvFilePath = './data.csv';
const interrupt = {};
const port = process.env.PORT || 4000;
const telegram = new TelegramBot (process.env.TOKEN, { polling: true });

const mainMessage = array =>
`
You need to give a present to ${array[3]}!
His main gaming stores are ${array[1]} and ${array[2]}!
`;

const startMessage =
`
Hello!
I want to help you to find a person you are paired with for Secret Santa event!

Text me your email address (the one you have signed for the event with) and I will give you all of the information I have!

You can edit your messages. I am watching for any changes.
To display this message once again you can write
/start or /help

Thank you!
Merry Christmas and Happy New Year! 🥳
`;

const errorMessage =
`
I accept only valid email addresses!

You can edit your previous message or type a new one!
Type /start or /text for help.
`;

const notFoundMessage =
`
Sorry, but I did not find your email in my database.
Could you recheck it, please?
You can edit your old message or type a new one!
`;

const noDBMessage =
`
Sorry, but I do not have a database, I could work with, right now 😔
`;

const validateEmail = address => {
  const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(String(address).toLowerCase());
};

const getMainResponses = function (data, msg) {
  if (!validateEmail(msg.text)) {
    telegram.sendMessage(msg.chat.id, errorMessage);
  } else {
    try {
      data.map( function (array, index) {
        if (array[0] === msg.text) {
          telegram.sendMessage(msg.chat.id, mainMessage(array));
          throw interrupt;
        } else if (index === data.length - 1) {
          telegram.sendMessage(msg.chat.id, notFoundMessage);
        }
      });
    } catch (err) {
      if (err !== interrupt) throw err;
    };
  };
};

telegram.onText(/\/start/, function (msg) {
  telegram.sendMessage(msg.chat.id, startMessage);
});

telegram.onText(/\/help/, function (msg) {
  telegram.sendMessage(msg.chat.id, startMessage);
});

if (csvFilePath) {
  csv({
    noheader: true,
    output: 'csv'
  })
  .fromFile(csvFilePath)
  .then( function (data) {
    telegram.on('text', function (msg) {
      if (msg.text !== '/start' && msg.text !== '/help') {
        getMainResponses(data, msg);
      }
    });

    telegram.on('edited_message_text', function (msg) {
      if (msg.text !== '/start' && msg.text !== '/help') {
        getMainResponses(data, msg);
      }
    });
  });
} else {
  telegram.on('text', function (msg) {
    if (msg.text !== '/start' && msg.text !== '/help') {
      telegram.sendMessage(msg.chat.id, noDBMessage);
    }
  });
};

app.listen(port, () => console.log(`Listening on port ${port}...`));
