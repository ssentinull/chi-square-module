const fs = require("fs");
const neatCsv = require("neat-csv");

const UTF_ENCODING_SCHEME = "utf-8";
const WRITE_JSON_SPACES = 2;
const INT_KEY_VALUE = ["JOURNAL_ID", "ARTICLE_ID"];

const readCsv = async fileDir => {
  const csvText = fs.readFileSync(fileDir, UTF_ENCODING_SCHEME);
  const formattedCsv = await neatCsv(csvText);

  return formattedCsv;
};

const readJson = file => {
  const csvJsonContents = fs.readFileSync(file, UTF_ENCODING_SCHEME);
  const csvJson = JSON.parse(csvJsonContents);

  return csvJson;
};

const replacer = (key, value) => (INT_KEY_VALUE.includes(key) ? +value : value);

const writeJson = (file, variable) => {
  fs.writeFileSync(
    file,
    JSON.stringify(variable, replacer, WRITE_JSON_SPACES),
    err => {
      if (err) throw err;
      console.log("complete writing as .json file");
    }
  );
};

module.exports = { readCsv, readJson, replacer, writeJson };
