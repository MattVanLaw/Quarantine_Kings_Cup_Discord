const drinkForNSeconds = require('./scripts/drinkForNSeconds');
const twoHaikus = require('./scripts/two-haikus');

module.exports = ({
  waterfallTime,
  shouldTTS,
}) => ({
  'A': {
    gameType: `Get ready to chug down a WATERFALL for \`${ waterfallTime }\` seconds!`,
    gameScript: drinkForNSeconds.apply(null,  [waterfallTime, shouldTTS]),
  },
  '2': {
    gameType: 'Haiku. Best 5-7-5 haiku gets to pick another card.',
    gameScript: twoHaikus,
  },
  '3': {
    gameType: 'Three is me. You take two drinks.',
    gameScript: null,
  },
  '4': {
    gameType: 'Four is lore: each person writes a line of lore to a new story! The player who phones it in drinks!',
    gameScript: null,
  },
  '5': {
    gameType: 'Five is guys. Drink it up dudes!',
    gameScript: null,
  },
  '6': {
    gameType: 'Six is chicks. Drink it up ladies!',
    gameScript: null,
  },
  '7': {
    gameType: 'Move the thief: ask another player if they have an interesting resource nearby. If they do: they drink. If they don\'t: you drink',
    gameScript: null,
  },
  '8': {
    gameType: 'Mate: Find a drinking buddy. They drink anytime you do.',
    gameScript: null,
  },
  '9': {
    gameType: 'Fine. Everyone other than you "pays the fine", meaning they drink.',
    gameScript: null,
  },
  '10': {
    gameType: 'Category. You pick a category. First to blank on something in that category drinks.',
    gameScript: null,
  },
  'J': {
    gameType: 'Jinx. You\'re now the Jinx, so whenever you jinx someone they drink!',
    gameScript: null,
  },
  'Q': {
    gameType: 'Comrade Questions: Ask questions; those who answer will drink.',
    gameScript: null,
  },
  'K': {
    gameType: 'As King, declare a rule for the game.',
    gameScript: null,
  },
});
