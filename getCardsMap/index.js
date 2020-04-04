const drinkForNSeconds = require('./scripts/drinkForNSeconds');

module.exports = ({
  waterFallTime,
}) => ({
  'A': {
    gameType: 'Waterfall',
    gameScript: drinkForNSeconds(waterFallTime),
  },
  '2': {
    gameType: null,
    gameScript: () => null,
  },
  '3': {
    gameType: null,
    gameScript: () => null,
  },
  '4': {
    gameType: null,
    gameScript: () => null,
  },
  '5': {
    gameType: null,
    gameScript: () => null,
  },
  '6': {
    gameType: null,
    gameScript: () => null,
  },
  '7': {
    gameType: null,
    gameScript: () => null,
  },
  '8': {
    gameType: null,
    gameScript: () => null,
  },
  '9': {
    gameType: null,
    gameScript: () => null,
  },
  '10': {
    gameType: null,
    gameScript: () => null,
  },
  'J': {
    gameType: null,
    gameScript: () => null,
  },
  'Q': {
    gameType: null,
    gameScript: () => null,
  },
  'K': {
    gameType: null,
    gameScript: () => null,
  },
});
