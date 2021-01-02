module.exports = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: '😞 Report', callback_data: 'yesReportSanta' },
        { text: "🙄 I'll wait", callback_data: 'menu' },
      ],
    ],
  }),
};
