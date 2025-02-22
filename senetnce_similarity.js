const readline = require('readline');

let sentenceStore = [];

// Convert a sentence to a binary string without spaces
function toBinary(sentence) {
  return sentence
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

// Pad a binary string to a given length with zeros
function padBinary(binary, length) {
  return binary.padEnd(length, '0');
}

// Convert a binary string to a vector (array of integers)
function binaryToVector(binary) {
  return binary.split('').map(bit => parseInt(bit));
}

// Cosine similarity function for vectors
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

// Store a sentence in memory
function storeSentence(sentence) {
  const binary = toBinary(sentence);
  sentenceStore.push({ sentence, binary });
}

// Get all stored sentences
function getAllSentences() {
  return sentenceStore;
}

// Find the best match for a query sentence using cosine similarity.
// Also returns all similarity scores for debugging/inspection.
function findBestMatch(querySentence) {
  if (sentenceStore.length === 0) {
    return { bestMatch: "No sentences stored yet.", similarity: 0, allSimilarities: [] };
  }
  
  const queryBinary = toBinary(querySentence);
  // Determine the maximum length among the query and all stored sentences
  let maxLength = queryBinary.length;
  sentenceStore.forEach(item => {
    if (item.binary.length > maxLength) {
      maxLength = item.binary.length;
    }
  });
  
  // Pad query binary and stored binaries to maxLength, then convert to vectors
  const queryPadded = padBinary(queryBinary, maxLength);
  const queryVector = binaryToVector(queryPadded);
  
  let bestMatch = null;
  let highestSimilarity = -1;
  let similarities = [];
  
  sentenceStore.forEach(item => {
    const paddedBinary = padBinary(item.binary, maxLength);
    const storedVector = binaryToVector(paddedBinary);
    const similarity = cosineSimilarity(queryVector, storedVector);
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

// Pre-store additional sample sentences
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
  "OpenAI develops advanced AI models."
];

sampleSentences.forEach(sentence => storeSentence(sentence));

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

console.log("Sentence Cosine Similarity Matcher");
mainMenu();
