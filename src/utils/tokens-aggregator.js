const { readJson, writeJson } = require("./io.util");

const DATASET_PATH = "./data/output/dataset-sample.json";
const OUTPUT_PATH = "./src/utils/tokens-to-regex.json";

(async () => {
  const jsonDatas = await readJson(DATASET_PATH);
  const regexTokens = {};

  for (const jsonData of jsonDatas) {
    const { TOKENS_DUPLICATE_REMOVED: tokens } = jsonData;

    for (const token of tokens)
      if (!(token in regexTokens)) regexTokens[token] = token;
  }

  writeJson(OUTPUT_PATH, regexTokens);
})();
