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
    message: `\nYou flipped over a '${ card }'.`
      + `\nStarting ${gameType}.`
      + `\nCards left: ${ cards.length }.`,
  });

  gameScript(bot, channelId);
};

