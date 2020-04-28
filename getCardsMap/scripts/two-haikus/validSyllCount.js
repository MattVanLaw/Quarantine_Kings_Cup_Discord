const syllable = require('syllable');

module.exports = (sentence, count) => {
  const totalSyllablesInSentence = sentence
    .split(' ')
    .reduce((acc, word) => acc + syllable(word), 0);

  return totalSyllablesInSentence === count;
};
