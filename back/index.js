//-------------------------------------------start



// const express = require('express');
// const bodyParser = require('body-parser');
// const request = require('request-promise');
// const cheerio = require('cheerio');
// const fs = require('fs');
// const Json2csvParser = require('json2csv').Parser;
// const cors = require('cors');
// const PDFDocument = require('pdfkit');
// const path = require('path');

// const app = express();
// const port = 5022;

// app.use(bodyParser.json());
// app.use(cors());

// app.get('/', (req, res) => {
//   res.send('Hello, this is the root!');
// });


// // app.get('/download-output-pdf', (req, res) => {
// //     const outputPath = './output.pdf';
  
// //     // Read the content of output.pdf and send it as a response
// //     fs.readFile(outputPath, (err, data) => {
// //       if (err) {
// //         console.error('Error reading output.pdf:', err);
// //         res.status(500).send('Error reading output.pdf');
// //       } else {
// //         res.setHeader('Content-Type', 'application/pdf');
// //         res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');
// //         res.send(data);
// //       }
// //     });
// //   });




// async function createPDF() {
//   try {
//     const data = await Link_data.find();
 
//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream('output.pdf'));
 
//     doc.fontSize(16).text('Data from MongoDB', { align: 'center' });
//     doc.moveDown();
 
//     data.forEach((item, index) => {
//       doc.fontSize(12).text(`#${index + 1} - URL: ${item.url}`);
//       doc.moveDown();
//     });
 
//     doc.end();
//     console.log('PDF generated successfully');
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//   }
// }
 
// app.get('/create-pdf', (req, res) => {
//   const filePath = path.join(__dirname, 'output.pdf');
//   res.download(filePath, 'output.pdf', (err) => {
//     if (err) {
//       console.error('Error downloading PDF:', err);
//       res.status(500).json({ error: 'Failed to download PDF' });
//     } else {
//       console.log('PDF downloaded successfully');
//     }
//   });
// });
 
// createPDF();




// app.post('/scrape', async (req, res) => {
//   const { urls, selectors } = req.body;
//   let pages = [];

//   for (let article of urls) {
//     const response = await request({
//       uri: article.trim(),
//       gzip: true,
//     });

//     let $ = cheerio.load(response);

//     let pageData = {};

//     selectors.forEach((selector) => {
//       let values = [];
//       $(selector).each((index, element) => {
//         values.push($(element).text().trim());
//       });
//       pageData[selector] = values;
//     });

//     pages.push(pageData);
//   }
   

  

//   // Save data to a file or database as needed
//   fs.writeFileSync('./data.json', JSON.stringify(pages), 'utf-8');

//   const tableString = getTableString(pages);
//   const outputPath = './output.txt';
//   fs.writeFileSync(outputPath, tableString, 'utf-8');

//   res.json({ tableString, pages });

//   const fields = selectors;
//   const json2csvParser = new Json2csvParser({ fields });
//   const csv = json2csvParser.parse(pages);
//   console.log(csv);

//   console.table(pages);
// });

// // table string
// function getTableString(pages) {
//   let tableString = '';
//   pages.forEach((page) => {
//     for (let key in page) {
//       tableString += `${key}: \n \n ${page[key].join('\n')}\n`;
      

//     }
//     tableString += '\n'.repeat(5);
//   });
//   return tableString;
// }

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


// -------------------------------------------------------------------------end




// const express = require('express');
// const bodyParser = require('body-parser');
// const request = require('request-promise');
// const cheerio = require('cheerio');
// const fs = require('fs');
// const Json2csvParser = require('json2csv').Parser;
// const cors = require('cors');
// const path = require('path');

// const app = express();
// const port = 5051;

// app.use(bodyParser.json());
// app.use(cors());

// app.get('/', (req, res) => {
//   res.send('Hello, this is the root!');
// });


// app.post('/scrape', async (req, res) => {
//   const { urls, selectors } = req.body;
//   let pages = [];

//   for (let article of urls) {
//     const response = await request({
//       uri: article.trim(),
//       gzip: true,
//     });

//     let $ = cheerio.load(response);

//     let pageData = {};

//     selectors.forEach((selector) => {
//       let values = [];
//       $(selector).each((index, element) => {
//         values.push($(element).text().trim());
//       });
//       pageData[selector] = values;
//     });

//     pages.push(pageData);
//   }
   

//   fs.writeFileSync('./data.json', JSON.stringify(pages), 'utf-8');

//   const tableString = getTableString(pages);
//   const outputPath = './output.txt';
//   fs.writeFileSync(outputPath, tableString, 'utf-8');

//   res.json({ tableString, pages });

//   const fields = selectors;
//   const json2csvParser = new Json2csvParser({ fields });
//   const csv = json2csvParser.parse(pages);
//   console.log(csv);

//   console.table(pages);
// });


// function getTableString(pages) {
//   let tableString = '';
//   pages.forEach((page) => {
//     for (let key in page) {
//       tableString += `\n ${key}: \n \n  ${page[key].join('\n')}\n`;
      

//     }
//     tableString += '\n'.repeat(3);
//   });
//   return tableString;
// }

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

//--------------------------------------------mine


const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;
const cors = require('cors');
const path = require('path');

const app = express();
const port = 1400;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, this is the root!');
});




app.post('/scraper', async (req, res) => {
  const { url } = req.body;

  try {
    const response = await request({
      uri: url.trim(),
      gzip: true,
    });

    let $ = cheerio.load(response);

    let foundUrls = [];

    $('a').each((index, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('http')) {
        foundUrls.push(href);
      }
    });

    fs.writeFileSync('./list.txt', foundUrls.join('\n'), 'utf-8');

    res.json({ urls: foundUrls });
    console.log(foundUrls);
  } catch (error) {
    console.error('Error scraping URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





app.post('/scrape', async (req, res) => {
  const { urls, selectors } = req.body;
  let pages = [];

  for (let article of urls) {
    const response = await request({
      uri: article.trim(),
      gzip: true,
    });

    let $ = cheerio.load(response);

    let pageData = {};

    selectors.forEach((selector) => {
      let values = [];
      $(selector).each((index, element) => {
        values.push($(element).text().trim());
      });
      pageData[selector] = values;
    });

    pages.push(pageData);
  }
   

  fs.writeFileSync('./data.json', JSON.stringify(pages), 'utf-8');

  const tableString = getTableString(pages);
  const outputPath = './output.txt';
  fs.writeFileSync(outputPath, tableString, 'utf-8');

  res.json({ tableString, pages });

  const fields = selectors;
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(pages);
  console.log(csv);

  console.table(pages);
});


function getTableString(pages) {
  let tableString = '';
  pages.forEach((page) => {
    for (let key in page) {
      tableString += `\n ${key}: \n \n  ${page[key].join('\n')}\n`;
      

    }
    tableString += '\n'.repeat(3);
  });
  return tableString;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});






