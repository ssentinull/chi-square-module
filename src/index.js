const csv = require("csv-parser");
const fs = require("fs");
const results = [];

const DATA_DIR = "./data/1000-sample-data.csv";

fs.createReadStream(DATA_DIR)
  .pipe(csv())
  .on("data", data => results.push(data));
