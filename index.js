const readline = require('readline');
const natural = require('natural');
const TfIdf = natural.TfIdf;
const tokenizer = new natural.SentenceTokenizer();

let sentenceStore = []; 
let paragraphMap = {};   


function preprocess(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}


function storeParagraph(paragraph) {
  let sentences = tokenizer.tokenize(paragraph); 
  sentences.forEach(sentence => {
    let cleanedSentence = preprocess(sentence);
    if (cleanedSentence) {
      sentenceStore.push(sentence);
      paragraphMap[sentence] = paragraph; 
    }
  });
}


function getAllSentences() {
  return sentenceStore;
}


function buildTfIdfVectors(querySentence, sentences) {
  const tfidf = new TfIdf();

  sentences.forEach(sentence => tfidf.addDocument(preprocess(sentence)));

  tfidf.addDocument(preprocess(querySentence));

  let vocabulary = [];
  tfidf.documents.forEach(doc => {
    Object.keys(doc).forEach(term => {
      if (!vocabulary.includes(term)) {
        vocabulary.push(term);
      }
    });
  });

  function getVector(docIndex) {
    return vocabulary.map(term => tfidf.tfidf(term, docIndex));
  }

  return {
    queryVector: getVector(tfidf.documents.length - 1),
    storedVectors: sentences.map((_, idx) => getVector(idx))
  };
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  return (normA && normB) ? dotProduct / (normA * normB) : 0;
}


function findBestMatch(querySentence,rate_limit=0) {
  if (sentenceStore.length === 0) {
    return { bestMatch: "No sentences stored yet.", paragraph: "", allSimilarities: [] };
  }

  const { queryVector, storedVectors } = buildTfIdfVectors(querySentence, sentenceStore);
  let similarities = [];

  
  for (let i = 0; i < storedVectors.length; i++) {
    similarities.push({
      sentence: sentenceStore[i],
      similarity: cosineSimilarity(queryVector, storedVectors[i])
    });
  }


  similarities.sort((a, b) => b.similarity - a.similarity);

  return { 
    bestMatch: similarities[0].sentence, 
    paragraph: paragraphMap[similarities[0].sentence] || similarities[0].sentence,
    allSimilarities: similarities.map(item => ({ sentence: item.sentence, score: item.similarity.toFixed(4) })) // Ranked list with scores
  };
}
module.exports = {findBestMatch,storeParagraph,paragraphMap,sentenceStore,cosineSimilarity}
