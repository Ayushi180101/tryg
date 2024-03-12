import React from 'react';
import ScraperForm from './components/ScraperForm';

function App() {
  return (
    <div className="App">
      <ScraperForm />
    </div>
  );
}

export default App;






















// this is the frontend code:

// import React, { useState, useRef} from 'react';
// import axios from 'axios';
// import './form.css';
// import * as html2pdf from 'html2pdf.js';


// const ProgressBar = ({ activeFieldset }) => (
//     <ul id="progressbar">
//       <li className={activeFieldset === 1 ? 'active' : ''}>URL EXTRACTION</li>
//       <li className={activeFieldset === 2 ? 'active' : ''}>EXTRACTED URLS</li>
//       <li className={activeFieldset === 3 ? 'active' : ''}>SCRAPING</li>
//       <li className={activeFieldset === 4 ? 'active' : ''}>EXTRACTED DATA</li>
//     </ul>
//   );


//   const Fieldset = ({ title, subtitle, children, style }) => (
//     <fieldset style={style}>
//       <h2 className="fs-title">{title}</h2>
//       <h3 className="fs-subtitle">{subtitle}</h3>
//       {children}
//     </fieldset>
//   );

// const ScraperForm = () => {

//     const [activeFieldset, setActiveFieldset] = useState(1);
//     const [formData, setFormData] = useState({
//       email: '',
//       text2: '',
//       text3: '',
//     });


//   const [urls, setUrls] = useState('');
//   const [selectors, setSelectors] = useState('');
//   const [output, setOutput] = useState('');
//   const [showUrlWarning, setShowUrlWarning] = useState(false);

//   const [generatedUrls, setGeneratedUrls] = useState('');

//   const preRef = useRef(null);


//   const isUrlValid = (userInput) => {
//     const res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g);
//     return res !== null;
//   };
  





//   const handleDownloadPDF = () => {
//     const element = preRef.current; 
//     const pdfOptions = {
//       margin: 10,
//       filename: 'output.pdf',
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//     };

//     html2pdf(element, pdfOptions);
//   };



//   const downloadPDF = async () => {
//     const element1 = preRef.current; 
//     const pdfOptions1 = {
//       margin: 10,
//       filename: 'list.pdf',
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//     };

//     html2pdf(element1, pdfOptions1);
//   };





//   const handleStart = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:5045/scraper', { url: formData.email });
//       setGeneratedUrls(response.data.urlContent || '');
      
    
//       handleNext();
//     } catch (error) {
//       console.error('Error generating list of URLs:', error);
//     }
//   };

  

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'email') {
//       setShowUrlWarning(!isUrlValid(value));
     
//     }
    
//     setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));

//   };

//   const handleNext = () => {
//     setActiveFieldset((prevActiveFieldset) => prevActiveFieldset + 1);
//   };

//   const handlePrevious = () => {
//     setActiveFieldset((prevActiveFieldset) => prevActiveFieldset - 1);
//   };




//   const handleSubmit2 = async (e) => {
//     e.preventDefault();

 
//     try {
//       const response = await axios.post('http://localhost:5045/scrape', {
//         urls: urls.split(',').map((url) => url.trim()),
//         selectors: selectors.split(',').map((selector) => selector.trim()),
//       }, {
//         timeout: 5000, 
//       });

//       console.log(response.data + '\n');

 
//       setOutput(response.data.tableString);
//       handleNext();

//     } catch (error) {
//       console.error('Error:', error);
//     }
   
//   };

//   return (

//   <div>
//     <ProgressBar activeFieldset={activeFieldset} />
//       <form id="msform" onSubmit={handleSubmit2}>

//         <Fieldset style={{ display: activeFieldset === 1 ? 'block' : 'none' }}>
//         <h2 className="fs-title">Provide the Main URL</h2>
//  		    <h3 className="fs-subtitle">This step will provide the list of all URLS</h3>
//              <input
//           type="text"
//           name="email"
//           placeholder="Main URL"
//           value={formData.email}
//           onChange={handleInputChange}
//         />
//         {showUrlWarning && <p style={{ color: 'red' }}>Please enter a valid URL.</p>}

        
//         <button type="button" className="next action-button" onClick={handleStart}>
//         Extract
//         </button>
        
   
//         </Fieldset>
//         <Fieldset style={{ display: activeFieldset === 2 ? 'block' : 'none' }}>
//         <h2 className="fs-title">EXTRACTED URLS</h2>
//         <div className="urls">
//         <pre ref={preRef} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
//               {generatedUrls}
//             </pre>
//         </div>

//         <button type="button" className="previous action-button" onClick={handlePrevious} >
//         Previous
//         </button>
//         <button type="button" className="next action-button"  onClick={downloadPDF}
//            >
//         Download
//         </button>
//         <button
//           type="button"
//           className="next action-button"
//           onClick={handleNext}
//         >
//         Next
//         </button>
//         </Fieldset>
//        <Fieldset style={{ display: activeFieldset === 3 ? 'block' : 'none' }}>
//        <h2 className="fs-title">SCRAPING STAGE</h2>
//         <h3 className="fs-subtitle">Enter the URL and the selector that you want to scrape</h3>
//         <input
//         type="text"
//         value={urls}
//         placeholder="Enter URL to scrape"
//         onChange={(e) => {
//         setUrls(e.target.value);
//         setShowUrlWarning(!isUrlValid(e.target.value));
//         }}
//       />
//         <input type="text" placeholder="Selectors" value={selectors} onChange={(e) => setSelectors(e.target.value)} />
//         {showUrlWarning && <p style={{ color: 'red' }}>Please enter a valid URL.</p>}
//         <button type="button" className="previous action-button" onClick={handlePrevious} >
//         Previous
//         </button>
//         <button
//         type="submit"
//         className="submit action-button"
//         onClick={handleSubmit2}
//         disabled={!urls || !selectors || showUrlWarning}>
//         Submit
//         </button>
//         </Fieldset> 

     
//         <Fieldset style={{ display: activeFieldset === 4 ? 'block' : 'none' }}>
//         <h2 className="fs-title">EXTRACTED DATA</h2>
//         <div className="result">
//           <pre ref={preRef}>{output}</pre>
//         </div>
//         <button type="button" className="previous action-button" onClick={handlePrevious}>
//           Previous
//         </button>
//         <button
//           type="button"
//           className="next action-button"
//           onClick={handleDownloadPDF}
//             disabled={!output.trim()}
//         >
//           Download
//         </button>
//       </Fieldset>

      

//     </form>
//     </div>

//   );
// };

// export default ScraperForm;








// this is the backend code:


// const express = require('express');
// const bodyParser = require('body-parser');
// const request = require('request-promise');
// const cheerio = require('cheerio');
// const axios = require('axios');
// const fs = require('fs');
// const Json2csvParser = require('json2csv').Parser;
// const cors = require('cors');
// const path = require('path');

// const app = express();
// const port = 5060;

// app.use(bodyParser.json());
// app.use(cors());

// app.get('/', (req, res) => {
//   res.send('Hello, this is the root!');
// });










// app.post('/scraper', async (req, res) => {
//   const { url } = req.body;

//   try {
//     const response = await request({
//       uri: url.trim(),
//       gzip: true,
//     });

//     let $ = cheerio.load(response);

//     let foundUrls = [];

//     $('a').each((index, element) => {
//       const href = $(element).attr('href');
//       if (href && href.startsWith('http')) {
//         foundUrls.push(href);
//       }
//     });

//     fs.writeFileSync('./list.txt', foundUrls.join('\n'), 'utf-8');

//     res.json({ urls: foundUrls });
//     console.log(foundUrls);
//   } catch (error) {
//     console.error('Error scraping URL:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
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








// modify the code such that the second Fielset displays the content of list.txt