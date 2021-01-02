module.exports = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: '📄 Check the task', callback_data: 'task' }],
      [{ text: '🎁 Confirm gift sending', callback_data: 'confirmSending' }],
      [{ text: '🚪 Exit', callback_data: 'exit' }],
    ],
  }),
};
