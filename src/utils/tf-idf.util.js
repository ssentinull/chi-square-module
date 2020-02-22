const { TfIdf } = require("natural");

const calculateTfIdfScores = (featureVectorList, jsonData) => {
  const tfidfScores = [];

  for (const jsonDataRow of jsonData) {
    const { JOURNAL_ID, TOKENS } = jsonDataRow;
    const tfidf = new TfIdf();

    tfidf.addDocument(TOKENS);

    let tfidfScoresRow = [];

    for (const featureVectorListRow of featureVectorList) {
      const { TOKEN } = featureVectorListRow;

      tfidf.tfidfs(TOKEN, function(i, measure) {
        tfidfScoresRow.push(measure);
      });
    }

    tfidfScoresRow.push(JOURNAL_ID);
    tfidfScores.push(tfidfScoresRow);

    tfidfScoresRow = [];
  }

  return tfidfScores;
};

module.exports = { calculateTfIdfScores };
