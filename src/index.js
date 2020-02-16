const groupBy = require("lodash.groupby");
const { readCsv, readJson, writeJson } = require("./utils/io.util");
const {
  generateTokens,
  removeDuplicateTokens
} = require("./utils/text-processing.util");
const {
  calculateChiSquareValues,
  createTokenList,
  sortChiSquareValueDescendingly
} = require("./utils/chi-square.util");

const DATASET_DIR = "./data/dataset-sample.csv";
const JSON_SAVE_DIR = "./data/csv.json";

(async () => {
  const csvDataFile = await readCsv(DATASET_DIR);

  for (const row of csvDataFile) {
    const { ARTICLE_ABSTRACT } = row;
    const tokens = generateTokens(ARTICLE_ABSTRACT);
    const tokensDuplicateRemoved = removeDuplicateTokens(tokens);

    [row.TOKENS, row.TOKENS_DUPLICATE_REMOVED] = [
      tokens,
      tokensDuplicateRemoved
    ];
  }

  writeJson(JSON_SAVE_DIR, csvDataFile);

  const csvDataJson = readJson(JSON_SAVE_DIR);
  const tokenList = createTokenList(csvDataJson);
  const featureVectors = [];

  for (const tokenListRow of tokenList) {
    const chiSquareValues = calculateChiSquareValues(tokenListRow, csvDataJson);
    const featureVector = { ...tokenListRow, ...chiSquareValues };

    featureVectors.push(featureVector);
  }

  const groupedFeatureVectors = groupBy(
    featureVectors,
    item => item.JOURNAL_ID
  );

  for (const key in groupedFeatureVectors) {
    const groupedFeatureVectorsRow = groupedFeatureVectors[key];

    sortChiSquareValueDescendingly(groupedFeatureVectorsRow);
  }
})();
