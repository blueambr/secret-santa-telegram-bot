module.exports = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: '🔁 Replace the confirmation', callback_data: 'replaceSendingConfirmation' }],
      [{ text: '📖 Menu', callback_data: 'menu' }],
    ],
  }),
};
