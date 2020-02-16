const calculateChiSquareValues = (tokenListRow, jsonData) => {
  let [aValue, bValue, cValue, dValue] = [0, 0, 0, 0];

  // compute the A, B, C, D, and X_SQUARED values
  // go over every single tokens that's been spread out
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

  const chiSquareValues = {
    A_VALUE: aValue,
    B_VALUE: bValue,
    C_VALUE: cValue,
    D_VALUE: dValue,
    CHI_SQUARED: chiSquare
  };

  return chiSquareValues;
};

// spread the tokens of the articles into a single layer array of objects
const createTokenList = jsonData => {
  const tokenList = [];

  for (const jsonDataRow of jsonData) {
    const { JOURNAL_ID, ARTICLE_ID, TOKENS_DUPLICATE_REMOVED } = jsonDataRow;

    for (const token of TOKENS_DUPLICATE_REMOVED) {
      const tokenListObj = { JOURNAL_ID, ARTICLE_ID, TOKEN: token };

      tokenList.push(tokenListObj);
    }
  }

  return tokenList;
};

const groupTokenListWithJsonData = (tokenList, jsonData) => {
  for (const jsonDataRow of jsonData) {
    const { JOURNAL_ID, ARTICLE_ID } = jsonDataRow;

    const articleTokens = tokenList
      .filter(
        item => item.JOURNAL_ID === JOURNAL_ID && item.ARTICLE_ID === ARTICLE_ID
      )
      .map(item => {
        delete item.JOURNAL_ID;
        delete item.ARTICLE_ID;
        return item;
      });

    jsonDataRow.TOKENS_SCORES = articleTokens;
  }
};

const sortChiSquareValueDescendingly = list =>
  list.sort((a, b) => b.CHI_SQUARED - a.CHI_SQUARED);

module.exports = {
  calculateChiSquareValues,
  createTokenList,
  groupTokenListWithJsonData,
  sortChiSquareValueDescendingly
};