const fs = require('fs');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const filename = './tacobell-nutrition-allergy-19092017-1.pdf';

class Menu {
  constructor(filename) {
    this.split = 460;
    this.allItems = {};

    this.parseMenu(filename);
  }

  parseMenu(filename) {
    pdfExtract.extract(filename, {}, (err, data) => {
      if (err) return console.log(err);
      var lines = PDFExtract.utils.pageToLines(data.pages[0], 2);

      this.parseRows(lines);
    });
  }

  parseRows(rows) {
    let leftItems = [];
    let rightItems = [];
    let itemsToIgnore = [
      'Extras',
      'Desserts',
      'Kids'
    ];

    rows.forEach(row => {
      var leftItem = row.filter(item => item.x < this.split).map(item => item.str);
      var rightItem = row.filter(item => item.x > this.split).map(item => item.str);

      if(leftItem.length >= 9) {
        leftItems.push(this.createItem(leftItem))
      }

      if(rightItem.length >= 9 && !itemsToIgnore.includes(rightItem[0])) {
        rightItems.push(this.createItem(rightItem));
      }
    });

    this.allItems = [...leftItems, ...rightItems];
    this.save();
  }

  createItem(info) {
    const startOfValues = info.length - 8;
    const values = info.slice(startOfValues);

    return {
      name: info[0],
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

  save(filename = 'menu.json') {
    fs.writeFile(filename, JSON.stringify(this.allItems.slice(1)), err => {
      if(err) return console.log(err);

      console.log(`File saved as '${filename}'`);
    });
  }
}

const menu = new Menu(filename);

