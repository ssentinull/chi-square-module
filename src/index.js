const {
  generateTokens,
  removeDuplicateTokens
} = require("./utils/text-processing.util");
const { readCsv, readJson, writeJson } = require("./utils/io.util");

const DATASET_DIR = "./data/1000-sample-data.csv";
const JSON_SAVE_DIR = "./data/csv.json";

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
