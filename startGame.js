const _ = require('lodash');

const getCardsMap = require('./getCardsMap');
const pickCard = require('./pickCard');
const cards = require('./cards');

let localCardsCopy = _.cloneDeep(cards);

let dumbGlobalStartVariable = false;

let cardsMap = null;

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

let shouldTTS = false;

module.exports = (bot) => {
  bot.on('message', (user, userId, channelId, message, event) => {
    if (message === '!startKings' || message === '!startKings -tts') {
      shouldTTS = message.includes('-tts');

      if (dumbGlobalStartVariable) {
        bot.sendMessage({
          to: channelId,
          message: 'Game already started.',
        });

        return;
      }

      dumbGlobalStartVariable = true;

      cardsMap = getCardsMap({
        waterFallTime: 5,
      });

      bot.sendMessage({
        to: channelId,
        message: 'Kings Cup, Begin!',
      });
    }
  });

  bot.on('message', (user, userId, channelId, message, event) => {
    if (message === '!pickCard') {
      if (!dumbGlobalStartVariable) {
        bot.sendMessage({
          to: channelId,
          message: 'Game not started, type `!startKings`',
        });

        return;
      }

      pickCard(
        bot,
        localCardsCopy,
        cardsMap,
        channelId,
        shouldTTS
      );
    }
  });

  bot.on('message', (user, userId, channelId, message, event) => {
    if (message === '!help') {
      const reply = [
        'Meta commands:',
        'Type `!startKings` to start a game',
        'Type `!restartKings` to start a new game',
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
      const cardsMap = require('./getCardsMap')({ waterFallTime: 5 })

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

  bot.on('message', (user, userId, channelId, message, event) => {
    if (message === '!restartKings' || message === '!restartKings -tts') {
      shouldTTS = message.includes('-tts');

      if (!dumbGlobalStartVariable) {
        bot.sendMessage({
          to: channelId,
          message: 'Game not started, type `!startKings`',
          tts: shouldTTS,
        });

        return;
      }

      localCardsCopy = cards;

      bot.sendMessage({
        to: channelId,
        message: 'Started a new game of Kings Cup. ~!Huzzah!~',
        tts: shouldTTS,
      });
    }
  });
};
