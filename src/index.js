const groupBy = require("lodash.groupby");
const uniqBy = require("lodash.uniqby");
const { TfIdf } = require("natural");
const { readCsv, readJson, writeJson } = require("./utils/io.util");
const {
  generateTokens,
  removeDuplicateTokens
} = require("./utils/text-processing.util");
const {
  calculateChiSquareValues,
  createTokenList,
  mapAbstractFeatureVectors,
  sliceTopTermsFeatureVectors,
  sortChiSquareValueDescendingly
} = require("./utils/chi-square.util");

const DATASET_DIR = "./data/dataset-sample.csv";
const JSON_SAVE_DIR = "./data/csv.json";

(async () => {
  const processBegin = Date.now();

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
    const featureVectorsRow = groupedFeatureVectors[key];
    const sortedFeatureVectorsRow = sortChiSquareValueDescendingly(
      featureVectorsRow
    );
    const slicedFeatureVectorsRow = sliceTopTermsFeatureVectors(
      sortedFeatureVectorsRow,
      3
    );
    const mappedFeatureVectorsRow = mapAbstractFeatureVectors(
      slicedFeatureVectorsRow,
      csvDataJson
    );

    featureVectorsAbstractAppendedList.push(...mappedFeatureVectorsRow);
  }

  console.log("done appending abstract to feature vector");
  console.timeEnd("append-abstract-to-feature-vectors");
  console.log("\n");

  //////////////////////////////

  console.time("filtering-duplicate-feature-vectors");

  const uniqueFeatureVectorList = uniqBy(
    featureVectorsAbstractAppendedList,
    item => item.TOKEN
  );

  console.log("done filtering duplicate feature vectors");
  console.timeEnd("filtering-duplicate-feature-vectors");
  console.log("\n");

  //////////////////////////////

  console.time("calculate-tfidf-score");

  const featureVectorsTfidf = [];

  for (const csvDataJsonRow of csvDataJson) {
    const { JOURNAL_ID, TOKENS } = csvDataJsonRow;
    const tfidf = new TfIdf();

    tfidf.addDocument(TOKENS);

    let tfidfScores = [];

    for (const uniqueFeatureVectorRow of uniqueFeatureVectorList) {
      const { TOKEN } = uniqueFeatureVectorRow;

      tfidf.tfidfs(TOKEN, function(i, measure) {
        tfidfScores.push(measure);
      });
    }

    tfidfScores.push(JOURNAL_ID);
    featureVectorsTfidf.push(tfidfScores);

    tfidfScores = [];
  }

  console.log("done calculating tf-idf scores");
  console.timeEnd("calculate-tfidf-score");
  console.log("\n");

  //////////////////////////////

  const processEnd = Date.now();

  console.log(
    "total execution time :",
    (processEnd - processBegin) / 1000,
    "seconds"
  );
})();
