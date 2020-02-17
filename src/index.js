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
  console.time("read-csv");

  const csvDataFile = await readCsv(DATASET_DIR);

  console.log("done reading .csv");
  console.timeEnd("read-csv");
  console.log("\n");

  //////////////////////////////

  console.time("preprocessing-text");

  for (const row of csvDataFile) {
    const { ARTICLE_ABSTRACT } = row;
    const tokens = generateTokens(ARTICLE_ABSTRACT);
    const tokensDuplicateRemoved = removeDuplicateTokens(tokens);

    [row.TOKENS, row.TOKENS_DUPLICATE_REMOVED] = [
      tokens,
      tokensDuplicateRemoved
    ];
  }

  console.log("done preprocessing .csv text");
  console.timeEnd("preprocessing-text");
  console.log("\n");

  //////////////////////////////

  console.time("saving-json");

  writeJson(JSON_SAVE_DIR, csvDataFile);

  console.log("done saving .json");
  console.timeEnd("saving-json");
  console.log("\n");

  //////////////////////////////

  console.time("creating-token-list");

  const csvDataJson = readJson(JSON_SAVE_DIR);
  const tokenList = createTokenList(csvDataJson);
  const featureVectors = [];

  for (const tokenListRow of tokenList) {
    const chiSquareValues = calculateChiSquareValues(tokenListRow, csvDataJson);
    const featureVector = { ...tokenListRow, ...chiSquareValues };

    featureVectors.push(featureVector);
  }

  console.log("done creating token list");
  console.timeEnd("creating-token-list");
  console.log("\n");

  //////////////////////////////

  console.time("grouping-feature-vectors");

  const groupedFeatureVectors = groupBy(
    featureVectors,
    item => item.JOURNAL_ID
  );

  console.log("done grouping feature vectors");
  console.timeEnd("grouping-feature-vectors");
  console.log("\n");

  //////////////////////////////

  console.time("append-abstract-to-feature-vectors");

  const featureVectorsAbstractAppendedList = [];

  for (const key in groupedFeatureVectors) {
    const groupedFeatureVectorsRow = groupedFeatureVectors[key];
    const sortedGroupedFeatureVectorsRow = sortChiSquareValueDescendingly(
      groupedFeatureVectorsRow
    );

    const slicedSortedGroupedFeatureVectorsRow = sortedGroupedFeatureVectorsRow
      .slice(0, 3)
      .map(item => {
        const { JOURNAL_ID, ARTICLE_ID } = item;
        const { ARTICLE_ABSTRACT } = csvDataJson.find(
          item =>
            item.JOURNAL_ID === JOURNAL_ID && item.ARTICLE_ID === ARTICLE_ID
        );

        item.ARTICLE_ABSTRACT = ARTICLE_ABSTRACT;
        return item;
      });

    featureVectorsAbstractAppendedList.push(
      ...slicedSortedGroupedFeatureVectorsRow
    );
  }

  console.log("done appending abstract to feature vector");
  console.timeEnd("append-abstract-to-feature-vectors");
})();
