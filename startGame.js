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

module.exports = (bot) => {
  bot.on('message', (user, userId, channelId, message, event) => {
    const game = gamesInSession[channelId];

    if (message === '!kingsStatus') {
      const reply = 'Running: ' + Boolean(game);

      bot.sendMessage({
        to: channelId,
        message: reply,
      });
    }

    if (/^!changeName/.test(message)) {
      if (game) {
        const nickname = message.slice(11);
        game.changeName(userId, nickname);
      }
    }

    console.log('games in session: ', Object.keys(gamesInSession));

    if (message === '!startKings' || message === '!startKings -tts') {
      shouldTTS = message.includes('-tts');

      if (game) {
        bot.sendMessage({
          to: channelId,
          message: 'Game already running in channel.',
        });
      } else {
        const newGame = new Game({
          bot,
          channelId,
          shouldTTS,
          gameMasterId: userId,
          // waterfallTime: 5,
        });

        gamesInSession[channelId] = newGame;
      }
    }

    if (/^!joinKings/.test(message)) {
      if (game) {
        const nickname = message.slice(11);
  
        game.join(userId, nickname);
      }
    }

    if (/^!kingsPlayers/.test(message)) {
      if (!game) {
        bot.sendMessage({
          to: channelId,
          message: 'No game started on channel. Use command `!startKings` to begin!',
          tts: shouldTTS,
        });
      }

      bot.sendMessage({
        to: channelId,
        message: game.getPlayers(),
        tts: shouldTTS,
      });
    }

    if (message === '!quitKings') {
      const status = game.quit(userId);

      if (status === 'End Game') {
        bot.sendMessage({
          to: channelId,
          message: 'Kings Cup game is now empty. Game has ended',
          tts: shouldTTS,
        });

        delete gamesInSession[channelId];
      }
    }

    if (message === '!restartKings' || message === '!restartKings -tts') {
      shouldTTS = message.includes('-tts');

      if (!game) {
        bot.sendMessage({
          to: channelId,
          message: 'Game not started, type `!startKings`',
          tts: shouldTTS,
        });
      } else {
        game.restart(userId, shouldTTS);
      }
    }

    if (message === '!pickCard') {
      if (!game) {
        bot.sendMessage({
          to: channelId,
          message: 'Game not started, type `!startKings`',
        });
      } else {
        game.pickCard(userId);
      }
    }

    if (message === '!stopKings' && game) {
      const shouldStop = game.stop(userId);

      if (shouldStop) delete gamesInSession[channelId];
    }
  });

  bot.on('message', (user, userId, channelId, message, event) => {
    if (message === '!help') {
      const reply = [
        'Meta commands:',
        'Type `!startKings` to start a game. Add `-tts` for text to speach.',
        'Type `!restartKings` to start a new game. Add `-tts` for text to speach.',
        'Type `!stopKings` to stop a game in session',
        'Type `!kingsCardList` to see cards and rules',
      ].join('\n');

      bot.sendMessage({
        to: channelId,
        message: reply,
      });
    }
  });

  bot.on('message', (user, userId, channelId, message, event) => {
    if (message === '!kingsCardList') {
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

    if (message === '!kingsCardList -verbose') {
      const cardsMap = require('./getCardsMap')({waterfallTime: 5, shouldTTS});

      const reply = Object.keys(cardsMap)
        .map((card) => {
          const {gameType} = cardsMap[card];

          return `\`${ card }:\` ${ gameType }`;
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
