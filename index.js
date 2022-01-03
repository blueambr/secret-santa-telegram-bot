process.env['NTBA_FIX_319'] = 1;

const csv = require('csvtojson');
const express = require('express');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const csvFilePath = './data.csv';
const port = process.env.PORT || 4000;

const telegram = new TelegramBot(process.env.TOKEN, { polling: true });

// Connect mongoDB
mongoose
  .connect(process.env.DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Now connected to MongoDB!'))
  .catch((err) => console.error('Something went wrong', err));

// Import models
const Entity = require('./models/entity');
const BotUserId = require('./models/botUserId');

// Import helpers
const validateEmail = require('./helpers/validateEmail');
const trimStringTo200 = require('./helpers/trimStringTo200');

// Import messages
const startMessage = require('./messages/start');
const rulesMessage = require('./messages/rules');
const errorMessage = require('./messages/error');
const emailMessage = require('./messages/email');
const emailErrorMessage = require('./messages/emailError');
const emailFoundMessage = require('./messages/emailFound');
const emailNotFoundMessage = require('./messages/emailNotFound');
const alreadyLoggedInMessage = require('./messages/alreadyLoggedIn');
const loggedOutMessage = require('./messages/loggedOut');
const callbackQueryRepeatedActionMessage = require('./messages/callbackQueryRepeatedAction');
const callbackQueryNotAuthorizedMessage = require('./messages/callbackQueryNotAuthorized');
const notAuthorizedOrRepeatedMessage = require('./messages/notAuthorizedOrRepeated');
const menuMessage = require('./messages/menu');
const taskMessage = require('./messages/task');
const alreadyConfirmedSendingMessage = require('./messages/alreadyConfirmedSending');
const confirmSendingMessage = require('./messages/confirmSending');
const confirmedSendingMessage = require('./messages/confirmedSending');
const confirmGettingMessage = require('./messages/confirmGetting');
const confirmedGettingMessage = require('./messages/confirmedGetting');
const reportSantaMessage = require('./messages/reportSanta');
const reportedSantaMessage = require('./messages/reportedSanta');

// Import buttons
const loginButton = require('./buttons/login');
const toMenuButton = require('./buttons/toMenu');
const menuAndExitButtons = require('./buttons/menuAndExit');
const menuButtons = require('./buttons/menu');
const menuConfirmedGettingButtons = require('./buttons/menuConfirmedGetting');
const menuReportedSantaButtons = require('./buttons/menuReportedSanta');
const replaceSendingConfirmationAndMenuButtons = require('./buttons/replaceSendingConfirmationAndMenu');
const confirmGettingButtons = require('./buttons/confirmGetting');
const reportSantaButtons = require('./buttons/reportSanta');

// Validators
const checkMessageForEmail = async (msg) => {
  const trimmedMsg = msg.text.toString().replace('/login', '').trim();

  if (validateEmail(trimmedMsg)) {
    const entity = await Entity.findOne({ from: trimmedMsg });

    if (entity) {
      const isAlreadyLoggedIn = await Entity.findOne({ clientId: msg.chat.id });

      if (!isAlreadyLoggedIn) {
        await entity.updateOne({ clientId: msg.chat.id, isLoggedIn: true });

        telegram.sendMessage(msg.chat.id, emailFoundMessage, menuAndExitButtons);
      } else {
        telegram.sendMessage(msg.chat.id, alreadyLoggedInMessage);
      }
    } else {
      telegram.sendMessage(msg.chat.id, emailNotFoundMessage);
    }
  } else {
    telegram.sendMessage(msg.chat.id, emailErrorMessage);
  }
};

const checkMessageForSendingConfirmation = async (msg) => {
  const trimmedMsg = msg.text.toString().replace('/sent', '').trim();

  const entity = await Entity.findOne({ clientId: msg.chat.id });

  if (entity && entity.isLoggedIn) {
    await entity.updateOne({ didConfirmSending: true, sendingConfirmationText: trimmedMsg });

    telegram.sendMessage(msg.chat.id, confirmedSendingMessage(trimmedMsg), replaceSendingConfirmationAndMenuButtons);
  } else {
    telegram.sendMessage(msg.chat.id, callbackQueryNotAuthorizedMessage);
  }
};

// Actions
const startAction = async (clientId) => {
  const entity = await Entity.findOne({ clientId: clientId });

  if (entity) {
    telegram.sendMessage(clientId, startMessage, menuAndExitButtons);
  } else {
    telegram.sendMessage(clientId, startMessage, loginButton);
  }
};

const rulesAction = async (clientId) => {
  const entity = await Entity.findOne({ clientId: clientId });

  if (entity) {
    telegram.sendMessage(clientId, rulesMessage, menuAndExitButtons);
  } else {
    telegram.sendMessage(clientId, rulesMessage, loginButton);
  }
};

const loginAction = async (clientId, callbackQuery = null) => {
  const entity = await Entity.findOne({ clientId: clientId });

  if (!entity) {
    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: trimStringTo200(emailMessage) });
    }

    telegram.sendMessage(clientId, emailMessage);
    return;
  }

  if (callbackQuery) {
    telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryRepeatedActionMessage });
  } else {
    telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
  }
};

const exitAction = async (clientId, callbackQuery = null) => {
  const entity = await Entity.findOne({ clientId: clientId });

  if (entity) {
    await entity.updateOne({ clientId: null, isLoggedIn: false }).then(() => {
      if (callbackQuery) {
        telegram.answerCallbackQuery(callbackQuery.id, { text: loggedOutMessage });
      } else {
        telegram.sendMessage(clientId, loggedOutMessage);
      }
    });

    return;
  }

  if (callbackQuery) {
    telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryRepeatedActionMessage });
  } else {
    telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
  }
};

const menuAction = async (clientId, callbackQuery = null) => {
  const entity = await Entity.findOne({ clientId: clientId });

  if (entity) {
    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: trimStringTo200(menuMessage) });
    }

    if (!entity.didConfirmGetting) {
      if (!entity.didReportSanta) {
        telegram.sendMessage(clientId, menuMessage, menuButtons);
      } else {
        telegram.sendMessage(clientId, menuMessage, menuReportedSantaButtons);
      }
    } else {
      telegram.sendMessage(clientId, menuMessage, menuConfirmedGettingButtons);
    }
  } else {
    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryNotAuthorizedMessage });
    } else {
      telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
    }
  }
};

const taskAction = async (clientId, callbackQuery = null) => {
  const entity = await Entity.findOne({ clientId: clientId });

  if (entity) {
    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: trimStringTo200(taskMessage(entity)) });
    }

    telegram.sendMessage(clientId, taskMessage(entity), toMenuButton);
  } else {
    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryNotAuthorizedMessage });
    } else {
      telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
    }
  }
};

const confirmSendingAction = async (clientId, callbackQuery = null) => {
  const entity = await Entity.findOne({ clientId: clientId });

  if (entity) {
    if (!entity.didConfirmSending) {
      if (callbackQuery) {
        telegram.answerCallbackQuery(callbackQuery.id, { text: trimStringTo200(confirmSendingMessage) });
      }

      telegram.sendMessage(clientId, confirmSendingMessage);
    } else {
      if (callbackQuery) {
        telegram.answerCallbackQuery(callbackQuery.id, {
          text: trimStringTo200(alreadyConfirmedSendingMessage(entity)),
        });
      }

      telegram.sendMessage(clientId, alreadyConfirmedSendingMessage(entity), replaceSendingConfirmationAndMenuButtons);
    }
  } else {
    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryNotAuthorizedMessage });
    } else {
      telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
    }
  }
};

const replaceSendingConfirmationAction = async (clientId, callbackQuery = null) => {
  const entity = await Entity.findOne({ clientId: clientId });

  if (entity) {
    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: trimStringTo200(confirmSendingMessage) });
    }

    telegram.sendMessage(clientId, confirmSendingMessage);
  } else {
    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryNotAuthorizedMessage });
    } else {
      telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
    }
  }
};

const confirmGettingAction = async (clientId, callbackQuery = null) => {
  const entity = await Entity.findOne({ clientId: clientId });

  if (entity) {
    if (!entity.didConfirmGetting) {
      if (callbackQuery) {
        telegram.answerCallbackQuery(callbackQuery.id, { text: trimStringTo200(confirmGettingMessage) });
      }

      telegram.sendMessage(clientId, confirmGettingMessage, confirmGettingButtons);
      return;
    }

    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryRepeatedActionMessage });
    } else {
      telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
    }
  } else {
    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryNotAuthorizedMessage });
    } else {
      telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
    }
  }
};

const yesConfirmGettingAction = async (clientId, callbackQuery = null) => {
  const entity = await Entity.findOne({ clientId: clientId });
  const santaEntity = await Entity.findOne({ to: entity.from });

  if (entity) {
    if (!santaEntity.didConfirmSendingByRecipient) {
      if (callbackQuery) {
        telegram.answerCallbackQuery(callbackQuery.id, { text: trimStringTo200(confirmedGettingMessage) });
      }

      await entity.updateOne({ didConfirmGetting: true });
      await santaEntity.updateOne({ didConfirmSendingByRecipient: true }).then(() => {
        telegram.sendMessage(clientId, confirmedGettingMessage, toMenuButton);
      });

      return;
    }

    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryRepeatedActionMessage });
    } else {
      telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
    }
  } else {
    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryNotAuthorizedMessage });
    } else {
      telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
    }
  }
};

const reportSantaAction = async (clientId, callbackQuery = null) => {
  const entity = await Entity.findOne({ clientId: clientId });

  if (entity) {
    if (!entity.didReportSanta) {
      if (callbackQuery) {
        telegram.answerCallbackQuery(callbackQuery.id, { text: trimStringTo200(reportSantaMessage) });
      }

      telegram.sendMessage(clientId, reportSantaMessage, reportSantaButtons);
      return;
    }

    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryRepeatedActionMessage });
    } else {
      telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
    }
  } else {
    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryNotAuthorizedMessage });
    } else {
      telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
    }
  }
};

const yesReportSantaAction = async (clientId, callbackQuery = null) => {
  const entity = await Entity.findOne({ clientId: clientId });
  const santaEntity = await Entity.findOne({ to: entity.from });

  if (entity) {
    if (!entity.didReportSanta) {
      if (callbackQuery) {
        telegram.answerCallbackQuery(callbackQuery.id, { text: trimStringTo200(reportedSantaMessage) });
      }

      await entity.updateOne({ didReportSanta: true });
      await santaEntity.updateOne({ isReportedByRecipient: true }).then(() => {
        telegram.sendMessage(clientId, reportedSantaMessage, toMenuButton);
      });

      return;
    }

    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryRepeatedActionMessage });
    } else {
      telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
    }
  } else {
    if (callbackQuery) {
      telegram.answerCallbackQuery(callbackQuery.id, { text: callbackQueryNotAuthorizedMessage });
    } else {
      telegram.sendMessage(clientId, notAuthorizedOrRepeatedMessage);
    }
  }
};

const saveBotUserIdAction = async (clientId) => {
  const doesExist = await BotUserId.findOne({ chat: clientId });

  if (!doesExist) {
    const botUserId = new BotUserId({
      chat: clientId,
    });
    botUserId.save();
  }
};

const sendMessageToAllBotUserIdsAction = async (message) => {
  const all = await BotUserId.find({});

  if (all) {
    all.map((user) => {
      telegram.sendMessage(user.chat, message);
    });
  }
};

// Inline keyboard buttons callbacks
telegram.on('callback_query', (callbackQuery) => {
  const clientId = callbackQuery.message.chat.id;

  if (callbackQuery) {
    if (callbackQuery.data === 'login') {
      loginAction(clientId, callbackQuery);
    }

    if (callbackQuery.data === 'exit') {
      exitAction(clientId, callbackQuery);
    }

    if (callbackQuery.data === 'menu') {
      menuAction(clientId, callbackQuery);
    }

    if (callbackQuery.data === 'task') {
      taskAction(clientId, callbackQuery);
    }

    if (callbackQuery.data === 'confirmSending') {
      confirmSendingAction(clientId, callbackQuery);
    }

    if (callbackQuery.data === 'replaceSendingConfirmation') {
      replaceSendingConfirmationAction(clientId, callbackQuery);
    }

    if (callbackQuery.data === 'confirmGetting') {
      confirmGettingAction(clientId, callbackQuery);
    }

    if (callbackQuery.data === 'yesConfirmGetting') {
      yesConfirmGettingAction(clientId, callbackQuery);
    }

    if (callbackQuery.data === 'reportSanta') {
      reportSantaAction(clientId, callbackQuery);
    }

    if (callbackQuery.data === 'yesReportSanta') {
      yesReportSantaAction(clientId, callbackQuery);
    }
  } else {
    telegram.sendMessage(clientId, errorMessage);
  }
});

// Text handlers
telegram.onText(/\/login/, (msg) => {
  checkMessageForEmail(msg);
});

telegram.onText(/\/sent/, (msg) => {
  checkMessageForSendingConfirmation(msg);
});

// Text commands
telegram.onText(/\/start/, (msg) => {
  startAction(msg.chat.id);

  // Save a bot user in the dedicated collection for push messages
  saveBotUserIdAction(msg.chat.id);
});

telegram.onText(/\/help/, (msg) => {
  startAction(msg.chat.id);
});

telegram.onText(/\/rules/, (msg) => {
  rulesAction(msg.chat.id);
});

telegram.onText(/\/exit/, (msg) => {
  exitAction(msg.chat.id);
});

telegram.onText(/\/menu/, (msg) => {
  menuAction(msg.chat.id);
});

telegram.onText(/\/quest/, (msg) => {
  taskAction(msg.chat.id);
});

telegram.onText(/\/got/, (msg) => {
  confirmGettingAction(msg.chat.id);
});

telegram.onText(/\/blame/, (msg) => {
  reportSantaAction(msg.chat.id);
});

// Send a specific message to all botUserIds
sendMessageToAllBotUserIdsAction(`
This is a push message.
It will be sent on bot deploy to all saved users in saveBotUserIdAction.
`);

// Export .csv data to a mongoDB collection
/*
  Warning!
  Only do this once: before applying any changes to the database.
  After that — delete the .csv file.
  Otherwise you will be rewriting your database every time you run the server.
*/
if (csvFilePath) {
  csv({
    noheader: true,
    output: 'csv',
  })
    .fromFile(csvFilePath)
    .then((data) => {
      data.map((instance) => {
        const entity = new Entity({
          from: instance[0],
          to: instance[3],
          platforms: `${instance[1]}, ${instance[2]}`,
        });
        entity.save();
      });
    });
}

// Start a server
app.listen(port, () => console.log(`Listening on port ${port}...`));
