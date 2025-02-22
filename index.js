const readline = require('readline');
const natural = require('natural');
const TfIdf = natural.TfIdf;
const tokenizer = new natural.SentenceTokenizer();

let sentenceStore = [];  // Stores individual sentences
let paragraphMap = {};   // Maps sentences to their original paragraphs

// Preprocess text: lowercase, remove punctuation
function preprocess(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

// Store a paragraph by splitting it into sentences
function storeParagraph(paragraph) {
  let sentences = tokenizer.tokenize(paragraph); // Split into sentences
  sentences.forEach(sentence => {
    let cleanedSentence = preprocess(sentence);
    if (cleanedSentence) {
      sentenceStore.push(sentence);
      paragraphMap[sentence] = paragraph; // Map sentence to original paragraph
    }
  });
}

// Get all stored sentences
function getAllSentences() {
  return sentenceStore;
}

// Build TF-IDF vectors for query and stored sentences
function buildTfIdfVectors(querySentence, sentences) {
  const tfidf = new TfIdf();

  // Add stored sentences
  sentences.forEach(sentence => tfidf.addDocument(preprocess(sentence)));

  // Add the query as the last document
  tfidf.addDocument(preprocess(querySentence));

  // Extract vocabulary
  let vocabulary = [];
  tfidf.documents.forEach(doc => {
    Object.keys(doc).forEach(term => {
      if (!vocabulary.includes(term)) {
        vocabulary.push(term);
      }
    });
  });

  // Get vector representation
  function getVector(docIndex) {
    return vocabulary.map(term => tfidf.tfidf(term, docIndex));
  }

  return {
    queryVector: getVector(tfidf.documents.length - 1),
    storedVectors: sentences.map((_, idx) => getVector(idx))
  };
}

// Compute Cosine Similarity
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

// Find best matching sentence and ranked list
function findBestMatch(querySentence) {
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

  // Sort by similarity score (highest first)
  similarities.sort((a, b) => b.similarity - a.similarity);

  return { 
    bestMatch: similarities[0].sentence, 
    paragraph: paragraphMap[similarities[0].sentence] || similarities[0].sentence,
    allSimilarities: similarities.map(item => ({ sentence: item.sentence, score: item.similarity.toFixed(4) })) // Ranked list with scores
  };
}

// CLI using readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function mainMenu() {
  rl.question(
    "\nChoose an option:\n" +
    "1. Store a paragraph\n" +
    "2. Find similar sentence (also shows ranked list)\n" +
    "3. Show stored sentences\n" +
    "4. Exit\n> ", (choice) => {
    if (choice === '1') {
      rl.question("Enter the paragraph to store: ", (paragraph) => {
        storeParagraph(paragraph);
        console.log("Paragraph stored.");
        mainMenu();
      });

    } else if (choice === '2') {
      rl.question("Enter the query sentence: ", (sentence) => {
        const result = findBestMatch(sentence);
        console.log(`\n🔹 Best match: "${result.bestMatch}"`);
        console.log(`From paragraph: "${result.paragraph}"`);
        console.log("\nOther matching sentences (ranked):");
        console.log(JSON.stringify(result.allSimilarities, null, 2)); // Display as an array
        mainMenu();
      });

    } else if (choice === '3') {
      console.log("\nStored Sentences:");
      const stored = getAllSentences();
      if (stored.length === 0) {
        console.log("No sentences stored yet.");
      } else {
        stored.forEach((item, index) => console.log(`${index + 1}. ${item}`));
      }
      mainMenu();

    } else if (choice === '4') {
      console.log("Goodbye!");
      rl.close();

    } else {
      console.log("Invalid choice, please try again.");
      mainMenu();
    }
  });
}

// Sample Paragraphs
const sampleParagraphs = [
  "Despite the rain, the hikers pressed on with quiet determination. The sky was dark, but their spirits remained unshaken.",
  "In the city center, an old library quietly preserves the secrets of the past. Each book holds a forgotten story, waiting to be discovered.",
  "Advancements in technology and AI are steadily reshaping our everyday lives.4 Innovations in automation and machine learning are transforming industries.",
  "Amid urban clamor, the soft notes of a saxophone evoke a sense of calm nostalgia. A lone musician stands by the river, playing with emotion.",
  "Global efforts to address climate change call for innovative ideas and careful planning. Solutions must be both sustainable and impactful."
];

// Store sample paragraphs
sampleParagraphs.forEach(paragraph => storeParagraph(paragraph));

console.log("Sentence TF-IDF Cosine Similarity Matcher");
mainMenu();
