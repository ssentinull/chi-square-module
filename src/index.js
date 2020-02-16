const {
  generateTokens,
  removeDuplicateTokens
} = require("./utils/text-processing.util");
const { readCsv, readJson, writeJson } = require("./utils/io.util");
const {
  createTokenList,
  groupTokenListWithJsonData,
  sortChiSquareValueDescendingly
} = require("./utils/chi-square.util");

const DATASET_DIR = "./data/dataset-sample.csv";
const JSON_SAVE_DIR = "./data/csv.json";

const chiSquareFeatureSelection = (tokenList, jsonData) => {
  let [aValue, bValue, cValue, dValue] = [0, 0, 0, 0];

  // compute the A, B, C, D, and X_SQUARED values
  // go over every single tokens that's been spread out
  for (const tokenListRow of tokenList) {
    const {
      JOURNAL_ID: JOURNAL_ID_TOKEN_LIST,
      TOKEN: TOKEN_TOKEN_LIST
    } = tokenListRow;

    // check for the existance of the tokens in each articles
    for (const jsonDataRow of jsonData) {
      const {
        JOURNAL_ID: JOURNAL_ID_JSON_DATA,
        TOKENS_DUPLICATE_REMOVED: TOKEN_JSON_DATA
      } = jsonDataRow;

      if (
        JOURNAL_ID_TOKEN_LIST === JOURNAL_ID_JSON_DATA &&
        TOKEN_JSON_DATA.includes(TOKEN_TOKEN_LIST)
      ) {
        aValue += 1;
      }

      if (
        JOURNAL_ID_TOKEN_LIST !== JOURNAL_ID_JSON_DATA &&
        TOKEN_JSON_DATA.includes(TOKEN_TOKEN_LIST)
      ) {
        bValue += 1;
      }

      if (
        JOURNAL_ID_TOKEN_LIST === JOURNAL_ID_JSON_DATA &&
        !TOKEN_JSON_DATA.includes(TOKEN_TOKEN_LIST)
      ) {
        cValue += 1;
      }

      if (
        JOURNAL_ID_TOKEN_LIST !== JOURNAL_ID_JSON_DATA &&
        !TOKEN_JSON_DATA.includes(TOKEN_TOKEN_LIST)
      ) {
        dValue += 1;
      }
    }

    const chiSquare =
      (aValue * dValue - bValue * cValue) ** 2 /
      ((aValue + bValue) * (cValue + dValue));

    [
      tokenListRow.A_VALUE,
      tokenListRow.B_VALUE,
      tokenListRow.C_VALUE,
      tokenListRow.D_VALUE,
      tokenListRow.CHI_SQUARED
    ] = [aValue, bValue, cValue, dValue, chiSquare];
    [aValue, bValue, cValue, dValue] = [0, 0, 0, 0];
  }

  return jsonData;
};

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
  const featureVectors = chiSquareFeatureSelection(tokenList, csvDataJson);

  groupTokenListWithJsonData(tokenList, featureVectors);

  for (const row of featureVectors) {
    const { TOKENS_SCORES } = row;

    sortChiSquareValueDescendingly(TOKENS_SCORES);
  }
})();
