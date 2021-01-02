module.exports = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: '🔑 Log in', callback_data: 'login' }]],
  }),
};
