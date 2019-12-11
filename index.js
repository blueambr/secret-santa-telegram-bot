process.env["NTBA_FIX_319"] = 1;

const csv = require('csvtojson');
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const csvFilePath = './data.csv';
const interrupt = {};
const port = process.env.PORT || 4000;
const telegram = new TelegramBot (process.env.TOKEN, { polling: true });

const validateEmail = address => {
  const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(String(address).toLowerCase());
};

const mainMessage = array =>
`
Hello!
You need to give a present to ${array[3]}!
His main gaming stores are ${array[1]} and ${array[2]}!
`;

const errorMessage =
`
Hello! This bot accepts only valid email addresses! You can edit your previous message or type a new one!
`;

const notFoundMessage =
`
Sorry, but I did not find your email in my database. Could you recheck it, please? You can edit your old message or type a new one!
`;

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

if (csvFilePath) {
  csv({
    noheader: true,
    output: 'csv'
  })
  .fromFile(csvFilePath)
  .then( function (data) {
    telegram.on('text', function (msg) {
      getMainResponses(data, msg);
    });

    telegram.on('edited_message_text', function (msg) {
      getMainResponses(data, msg);
    });
  });
};

app.listen(port, () => console.log(`Listening on port ${port}...`));
