const sw = require("stopword");
const { lowerCase } = require("lower-case");
const { WordTokenizer, StemmerId } = require("natural");

const generateTokens = abstract => {
  const tokenizer = new WordTokenizer();

  const abstractLowercase = lowerCase(abstract);
  const abstractTokens = tokenizer.tokenize(abstractLowercase);
  const tokensStopwordRemoved = sw.removeStopwords(abstractTokens, sw.id);
  const tokensStemmed = tokensStopwordRemoved.map(word => StemmerId.stem(word));

  return tokensStemmed;
};

const removeDuplicateTokens = tokens => [...new Set(tokens)];

module.exports = { generateTokens, removeDuplicateTokens };
