const calculateChiSquareValues = (tokenList) => {
  let totalJournalAbstracts = 0;
  const tokenListLength = tokenList.length - 1;
  const appendedArticle = {};
  const abstractsPerJournal = {};
  const invertedIndex = {};

  for (let i = 0; i <= tokenListLength; i++) {
    const tokenListRow = tokenList[i];
    const { JOURNAL_ID, ARTICLE_ID, TOKEN } = tokenListRow;

    if (!appendedArticle[ARTICLE_ID]) {
      appendedArticle[ARTICLE_ID] = 1;

      totalJournalAbstracts++;

      if (!abstractsPerJournal[JOURNAL_ID]) abstractsPerJournal[JOURNAL_ID] = 0;

      abstractsPerJournal[JOURNAL_ID] += 1;
    }

    if (!invertedIndex[TOKEN]) invertedIndex[TOKEN] = [];

    const tempObj = { JOURNAL_ID, ARTICLE_ID };

    invertedIndex[TOKEN].push(tempObj);
  }

  console.log(
    "\namount of inverted index keys: ",
    Object.keys(invertedIndex).length
  );

  const chiSquareValues = [];

  for (const token in invertedIndex) {
    const tokenArray = invertedIndex[token];
    const tokenArrayLength = tokenArray.length;

    const journalIdsObj = tokenArray.reduce((obj, val) => {
      obj[val.JOURNAL_ID] = (obj[val.JOURNAL_ID] || 0) + 1;
      return obj;
    }, {});

    for (const journalId in journalIdsObj) {
      const journalIdAbstracts = abstractsPerJournal[journalId];
      const aValue = journalIdsObj[journalId];
      const bValue = tokenArrayLength - aValue;
      const cValue = journalIdAbstracts - aValue;
      const dValue = totalJournalAbstracts - journalIdAbstracts - bValue;
      const chiSquare =
        (aValue * dValue - bValue * cValue) ** 2 /
        ((aValue + bValue) * (cValue + dValue));

      const tempObj = {
        JOURNAL_ID: journalId,
        TOKEN: token,
        A_VALUE: aValue,
        B_VALUE: bValue,
        C_VALUE: cValue,
        D_VALUE: dValue,
        CHI_SQUARE: chiSquare,
      };

      chiSquareValues.push(tempObj);
    }
  }

  return chiSquareValues;
};

// spread the tokens of the articles into a single layer array of objects
const createTokenList = (jsonData) => {
  let totalTokenAmount = 0;
  const tokenList = [];
  const regexContainDigits = /\d/g;

  for (const jsonDataRow of jsonData) {
    const {
      JOURNAL_ID,
      JOURNAL_TITLE,
      ARTICLE_ID,
      TOKENS,
      TOKENS_DUPLICATE_REMOVED,
    } = jsonDataRow;

    totalTokenAmount += TOKENS.length;

    for (const token of TOKENS_DUPLICATE_REMOVED) {
      const tokenLength = token.length;
      const isTokenContainsDigit = regexContainDigits.test(token);

      if (isTokenContainsDigit || tokenLength <= 2) continue;

      const tokenListObj = {
        JOURNAL_ID,
        JOURNAL_TITLE,
        ARTICLE_ID,
        TOKEN: token,
      };

      tokenList.push(tokenListObj);
    }
  }

  console.log("\namount of tokens: ", totalTokenAmount);

  return tokenList;
};

const sliceTopTermsFeatureVectors = (list, mTerms) => list.slice(0, mTerms);

const sortChiSquareValueDescendingly = (list) =>
  list.sort((a, b) => b.CHI_SQUARE - a.CHI_SQUARE);

module.exports = {
  calculateChiSquareValues,
  createTokenList,
  sliceTopTermsFeatureVectors,
  sortChiSquareValueDescendingly,
};
