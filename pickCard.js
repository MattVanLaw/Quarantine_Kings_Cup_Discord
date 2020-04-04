module.exports = (bot, cards, cardsMap, channelId, shouldTTS) => {
  const cardIndex = Math.floor(Math.random() * cards.length);

  const card = cards[cardIndex];

  cards.splice(cardIndex, 1);

  const {
    gameType,
    gameScript,
  } = cardsMap[card];

  const reply = [
    `You flipped over a \`${card}\`.`,
    `**${gameType}**`,
  ].join('\n\n');

  bot.sendMessage({
    to: channelId,
    message: reply,
    tts: shouldTTS,
  });

  setTimeout(() => {
    bot.sendMessage({
      to: channelId,
      message: `Cards left: \`${cards.length}\``,
    });
  }, 500);

  if (gameScript) gameScript(bot, channelId);
};

