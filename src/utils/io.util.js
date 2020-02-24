const csvWriterObj = require("csv-writer").createArrayCsvWriter;
const fs = require("fs");
const neatCsv = require("neat-csv");

const INT_KEY_VALUE = ["JOURNAL_ID", "ARTICLE_ID"];
const UTF_ENCODING_SCHEME = "utf-8";
const WRITE_JSON_SPACES = 2;

const readCsv = async path => {
  const csvText = fs.readFileSync(path, UTF_ENCODING_SCHEME);
  const formattedCsv = await neatCsv(csvText);

  return formattedCsv;
};

const readJson = path => {
  const csvJsonContents = fs.readFileSync(path, UTF_ENCODING_SCHEME);
  const csvJson = JSON.parse(csvJsonContents);

  return csvJson;
};

const replacer = (key, value) => (INT_KEY_VALUE.includes(key) ? +value : value);

const writeCsv = async (path, data) => {
  const csvWriter = csvWriterObj({
    path: path
  });

  csvWriter.writeRecords(data);
};

const writeJson = (path, data) => {
  fs.writeFileSync(
    path,
    JSON.stringify(data, replacer, WRITE_JSON_SPACES),
    err => {
      if (err) throw err;
      console.log("complete writing as .json file");
    }
  );
};

module.exports = { readCsv, readJson, replacer, writeCsv, writeJson };
