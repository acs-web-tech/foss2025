
const readline = require('readline');
const natural = require('natural');
const TfIdf = natural.TfIdf;

let sentenceStore = [];

// Preprocess a sentence: lowercase and remove punctuation
function preprocess(sentence) {
  return sentence.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

// Store a sentence in memory
function storeSentence(sentence) {
  sentenceStore.push(sentence);
}

// Get all stored sentences
function getAllSentences() {
  return sentenceStore;
}

// Build TF-IDF vectors for the stored sentences and the query sentence
function buildTfIdfVectors(querySentence, sentences) {
  const tfidf = new TfIdf();

  // Add each stored sentence after preprocessing
  sentences.forEach(sentence => tfidf.addDocument(preprocess(sentence)));
  // Add the query sentence as the last document
  tfidf.addDocument(preprocess(querySentence));

  // Extract vocabulary from all documents
  let vocabulary = [];
  tfidf.documents.forEach(doc => {
    Object.keys(doc).forEach(term => {
      if (!vocabulary.includes(term)) {
        vocabulary.push(term);
      }
    });
  });

  // Create a vector for a document given its index
  function getVector(docIndex) {
    const vector = [];
    vocabulary.forEach(term => {
      vector.push(tfidf.tfidf(term, docIndex));
    });
    return vector;
  }

  // Build the query vector (last document) and stored vectors (documents 0 .. n-1)
  const queryVector = getVector(tfidf.documents.length - 1);
  const storedVectors = sentences.map((_, idx) => getVector(idx));

  return { queryVector, storedVectors, vocabulary };
}

// Cosine similarity function for two vectors
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

// Find the best match for a query sentence using TF-IDF cosine similarity.
// Also returns all similarity scores for inspection.
function findBestMatch(querySentence) {
  if (sentenceStore.length === 0) {
    return { bestMatch: "No sentences stored yet.", similarity: 0, allSimilarities: [] };
  }

  const { queryVector, storedVectors } = buildTfIdfVectors(querySentence, sentenceStore);
  let bestMatch = null;
  let highestSimilarity = -1;
  let similarities = [];

  for (let i = 0; i < storedVectors.length; i++) {
    const similarity = cosineSimilarity(queryVector, storedVectors[i]);
    similarities.push({ sentence: sentenceStore[i], similarity });
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = sentenceStore[i];
    }
  }

  // Sort similarity scores descending for display
  similarities.sort((a, b) => b.similarity - a.similarity);

  return { bestMatch, similarity: highestSimilarity, allSimilarities: similarities };
}

// CLI using readline for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function mainMenu() {
  rl.question(
    "\nChoose an option:\n" +
    "1. Store a sentence\n" +
    "2. Find similar sentence\n" +
    "3. Show stored sentences\n" +
    "4. Show all similarity scores for a query\n" +
    "5. Exit\n> ", (choice) => {
    if (choice === '1') {
      rl.question("Enter the sentence to store: ", (sentence) => {
        storeSentence(sentence);
        console.log(`Stored: "${sentence}"`);
        mainMenu();
      });
    } else if (choice === '2') {
      rl.question("Enter the query sentence: ", (sentence) => {
        const result = findBestMatch(sentence);
        console.log(`Best match: "${result.bestMatch}" with similarity: ${result.similarity.toFixed(4)}`);
        mainMenu();
      });
    } else if (choice === '3') {
      console.log("\nStored Sentences:");
      const stored = getAllSentences();
      if (stored.length === 0) {
        console.log("No sentences stored yet.");
      } else {
        stored.forEach((item, index) => {
          console.log(`${index + 1}. ${item}`);
        });
      }
      mainMenu();
    } else if (choice === '4') {
      rl.question("Enter the query sentence: ", (sentence) => {
        const result = findBestMatch(sentence);
        console.log(`\nSimilarity scores for query "${sentence}":`);
        result.allSimilarities.forEach((item, index) => {
          console.log(`${index + 1}. ${item.sentence} -> Similarity: ${item.similarity.toFixed(4)}`);
        });
        mainMenu();
      });
    } else if (choice === '5') {
      console.log("Goodbye!");
      rl.close();
    } else {
      console.log("Invalid choice, please try again.");
      mainMenu();
    }
  });
}

const sampleSentences = [
  "Hello, how are you?",
  "The quick brown fox jumps over the lazy dog.",
  "Artificial intelligence is transforming the world.",
  "Data structures and algorithms are fundamental.",
  "Cosine similarity measures the angle between vectors.",
  "JavaScript is a versatile programming language.",
  "Machine learning enables predictive analysis.",
  "Natural language processing is a key part of AI.",
  "Coding challenges improve problem solving skills.",
  "OpenAI develops advanced AI models.",
  "This is Anirudh here and I really love football. My favorite food is Chappati and Paneer Butter Masala."
];

sampleSentences.forEach(sentence => storeSentence(sentence));

console.log("Sentence TF-IDF Cosine Similarity Matcher");
mainMenu();
