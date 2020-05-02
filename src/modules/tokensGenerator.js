const {
  generateTokens,
  removeDuplicateTokens,
} = require("./utils/text-normalization.util");
const { readCsv, writeJson } = require("./utils/io.util");
const fs = require("fs");

const DATASET_PATH = "./data/input/dataset-sample.csv";
const DATASET_JSON_SAVE_PATH = "./data/output/dataset-sample.json";

const tokensGenerator = async () => {
  console.time("read-csv");

  const csvData = await readCsv(DATASET_PATH);

  console.log("done reading .csv");
  console.timeEnd("read-csv");
  console.log("\n");

  //////////////////////////////

  console.time("preprocessing-text");

  for (const row of csvData) {
    const { ARTICLE_ABSTRACT } = row;
    const tokens = generateTokens(ARTICLE_ABSTRACT);
    const tokensDuplicateRemoved = removeDuplicateTokens(tokens);

    [row.TOKENS, row.TOKENS_DUPLICATE_REMOVED] = [
      tokens,
      tokensDuplicateRemoved,
    ];
  }

  console.log("done preprocessing .csv text");
  console.timeEnd("preprocessing-text");
  console.log("\n");

  //////////////////////////////

  const rawJsonData = fs.readFileSync(DATASET_JSON_SAVE_PATH);
  const parsedJsonData = JSON.parse(rawJsonData);

  const appendedJsonData = [...parsedJsonData, ...csvData];

  //////////////////////////////

  console.time("saving-json");

  writeJson(DATASET_JSON_SAVE_PATH, appendedJsonData);

  console.log("done saving .json");
  console.timeEnd("saving-json");
  console.log("\n");
};

module.exports = { tokensGenerator };
