process.env["NTBA_FIX_319"] = 1;

const csv = require('csvtojson');
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const csvFilePath = '';
const port = process.env.PORT || 4000;
const telegram = new TelegramBot (process.env.TOKEN, { polling: true });

if (csvFilePath) {
  csv({
    noheader: true,
    output: 'csv'
  })
  .fromFile(csvFilePath)
  .then((csvRow) => {
    console.log(csvRow);
  });
};

telegram.on('text', (msg) => {
  telegram.sendMessage(msg.chat.id, `Hello! You've typed this message: ${msg.text}`);
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
