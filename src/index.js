const fs = require("fs");
const neatCsv = require("neat-csv");

const DATA_DIR = "./data/1000-sample-data.csv";

const readCsv = async fileDir => {
  const csvText = fs.readFileSync(fileDir, "utf-8");
  const formattedCsv = await neatCsv(csvText);
  return formattedCsv;
};

(async () => {
  const csv = await readCsv(DATA_DIR);
  console.log(csv);
})();
