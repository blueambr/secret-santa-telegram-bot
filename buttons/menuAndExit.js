module.exports = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: '📖 Menu', callback_data: 'menu' },
        { text: '🚪 Exit', callback_data: 'exit' },
      ],
    ],
  }),
};
