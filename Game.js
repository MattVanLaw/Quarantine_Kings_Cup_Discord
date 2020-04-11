// TODO: Grab actual username.
// TODO: Move logic into User class

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
    gameMasterId,
    username,
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

    this.players = [{
      id: gameMasterId,
      username,
      nickname: username,
      gm: true,
    }];

    bot.sendMessage({
      to: channelId,
      message: 'Kings Cup, Begin! Type `!draw` to start.',
      tts: shouldTTS,
    });
  }

  getStatus() {
    return 'Cards Left: ' + `\`${this.localCards.length}\`\n`
      + `Active Players: ` + this.getPlayers();
  }

  pickCard(playerId, username) {
    const shouldJoin = this.shouldJoinGame(playerId, username);

    if (shouldJoin) return;

    const isYourTurn = this.players[0].id === playerId;

    if (isYourTurn) {
      pickCard(
        this.bot,
        this.localCards,
        this.cardsMap,
        this.channelId,
        this.shouldTTS,
        username
      );
      const playerThatPicked = this.players.shift();

      this.players.push(playerThatPicked);
    } else {
      const {nickname} = this.findPlayer(playerId);

      this.bot.sendMessage({
        to: this.channelId,
        message: `It's not your turn, ${ nickname }. `
          + `<@${ this.players[0].id }>, it's your turn in Quarant-King's.`,
        tts: this.shouldTTS,
      });
    }
  }

  stop(playerId) {
    const player = this.findPlayer(playerId);

    if (!player || !player.gm) return false;

    // ! don't rely on other file deleting instance
    this.localCards = this.cards;

    this.bot.sendMessage({
      to: this.channelId,
      message: 'Kings Cup Game Ended',
      tts: this.shouldTTS,
    });

    return true;
  }

  restart(playerId, shouldTTS) {
    const player = this.findPlayer(playerId);

    if (!player.gm) {
      this.bot.sendMessage({
        to: this.channelId,
        message: 'Only the Game Master can restart the game',
        tts: this.shouldTTS,
      });

      return;
    }

    this.localCards = this.cards;
    this.shouldTTS = shouldTTS;

    this.bot.sendMessage({
      to: this.channelId,
      message: 'Started a new game of Kings Cup. ~!Huzzah!~',
      tts: this.shouldTTS,
    });
  }

  changeName(playerId, nickname) {
    const shouldJoin = this.shouldJoinGame(playerId);

    if (shouldJoin) return;

    const player = this.findPlayer(playerId);

    player.nickname = nickname;
  }

  join(playerId, username, nickname) {
    nickname = nickname || username;

    const isPlaying = this.findPlayer(playerId);

    if (isPlaying) {
      this.bot.sendMessage({
        to: this.channelId,
        message: 'Already joined the game!',
        tts: this.shouldTTS,
      });

      return;
    }

    if (nickname === 'Game Master') {
      this.bot.sendMessage({
        to: this.channelId,
        message: 'Only the game\'s creator can named Game Master!',
        tts: this.shouldTTS,
      });

      return;
    }

    if (nickname && !this.isNewNickname(nickname)) {
      this.bot.sendMessage({
        to: this.channelId,
        message: 'This nickname is already taken.',
        tts: this.shouldTTS,
      });

      return;
    }

    this.players.push({
      id: playerId,
      username,
      nickname,
    });

    this.bot.sendMessage({
      to: this.channelId,
      message: nickname + ' joined the quarant-king\'s game.',
      tts: this.shouldTTS,
    });
  }

  quit(playerId) {
    if (this.players.length === 1) {
      this.bot.sendMessage({
        to: this.channelId,
        message: 'Kings Cup game is now empty. Game has ended',
        tts: this.shouldTTS,
      });

      return 'End Game';
    }

    const playerIdx = this.players
      .findIndex(({id}) => id === playerId);

    const player = this.players[playerIdx];

    const wasGM = player.gm;

    if (playerIdx) {
      this.players.splice(playerIdx, 1);

      this.bot.sendMessage({
        to: this.channelId,
        message: `${player.username} has escaped quarant-king's`,
        tts: this.shouldTTS,
      });
    }

    if (wasGM) {
      this.players[0].gm = true;

      this.bot.sendMessage({
        to: this.channelId,
        message: this.players[0].username + ' is now the Game Master',
        tts: this.shouldTTS,
      });
    }
  }

  shouldJoinGame(playerId, username) {
    const isPlaying = this.findPlayer(playerId);

    if (!isPlaying) {
      this.bot.sendMessage({
        to: this.channelId,
        message: username + ', you are not currently in this game. '
         + 'Join the party with `!kingsJoin`. ',
        tts: this.shouldTTS,
      });
    }

    return !isPlaying;
  }

  getPlayers() {
    return this.players
      .map(({ nickname, gm }, idx) => {
        return String(idx + 1)
          + ': '
          + nickname
          + (gm ? ' - Game Master' : '');
      }).join(', ');
  }

  findPlayer(playerId) {
    return this.players
      .find(({id}) => id === playerId);
  }

  isNewNickname(newNickname) {
    return !this.players
      .find(({nickname}) => nickname.toLowerCase() === newNickname.toLowerCase());
  }
}

module.exports = Game;
