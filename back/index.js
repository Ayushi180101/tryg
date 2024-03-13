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
const port = 1010;

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
      if (href) {
          let resolvedUrl;
          try {
              resolvedUrl = new URL(href, url);
              foundUrls.push(resolvedUrl.href);
          } catch (error) {
              console.error('Error parsing URL:', href, 'in', url);
          }
      }
  });
    fs.writeFileSync('./list.txt', foundUrls.join('\n\n'), 'utf-8');

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





