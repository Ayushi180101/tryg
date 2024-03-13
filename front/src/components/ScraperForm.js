// --------------------------------





import React, { useState} from 'react';
import axios from 'axios';
import './form.css';
import * as html2pdf from 'html2pdf.js';
// import {BASE_URL} from '../helper'

const ProgressBar = ({ activeFieldset }) => (
    <ul id="progressbar">
      <li className={activeFieldset === 1 ? 'active' : ''}>URL EXTRACTION</li>
      <li className={activeFieldset === 2 ? 'active' : ''}>EXTRACTED URLS</li>
      <li className={activeFieldset === 3 ? 'active' : ''}>SCRAPING</li>
      <li className={activeFieldset === 4 ? 'active' : ''}>EXTRACTED DATA</li>
    </ul>
  );


  const Fieldset = ({ title, subtitle, children, style }) => (
    <fieldset style={style}>
      <h2 className="fs-title">{title}</h2>
      <h3 className="fs-subtitle">{subtitle}</h3>
      {children}
    </fieldset>
  );

const ScraperForm = () => {

    const [activeFieldset, setActiveFieldset] = useState(1);
    const [formData, setFormData] = useState({
      email: '',
      text2: '',
      text3: '',
    });


  const [urls, setUrls] = useState('');
  const [selectors, setSelectors] = useState('');
  const [output, setOutput] = useState('');
  const [showUrlWarning, setShowUrlWarning] = useState(false);

  const [generatedUrls, setGeneratedUrls] = useState('');
  const [loading, setLoading] = useState(false);

  const [preRef, setPreRef] = useState(null);


  const isUrlValid = (userInput) => {
    const res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g);
    return res !== null;
  };
  






  const handleDownloadPDF = () => {
    const element = preRef.current; 
    const pdfOptions = {
      margin: 10,
      filename: 'output.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf(element, pdfOptions);
  };



  const handleDownloadPDF2 = () => {   
    const element = document.querySelector('.url-list');
    const pdfOptions = {
      title:'List of Scraped URLs',
      margin: 10,
      filename: 'output.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(pdfOptions).save();
  };




  const handleStart = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:1010/scraper', { url: formData.email });
      
      const listContent = response.data.urls.join('\n');
      
      setGeneratedUrls(listContent);
      handleNext();
    } catch (error) {
      console.error('Error generating list of URLs:', error);
    }
  };
  

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setShowUrlWarning(!isUrlValid(value));
     
    }
    
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

  };

  const handleNext = () => {
    setActiveFieldset((prevActiveFieldset) => prevActiveFieldset + 1);
  };

  const handlePrevious = () => {
    setActiveFieldset((prevActiveFieldset) => prevActiveFieldset - 1);
  };




  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    try {
      const response = await axios.post('http://localhost:1010/scrape', {
        urls: urls.split(',').map((url) => url.trim()),
        selectors: selectors.split(',').map((selector) => selector.trim()),
      }, {
        timeout: 5000, 
      });

      console.log(response.data + '\n');

 
      setOutput(response.data.tableString);
      handleNext();

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); }
   
  };

  return (

  <div>
    <ProgressBar activeFieldset={activeFieldset} />
      <form id="msform" onSubmit={handleSubmit2}>

        <Fieldset style={{ display: activeFieldset === 1 ? 'block' : 'none' }}>
        <h2 className="fs-title">Provide the Main URL</h2>
 		    <h3 className="fs-subtitle">This step will provide the list of all URLS</h3>
             <input
          type="text"
          name="email"
          placeholder="Main URL"
          value={formData.email}
          onChange={handleInputChange}
        />
        {showUrlWarning && <p style={{ color: 'red' }}>Please enter a valid URL.</p>}

        
        <button type="button" disabled={loading} className="next action-button" onClick={handleStart}>
         {loading ? 'Loading...' : 'Extract'}
        </button>
      </Fieldset>
        
    <Fieldset style={{ display: activeFieldset === 2 ? 'block' : 'none' }}>
     
        <h2 className="fs-title">EXTRACTED URLS</h2>
        

       

        <div className="url-list" style={{ maxWidth:'500px',  margin: '0 auto', textAlign: 'left'}}>
        <pre
          ref={(ref) => setPreRef(ref)}
          style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxHeight: '500px', overflow: 'auto' }}
        >
          {generatedUrls.split('\n\n\n\n').map((url, index) => (
            <a key={index} href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          ))}
        </pre>
      </div>



      <button type="button" className="previous action-button" onClick={handlePrevious} >
        Previous
        </button>
      <button type="button" className="next action-button"  onClick={handleDownloadPDF2}>
           
           Download
           </button>
           <button
             type="button"
             className="next action-button"
             onClick={handleNext}
           >
           Next
           </button>
   
       
        </Fieldset>
       <Fieldset style={{ display: activeFieldset === 3 ? 'block' : 'none' }}>
       <h2 className="fs-title">SCRAPING STAGE</h2>
        <h3 className="fs-subtitle">Enter the URL and the selector that you want to scrape</h3>
        <input
        type="text"
        value={urls}
        placeholder="Enter URL to scrape"
        onChange={(e) => {
        setUrls(e.target.value);
        setShowUrlWarning(!isUrlValid(e.target.value));
        }}
      />
        <input type="text" placeholder="Selectors" value={selectors} onChange={(e) => setSelectors(e.target.value)} />
        {showUrlWarning && <p style={{ color: 'red' }}>Please enter a valid URL.</p>}
        <button type="button" className="previous action-button" onClick={handlePrevious} >
        Previous
        </button>
        <button
        type="submit"
        className="submit action-button"
        onClick={handleSubmit2}
        disabled={!urls || !selectors || showUrlWarning || loading}>
         {loading ? 'Loading...' : 'Submit'}
        </button>
        </Fieldset> 

     
        <Fieldset style={{ display: activeFieldset === 4 ? 'block' : 'none' }}>
        <h2 className="fs-title">EXTRACTED DATA</h2>
        <div className="result" style={{maxHeight: '300px', textAlign:'left', maxWidth:'800px', overflow: 'auto', margin: '0 auto'}} >
          <pre ref={preRef}>{output}</pre>
        </div>
        <button type="button" className="previous action-button" onClick={handlePrevious}>
          Previous
        </button>
        <button
          type="button"
          className="next action-button"
          onClick={handleDownloadPDF}
            disabled={!output.trim()}
          
        >
          Download
        </button>
      </Fieldset>

      

    </form>
    </div>

  );
};

export default ScraperForm;


// //..................................................













