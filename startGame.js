// ! MAJOR TODO
// TODO: Abstract constants into a class, so each channel can have its own instance
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
    console.log('games in session: ', Object.keys(gamesInSession));

    if (message === '!startKings' || message === '!startKings -tts') {
      shouldTTS = message.includes('-tts');

      if (game) {
        bot.sendMessage({
          to: channelId,
          message: 'Game already started.',
        });
      } else {
        gamesInSession[channelId] = new Game({
          bot,
          channelId,
          shouldTTS,
          // waterfallTime: 5,
        });
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
        game.restart(shouldTTS);
      }
    }

    if (message === '!pickCard') {
      if (!game) {
        bot.sendMessage({
          to: channelId,
          message: 'Game not started, type `!startKings`',
        });
      } else {
        game.pickCard();
      }
    }

    if (message === '!stopKings' && game) {
      game.stop();

      delete gamesInSession[channelId];
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
