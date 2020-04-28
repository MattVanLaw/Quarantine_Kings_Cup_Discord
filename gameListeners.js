// ! MAJOR TODOs
// TODO 1: lock if(game) logic into abstracted file,
// * and have shadow versions of listeners, if game is NOT on.

const Game = require('./Game');

const cardOrder = {
  'A': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  '10': 9,
  'J': 10,
  'Q': 11,
  'K': 12,
};

const gamesInSession = {};

module.exports = (bot, logger) => {
  bot.on('message', (user, userId, channelId, message, event) => {
    const game = gamesInSession[channelId];

    const isInMinigame = game && game.getMinigame();

    logger.info(`Active Games: [${Object.keys(gamesInSession).join(', ')}]`);

    if (message === '!kingsStatus') {
      const metaReply = `Running: \`${Boolean(game)}\`\n`;

      const gameReply = game
        ? game.getStatus()
        : '';

      bot.sendMessage({
        to: channelId,
        message: metaReply + gameReply,
      });
    }

    if (!game) {
      if (message === '!kingsStart' || message === '!kingsStart -tts') {
        const newGame = new Game({
          bot,
          channelId,
          shouldTTS: message.includes('-tts'),
          gameMasterId: userId,
          username: user,
          // waterfallTime: 5,
        });

        gamesInSession[channelId] = newGame;
      }
    }

    if (game) {
      if (/^!kingsName/.test(message)) {
        const nickname = message.slice(11) || user;
        game.changeName(userId, nickname);

        bot.sendMessage({
          to: channelId,
          message: `${ user } you are now playing as ${ nickname }`,
        });
      }

      if (/^!kingsJoin/.test(message)) {
        if (game) {
          const nickname = message.slice(11);

          game.join(userId, user, nickname);
        }
      }

      if (/^!kingsPlayers/.test(message)) {
        bot.sendMessage({
          to: channelId,
          message: game.getPlayers(),
        });
      }

      if (message === '!kingsQuit') {
        const status = game.quit(userId);

        if (status === 'End Game') delete gamesInSession[channelId];
      }

      if (message === '!kingsRestart' || message === '!kingsRestart -tts') {
        const shouldTTS = message.includes('-tts');
        game.restart(userId, shouldTTS);
      }
      if (isInMinigame) {
        game.runMinigame(user, userId, message);
      }

      if (message === '!draw') game.pickCard(userId, user);

      if (message === '!kingsStop') {
        const shouldStop = game.stop(userId);

        if (shouldStop) delete gamesInSession[channelId];
      }

      if (message === '!kingsHelp') {
        const reply = [
          'Meta commands:',
          'Type `!kingsStart` to start a game. Add `-tts` for text to speach.',
          'Type `!kingsJoin` to join a game. You can add a nickname, too!',
          'Type `!draw` to pick a card, when it\'s you\'re turn',
          'Type `!kingsRestart` to start a new game. Add `-tts` for text to speach.',
          'Type `!kingsStop` to stop a game in session',
          'Type `!kingsCardList` to see cards and rules',
          'Type `!kingsPlayers` to see everyone that\'s joined a game.',
        ].join('\n');

        bot.sendMessage({
          to: channelId,
          message: reply,
        });
      }
    }

    if (message === '!kingsCards') {
      const reply = [
        'Rules vary for better remote play (use command with `-verbose` flag for more info):',
        '`A: Waterfall`',
        '`3: Me`',
        '`4: Lore`',
        '`5: Guys`',
        '`6: Chicks`',
        '`7: Thief`',
        '`8: Mate`',
        '`9: Fine`',
        '`10: Category`',
        '`J: Jinx`',
        '`Q: Comrade Questions`',
        '`K: King\'s Decree`',
      ].join('\n');

      bot.sendMessage({
        to: channelId,
        message: reply,
      });
    }

    if (message === '!kingsCards -verbose') {
      const cardsMap = require('./getCardsMap')({ waterfallTime: 5, shouldTTS });

      const reply = Object.keys(cardsMap)
        .map((card) => {
          const { gameType } = cardsMap[card];

          return `\`${card}:\` ${gameType}`;
        })
        .sort(
          (
            [backtick1, a, zero],
            [backtick2, b, zero2]) => (
              (zero !== ':' ? cardOrder[a + zero] : cardOrder[a])
              -
              (zero2 !== ':' ? cardOrder[a + zero2] : cardOrder[b]))
        )
        .join('\n');

      bot.sendMessage({
        to: channelId,
        message: 'Verbose descriptions...\n' + reply,
      });
    }
  });
};
