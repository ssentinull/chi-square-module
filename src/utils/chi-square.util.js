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
  createTokenList,
  groupTokenListWithJsonData,
  sortChiSquareValueDescendingly
};
