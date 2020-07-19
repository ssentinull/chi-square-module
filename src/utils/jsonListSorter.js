const { readJson, writeJson } = require("./io.util");

const JSON_LIST = "./data/output/chi-square-feature-vectors.json";
const SAVE_PATH = "./data/output/chi-square-feature-vectors-sorted.json";

(async () => {
  const jsonData = await readJson(JSON_LIST);

  jsonData.sort((a, b) => b.CHI_SQUARE - a.CHI_SQUARE);

  writeJson(SAVE_PATH, jsonData);
})();
