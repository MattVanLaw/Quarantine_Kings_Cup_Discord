const validSyllCount = require('./validSyllCount');
const HAIKU_PATTERN = [5, 7, 5];

// ! Starts mini-game sequence.

const validPlayerHaikusById = {};

module.exports = () => ({ userId, bot, channelId, players, message, user }) => {
  console.log('yo you haikus')
  const validHaikus = Object.keys(
    validPlayerHaikusById
  ).length

  while (validHaikus !== players.length) {
    console.log('haiku listening')
    const outstandingPlayers = players
      .filter(({ id }) => !validPlayerHaikusById[id]);

    const outstandingPlayersAtted = outstandingPlayers
      .map(({ username }) => `<@${username}>`)
      .join(', ');

    if (message === '!kingsReminder') {
      bot.sendMessage({
        to: channelId,
        message: `Please submit haikus: ${ outstandingPlayersAtted }`
      })
    }

    if (message.includes('\n')) {
      const lines = message.split('\n');

      if (lines.length !== 3) {
        bot.sendMessage({
          to: channelId,
          message: `<@${user}>, a haiku has only three lines~!`,
        });
      }

      const isValidHaiku = HAIKU_PATTERN
        .every((syllCount, lineNumber) => validSyllCount(
          lines[lineNumber],
          syllCount,
        ));

      // ! going to allow users to replace their haikus until game is done.
      if (isValidHaiku) {
        validPlayerHaikusById[userId] = {
          user,
          haiku: message,
        }
      } else {
        bot.sendMessage({
          to: channelId,
          message: `<@${user}>, a haiku follows a 5-7-5 pattern!`,
        });
      }
    } else if (message !== '!kingsReminder') {
      bot.sendMessage({
        to: channelId,
        message: `<@${user}>, please submit haikus in a single message`,
      });
    }
  }

  return { haikus: validPlayerHaikusById };
}
