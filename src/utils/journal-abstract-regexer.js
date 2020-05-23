const { readCsv, readJson, writeCsv } = require("./io.util");

const DATASET_PATH = "./data/input/dataset-sample.csv";
const OUTPUT_PATH = "./data/output/dataset-regexed.csv";
const TOKENS_REGEX_DATA = "./src/utils/tokens-to-regex.json";

(async () => {
  const csvDatas = await readCsv(DATASET_PATH);
  const mapObj = await readJson(TOKENS_REGEX_DATA);

  const re = new RegExp(Object.keys(mapObj).join("|"), "gi");

  newCsvDatas = [];

  for (const csvData of csvDatas) {
    const {
      JOURNAL_ID,
      JOURNAL_TITLE,
      ARTICLE_ID,
      ARTICLE_TITLE,
      ARTICLE_ABSTRACT,
    } = csvData;

    regexedAbstract = ARTICLE_ABSTRACT.replace(re, (matched) => {
      if (mapObj[matched]) return mapObj[matched];
      return matched;
    });

    newCsvData = [
      JOURNAL_ID,
      JOURNAL_TITLE,
      ARTICLE_ID,
      ARTICLE_TITLE,
      regexedAbstract,
    ];

    newCsvDatas.push(newCsvData);
  }

  writeCsv(OUTPUT_PATH, newCsvDatas);
})();
