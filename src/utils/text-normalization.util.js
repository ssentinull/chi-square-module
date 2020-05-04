const sw = require("stopword");
const { lowerCase } = require("lower-case");
const { WordTokenizer, StemmerId } = require("natural");

const generateTokens = (abstract) => {
  const tokenizer = new WordTokenizer();

  const abstractLowercase = lowerCase(abstract);
  const abstractDigitsRemoved = abstractLowercase.replace(/\d+/g, "");
  const abstractTokens = tokenizer.tokenize(abstractDigitsRemoved);
  const tokensStopwordRemoved = sw.removeStopwords(abstractTokens, sw.id);
  const tokensStemmed = tokensStopwordRemoved
    .filter((word) => word.length >= 3)
    .map((word) => StemmerId.stem(word));

  return tokensStemmed;
};

const removeDuplicateTokens = (tokens) => [...new Set(tokens)];

module.exports = { generateTokens, removeDuplicateTokens };
