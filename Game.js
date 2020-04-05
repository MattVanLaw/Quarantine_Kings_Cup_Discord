/* eslint-disable require-jsdoc */
const _ = require('lodash');

const getCardsMap = require('./getCardsMap');
const pickCard = require('./pickCard');
const cards = require('./cards');

class Game {
  constructor({
    bot,
    channelId,
    shouldTTS = false,
    waterfallTime = 5,
  }) {
    this.masterCards = cards;
    this.channelId = channelId;
    this.shouldTTS = shouldTTS;
    this.bot = bot;
    this.localCards = _.cloneDeep(cards);

    this.cardsMap = getCardsMap({
      waterfallTime,
      shouldTTS,
    });

    bot.sendMessage({
      to: channelId,
      message: 'Kings Cup, Begin!',
      tts: shouldTTS,
    });
  }

  pickCard() {
    pickCard(
      this.bot,
      this.localCards,
      this.cardsMap,
      this.channelId,
      this.shouldTTS
    );
  }

  stop() {
    // ! don't rely on other file deleting instance
    this.localCards = this.cards;

    bot.sendMessage({
      to: this.channelId,
      message: 'Kings Cup Game Ended',
      tts: this.shouldTTS,
    });
  }

  restart(shouldTTS) {
    this.localCards = this.cards;
    this.shouldTTS = shouldTTS;

    bot.sendMessage({
      to: this.channelId,
      message: 'Started a new game of Kings Cup. ~!Huzzah!~',
      tts: shouldTTS,
    });
  }
}

module.exports = Game;
