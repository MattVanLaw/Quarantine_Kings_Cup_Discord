const _ = require('lodash');

const getCardsMap = require('./getCardsMap');
const pickCard = require('./pickCard');
const cards = require('./cards');

let localCardsCopy = _.cloneDeep(cards);

let dumbGlobalStartVariable = false;

let cardsMap = null;

module.exports = (bot) => {
  bot.on('message', (user, userId, channelId, message, event) => {
    if (message === '!startKings') {
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

      pickCard(bot, localCardsCopy, cardsMap, channelId);
    }
  });

  bot.on('message', (user, userId, channelId, message, event) => {
    if (message === '!restartKings') {
      if (!dumbGlobalStartVariable) {
        bot.sendMessage({
          to: channelId,
          message: 'Game not started, type `!startKings`',
        });

        return;
      }

      localCardsCopy = cards;

      bot.sendMessage({
        to: channelId,
        message: 'Started a new game of Kings Cup. ~!Huzzah!~',
      });
    }
  });
};
