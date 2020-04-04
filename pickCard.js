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
    `Cards left: \`${cards.length}\``,
  ].join('\n\n');

  bot.sendMessage({
    to: channelId,
    message: reply,
    tts: shouldTTS,
  });

  if (gameScript) gameScript(bot, channelId);
};

