const fs = require("fs");
var parse = require("csv-parse");

const readCSV = (simpleFlow) => {
  let inputPath = `./src/testCases/${simpleFlow}.csv`;
  // console.log(inputPath);
  return new Promise(resolve => {
    fs.readFile(inputPath, function(err, fileData) {
      parse(fileData, { columns: false, trim: true }, function(err, rows) {
        // Your CSV data is in an array of arrys passed to this callback as rows.
        let [headerRow, ...restRows] = rows;
        restRows = restRows.map(restRow => {
          let rowAsObj = {};
          restRow.map((cell, index) => {
            rowAsObj[headerRow[index]] = cell;
          });
          return rowAsObj;
        });
        // console.log(restRows);
        resolve(restRows)
      });
    });
  });
};

readCSV('addBeneTest').then(rows => {
    // console.log(rows);
})

module.exports.readCSV = readCSV;