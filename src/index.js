const fs = require("fs");
const neatCsv = require("neat-csv");
const sw = require("stopword");
const { lowerCase } = require("lower-case");
const { WordTokenizer, StemmerId } = require("natural");

const DATASET_DIR = "./data/1000-sample-data.csv";
const JSON_SAVE_DIR = "./data/csv.json";

const UTF_ENCODING_SCHEME = "utf-8";

const readCsv = async fileDir => {
  const csvText = fs.readFileSync(fileDir, UTF_ENCODING_SCHEME);
  const formattedCsv = await neatCsv(csvText);

  return formattedCsv;
};

const readJson = (file, encoding) => {
  const csvJsonContents = fs.readFileSync(file, encoding);
  const csvJson = JSON.parse(csvJsonContents);

  return csvJson;
};

const replacer = (key, value) => (key === "JOURNAL_ID" ? +value : value);

const writeJson = (file, variable, replacer, spaces) =>
  fs.writeFileSync(file, JSON.stringify(variable, replacer, spaces), err => {
    if (err) throw err;
    console.log("complete writing as .json file");
  });

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

  writeJson(JSON_SAVE_DIR, csvDataFile, replacer, 2);

  const csvDataJson = readJson(JSON_SAVE_DIR, UTF_ENCODING_SCHEME);
})();
