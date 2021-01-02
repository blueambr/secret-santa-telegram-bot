module.exports = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: '✔️ Yes', callback_data: 'yesConfirmGetting' },
        { text: '❌ No', callback_data: 'menu' },
      ],
    ],
  }),
};
