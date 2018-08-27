const fs = require('fs');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

class MenuParser {
  constructor(input, output) {
    this.split = 460;
    this.allItems = {};
    this.input = input;
    this.output = output;
    this.nextItemId = 1;

    this.parseMenu();
  }

  parseMenu() {
    pdfExtract.extract(this.input, {}, (err, data) => {
      if (err) return console.error(err.message);
      var lines = PDFExtract.utils.pageToLines(data.pages[0], 2);

      this.parseRows(lines);
      this.save(this.output);
    });
  }

  parseRows(rows) {
    let leftItems = [];
    let rightItems = [];
    let itemsToIgnore = [
      'Extras',
      'Desserts',
      'Kids',
      'Cereal'
    ];

    rows.forEach(row => {
      var leftItem = row.filter(item => item.x < this.split).map(item => item.str);
      var rightItem = row.filter(item => item.x > this.split).map(item => item.str);

      if(leftItem.length >= 9 && !itemsToIgnore.includes(leftItem[0].trim())) {
        leftItems.push(this.createItem(leftItem))
      }

      if(rightItem.length >= 9 && !itemsToIgnore.includes(rightItem[0].trim())) {
        rightItems.push(this.createItem(rightItem));
      }
    });

    this.allItems = [...leftItems, ...rightItems];
  }

  getItemId() {
    return '' + this.nextItemId++;
  }

  createItem(info) {
    const startOfValues = info.length - 8;
    const values = info.slice(startOfValues);

    return {
      id: this.getItemId(),
      name: info[0].trim(),
      nutritionalValues: {
        energyKj: values[0],
        energyCal: values[1],
        totalFat: values[2],
        saturates: values[3],
        salt: values[4],
        carbs: values[5],
        sugars: values[6],
        protein: values[7],
      }
    }
  }

  save(output) {
    fs.writeFile(output, JSON.stringify(this.allItems), err => {
      if(err) return console.error(err.message);

      console.log(`File saved as '${output}'`);
    });
  }
}

function printUsage() {
  console.log('node extract.js <input pdf> <output file>');
}

if(process.argv.length < 4) {
  return printUsage();
}

const [input, output] = process.argv.slice(2);

const menu = new MenuParser(input, output);

