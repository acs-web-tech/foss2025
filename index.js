const readline = require('readline');

let sentenceStore = [];

// Compute the sum of ASCII values for a word
function wordAsciiSum(word) {
  return word.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

// Preprocess a sentence: lowercase, remove punctuation, split into words, and convert each word to its ASCII sum
function sentenceToVector(sentence) {
  // Lowercase and remove punctuation (keeping spaces)
  let cleaned = sentence.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  let words = cleaned.split(/\s+/).filter(Boolean);
  return words.map(word => wordAsciiSum(word));
}

// Store a sentence in memory (along with its vector representation)
function storeSentence(sentence) {
  const vector = sentenceToVector(sentence);
  sentenceStore.push({ sentence, vector });
}

// Get all stored sentences
function getAllSentences() {
  return sentenceStore;
}

// Pad a vector (array of numbers) to a given length with zeros
function padVector(vector, length) {
  let padded = vector.slice(); // Create a copy
  while (padded.length < length) {
    padded.push(0);
  }
  return padded;
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

// Find the best match for a query sentence using cosine similarity on the ASCII sum vectors.
// Also returns all similarity scores for inspection.
function findBestMatch(querySentence) {
  if (sentenceStore.length === 0) {
    return { bestMatch: "No sentences stored yet.", similarity: 0, allSimilarities: [] };
  }
  
  const queryVectorRaw = sentenceToVector(querySentence);
  
  // Determine the maximum vector length among the query and all stored sentences
  let maxLength = queryVectorRaw.length;
  sentenceStore.forEach(item => {
    if (item.vector.length > maxLength) {
      maxLength = item.vector.length;
    }
  });
  
  const queryVector = padVector(queryVectorRaw, maxLength);
  
  let bestMatch = null;
  let highestSimilarity = -1;
  let similarities = [];
  
  sentenceStore.forEach(item => {
    const storedVectorPadded = padVector(item.vector, maxLength);
    const similarity = cosineSimilarity(queryVector, storedVectorPadded);
    similarities.push({ sentence: item.sentence, similarity });
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = item.sentence;
    }
  });
  
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
          console.log(`${index + 1}. ${item.sentence}`);
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

console.log("Sentence ASCII Sum Cosine Similarity Matcher");
mainMenu();
