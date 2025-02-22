const natural = require("natural");

// Function to compute Cosine Similarity
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0, magA = 0, magB = 0;

    for (let i = 0; i < Math.min(vecA.length, vecB.length); i++) {
        dotProduct += vecA[i] * vecB[i];
        magA += vecA[i] ** 2;
        magB += vecB[i] ** 2;
    }

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    return magA && magB ? dotProduct / (magA * magB) : 0;
}

// Function to find the closest matching sentence
function findClosestMatch(binaryQuery, sentences) {
    let tokenizer = new natural.WordTokenizer();
    let queryTokens = tokenizer.tokenize(binaryQuery);

    let bestMatch = null;
    let highestSimilarity = 0;

    sentences.forEach(sentence => {
        let sentenceTokens = tokenizer.tokenize(sentence);
        let similarity = cosineSimilarity(queryTokens, sentenceTokens);

        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            bestMatch = sentence;
        }
    });

    return bestMatch || "No close match found";
}

module.exports = { findClosestMatch };
