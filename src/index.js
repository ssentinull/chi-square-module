const sw = require("stopword");
const { lowerCase } = require("lower-case");
const { WordTokenizer, StemmerId } = require("natural");
const { readCsv, readJson, writeJson } = require("./utils/io.util");

const DATASET_DIR = "./data/1000-sample-data.csv";
const JSON_SAVE_DIR = "./data/csv.json";

const generateTokens = abstract => {
  const tokenizer = new WordTokenizer();

  const abstractLowercase = lowerCase(abstract);
  const abstractTokens = tokenizer.tokenize(abstractLowercase);
  const tokensStopwordRemoved = sw.removeStopwords(abstractTokens, sw.id);
  const tokensStemmed = tokensStopwordRemoved.map(word => StemmerId.stem(word));

  return tokensStemmed;
};

const removeDuplicateTokens = tokens => [...new Set(tokens)];

(async () => {
  const csvDataFile = await readCsv(DATASET_DIR);

  for (const row of csvDataFile) {
    const { ARTICLE_ABSTRACT } = row;
    const tokens = generateTokens(ARTICLE_ABSTRACT);
    const tokensDuplicateRemoved = removeDuplicateTokens(tokens);

    row.TOKENS = tokens;
    row.TOKENS_DUPLICATE_REMOVED = tokensDuplicateRemoved;
  }

  writeJson(JSON_SAVE_DIR, csvDataFile);

  const csvDataJson = readJson(JSON_SAVE_DIR);
})();
