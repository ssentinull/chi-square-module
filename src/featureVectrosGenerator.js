const groupBy = require("lodash.groupby");
const mapValues = require("lodash.mapvalues");
const uniqBy = require("lodash.uniqby");
const { readJson, writeJson } = require("./utils/io.util");
const {
  calculateChiSquareValues,
  createTokenList,
  sliceTopTermsFeatureVectors,
  sortChiSquareValueDescendingly,
} = require("./utils/chi-square.util");

const DATASET_JSON_SAVE_PATH = "./data/output/dataset-sample.json";
const FEATURE_VECTOR_50_TOKENS_SAVE_PATH =
  "./data/output/fv-tokens/fv-tokens-50.json";
const FEATURE_VECTOR_50_TOKENS_BY_JOURNAL_SAVE_PATH =
  "./data/output/fv-tokens-by-journal/fv-tokens-by-journal-50.json";
const FEATURE_VECTOR_100_TOKENS_SAVE_PATH =
  "./data/output/fv-tokens/fv-tokens-100.json";
const FEATURE_VECTOR_100_TOKENS_BY_JOURNAL_SAVE_PATH =
  "./data/output/fv-tokens-by-journal/fv-tokens-by-journal-100.json";
const FEATURE_VECTOR_200_TOKENS_SAVE_PATH =
  "./data/output/fv-tokens/fv-tokens-200.json";
const FEATURE_VECTOR_200_TOKENS_BY_JOURNAL_SAVE_PATH =
  "./data/output/fv-tokens-by-journal/fv-tokens-by-journal-200.json";

((async) => {
  const processBegin = Date.now();

  console.time("creating-feature-vectors");

  const jsonData = readJson(DATASET_JSON_SAVE_PATH);

  console.log("done reading json data");

  const tokenList = createTokenList(jsonData);

  console.log("done creating token list");

  const featureVectors = [];

  for (const tokenListRow of tokenList) {
    const chiSquareValues = calculateChiSquareValues(tokenListRow, jsonData);
    const featureVector = { ...tokenListRow, ...chiSquareValues };

    featureVectors.push(featureVector);
  }

  console.log("done creating feature vectors");
  console.timeEnd("creating-feature-vectors");
  console.log("\n");

  //////////////////////////////

  console.time("grouping-feature-vectors");

  const featureVectorsGroupedByJournalId = groupBy(
    featureVectors,
    (item) => item.JOURNAL_ID
  );

  console.log("done grouping feature vectors");
  console.timeEnd("grouping-feature-vectors");
  console.log("\n");

  //////////////////////////////

  console.time("pick-top-m-feature-vectors");

  const top50MFeatureVectors = [];
  const top100MFeatureVectors = [];
  const top200MFeatureVectors = [];

  for (const key in featureVectorsGroupedByJournalId) {
    const groupedFeatureVectors = featureVectorsGroupedByJournalId[key];
    const uniqueFeatureVectors = uniqBy(
      groupedFeatureVectors,
      (fv) => fv.TOKEN
    );
    const sortedFeatureVectors = sortChiSquareValueDescendingly(
      uniqueFeatureVectors
    );
    const top50FeatureVectors = sliceTopTermsFeatureVectors(
      sortedFeatureVectors,
      50
    );
    const top100FeatureVectors = sliceTopTermsFeatureVectors(
      sortedFeatureVectors,
      100
    );
    const top200FeatureVectors = sliceTopTermsFeatureVectors(
      sortedFeatureVectors,
      200
    );

    top50MFeatureVectors.push(...top50FeatureVectors);
    top100MFeatureVectors.push(...top100FeatureVectors);
    top200MFeatureVectors.push(...top200FeatureVectors);
  }

  console.log("done picking top M feature vectors");
  console.timeEnd("pick-top-m-feature-vectors");
  console.log("\n");

  //////////////////////////////

  console.time("filtering-duplicate-feature-vectors");

  const uniqueTop50MFeatureVectors = uniqBy(
    top50MFeatureVectors,
    (fv) => fv.TOKEN
  );
  const uniqueTop100MFeatureVectors = uniqBy(
    top100MFeatureVectors,
    (fv) => fv.TOKEN
  );
  const uniqueTop200MFeatureVectors = uniqBy(
    top200MFeatureVectors,
    (fv) => fv.TOKEN
  );

  console.log("done filtering duplicate feature vectors");
  console.timeEnd("filtering-duplicate-feature-vectors");
  console.log("\n");

  //////////////////////////////

  console.time("saving-feature-vector-tokens-as-json");

  const featureVectors50Tokens = uniqueTop50MFeatureVectors.map(
    (featureVector) => featureVector.TOKEN
  );

  const featureVectors100Tokens = uniqueTop100MFeatureVectors.map(
    (featureVector) => featureVector.TOKEN
  );

  const featureVectors200Tokens = uniqueTop200MFeatureVectors.map(
    (featureVector) => featureVector.TOKEN
  );

  const featureVectors50TokensByJournal = mapValues(
    groupBy(uniqueTop50MFeatureVectors, "JOURNAL_TITLE"),
    (fvGroupedByTitle) => fvGroupedByTitle.map((fv) => fv.TOKEN)
  );

  const featureVectors100TokensByJournal = mapValues(
    groupBy(uniqueTop100MFeatureVectors, "JOURNAL_TITLE"),
    (fvGroupedByTitle) => fvGroupedByTitle.map((fv) => fv.TOKEN)
  );

  const featureVectors200TokensByJournal = mapValues(
    groupBy(uniqueTop200MFeatureVectors, "JOURNAL_TITLE"),
    (fvGroupedByTitle) => fvGroupedByTitle.map((fv) => fv.TOKEN)
  );

  writeJson(FEATURE_VECTOR_50_TOKENS_SAVE_PATH, featureVectors50Tokens);
  writeJson(
    FEATURE_VECTOR_50_TOKENS_BY_JOURNAL_SAVE_PATH,
    featureVectors50TokensByJournal
  );

  writeJson(FEATURE_VECTOR_100_TOKENS_SAVE_PATH, featureVectors100Tokens);
  writeJson(
    FEATURE_VECTOR_100_TOKENS_BY_JOURNAL_SAVE_PATH,
    featureVectors100TokensByJournal
  );

  writeJson(FEATURE_VECTOR_200_TOKENS_SAVE_PATH, featureVectors200Tokens);
  writeJson(
    FEATURE_VECTOR_200_TOKENS_BY_JOURNAL_SAVE_PATH,
    featureVectors200TokensByJournal
  );

  console.log("done saving feature vector tokens as .json");
  console.timeEnd("saving-feature-vector-tokens-as-json");
  console.log("\n");
  const processEnd = Date.now();

  console.log(
    "total execution time :",
    (processEnd - processBegin) / 60000,
    "minutes"
  );
})();
