module.exports = (bot, cards, cardsMap, channelId) => {
  const cardIndex = Math.floor(Math.random() * cards.length);

  const card = cards[cardIndex];

  cards.splice(cardIndex, 1);

  const {
    gameType,
    gameScript,
  } = cardsMap[card];

  bot.sendMessage({
    to: channelId,
    message: [
      `You flipped over a \`${ card }\`.`,
      `**${gameType}**`,
      `Cards left: \`${ cards.length }\``,
    ].join('\n\n'),
  });

  if (gameScript) gameScript(bot, channelId);
};

