const readline = require('readline');
const natural = require('natural');
const csvParser = require('csv-parser');
const fs = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');
const {storeParagraph} = require("../index")
const TfIdf = natural.TfIdf;
const tokenizer = new natural.SentenceTokenizer();
let paragraphMap = {}; 

function preprocess(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}


function storeSentence(sentence, source) {
  let cleanedSentence = preprocess(sentence);
  if (cleanedSentence) {
    storeParagraph(sentence)
    paragraphMap[sentence] = source; 
  }
}

async function readCSV(filePath, columnName) {
  sentenceStore = []; 
  paragraphMap = {}; 
  
console.log("Sentence TF-IDF Cosine Similarity Matcher");
  return new Promise((resolve,reject)=>{
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          if (row[columnName]) {
            let sentences = tokenizer.tokenize(row[columnName]); 
            sentences.forEach(sentence => storeSentence(sentence, row[columnName]));
            resolve(sentenceStore)
          }
        })
        .on('end', () => {
          console.log(`CSV file processed. ${sentenceStore.length} sentences stored.`);
        });
    
  })

}
module.exports = {readCSV}
