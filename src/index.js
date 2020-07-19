const { tokensGenerator } = require("./modules/tokensGenerator");
const {
  featureVectorsGenerator,
} = require("./modules/featureVectrosGenerator");

(async () => {
  const processBegin = Date.now();

  await tokensGenerator();

  //////////////////////////////

  const featureVectorsGeneratorResult = await featureVectorsGenerator();

  console.log("\n");

  const processEnd = Date.now();

  console.log(
    "total execution time :",
    (processEnd - processBegin) / 60000,
    "minutes"
  );
})();

/***
 * log large arrays & deep nested objects
 *
 * const util = require("util");
 *
 * console.log(
 *  util.inspect(array, {
 *    maxArrayLength: null,
 *    showHidden: false,
 *    depth: null
 *  })
 * );
 * */
