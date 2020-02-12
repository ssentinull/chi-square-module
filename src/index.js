const {
  generateTokens,
  removeDuplicateTokens
} = require("./utils/text-processing.util");
const { readCsv, readJson, writeJson } = require("./utils/io.util");

const DATASET_DIR = "./data/1000-sample-data.csv";
const JSON_SAVE_DIR = "./data/csv.json";

const chiSquareFeatureSelection = jsonData => {
  const [featureVectors, tokenList] = [[], []];
  let [aValue, bValue, cValue, dValue] = [0, 0, 0, 0];

  for (const jsonDataRow of jsonData) {
    const { JOURNAL_ID, ARTICLE_ID, TOKENS_DUPLICATE_REMOVED } = jsonDataRow;

    for (const token of TOKENS_DUPLICATE_REMOVED) {
      const tokenListObj = { JOURNAL_ID, ARTICLE_ID, TOKEN: token };

      tokenList.push(tokenListObj);
    }
  }

  for (const tokenListRow of tokenList) {
    const {
      JOURNAL_ID: JOURNAL_ID_TOKEN_LIST,
      TOKEN: TOKEN_TOKEN_LIST
    } = tokenListRow;

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

    const xSquared =
      (aValue * dValue - bValue * cValue) ** 2 /
      ((aValue + bValue) * (cValue + dValue));

    [
      tokenListRow.A_VALUE,
      tokenListRow.B_VALUE,
      tokenListRow.C_VALUE,
      tokenListRow.D_VALUE,
      tokenListRow.X_SQUARED
    ] = [aValue, bValue, cValue, dValue, xSquared];
    [aValue, bValue, cValue, dValue] = [0, 0, 0, 0];
  }
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
  const featureVectors = chiSquareFeatureSelection(csvDataJson);
})();
