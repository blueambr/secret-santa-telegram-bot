const alreadyConfirmedSending = (entity) => `
Thanks, but you've already confirmed sending.

Here is your confirmation text:
${entity.sendingConfirmationText}

If you want to replace it with something else, press the Replace the confirmation button and enter the new one, please.
`;

module.exports = alreadyConfirmedSending;
