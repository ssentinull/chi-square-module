const fs = require("fs");
const neatCsv = require("neat-csv");
const sw = require("stopword");
const { lowerCase } = require("lower-case");
const { WordTokenizer, StemmerId } = require("natural");

const DATA_DIR = "./data/1000-sample-data.csv";

const readCsv = async fileDir => {
  const csvText = fs.readFileSync(fileDir, "utf-8");
  const formattedCsv = await neatCsv(csvText);

  return formattedCsv;
};

const generateTokens = abstract => {
  const tokenizer = new WordTokenizer();

  const abstractLowercase = lowerCase(abstract);
  const abstractTokens = tokenizer.tokenize(abstractLowercase);
  const tokensStopwordRemoved = sw.removeStopwords(abstractTokens, sw.id);
  const tokensStemmed = tokensStopwordRemoved.map(word => StemmerId.stem(word));

  return tokensStemmed;
};

(async () => {
  const csv = await readCsv(DATA_DIR);

  for (const row of csv) {
    const { ARTICLE_ABSTRACT } = row;
    const tokens = generateTokens(ARTICLE_ABSTRACT);

    row.TOKENS = tokens;
  }
})();
