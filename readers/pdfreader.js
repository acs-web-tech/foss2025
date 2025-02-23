const fs = require("fs");
const pdfParse = require("pdf-parse");
const natural = require("natural");
const readline = require("readline");

function cosineSimilarity(vec1, vec2) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    let termMap = new Map();

    vec1.forEach(term => termMap.set(term.term, term.tfidf));
    vec2.forEach(term => {
        if (termMap.has(term.term)) {
            dotProduct += term.tfidf * termMap.get(term.term);
        }
        normB += term.tfidf ** 2;
    });

    termMap.forEach(value => (normA += value ** 2));
    return normA === 0 || normB === 0 ? 0 : dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}



const tokenizer = new natural.WordTokenizer();
const tfidf = new natural.TfIdf();
let storedSentences = [];

async function loadAllFiles(paths) {
    storedSentences = []; // Clear existing sentences
    tfidf.documents = []; // Clear TF-IDF model

    for (const filePath of paths) {
        console.log(filePath)
        if (filePath.endsWith(".txt")) {
            loadSentencesFromFile(filePath);
        } else if (filePath.endsWith(".pdf")) {
           return  await loadSentencesFromPDF(filePath);
        }
    }
    console.log("✅ Data loaded from all stored files.");
}

// Store a sentence manually
function storeSentence(sentence) {
    storedSentences.push(sentence.toLowerCase());
    tfidf.addDocument(tokenizer.tokenize(sentence.toLowerCase()));
}

//  Find the most similar sentence
function findSimilarSentence(query,rate_limit=0) {
    query = query.toLowerCase();
    let queryTokens = tokenizer.tokenize(query);
    let queryVector = new natural.TfIdf();
    queryVector.addDocument(queryTokens);
    let match = []
    let bestMatch = "";
    let bestScore = 0;
    for(let it = 0 ; it < storedSentences.length ; it++){
        let score = cosineSimilarity(queryVector.listTerms(0), tfidf.listTerms(it));
        if (score > bestScore) {
            bestScore = score;
            bestMatch = storedSentences[it];
            match.push({bestScore,bestMatch})
        }


    }
    return match
    
}


function showStoredSentences() {
    storedSentences.forEach((sentence, index) => console.log(`${index + 1}. ${sentence}`));
}


function loadSentencesFromFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filePath}`);
        return;
    }
    const content = fs.readFileSync(filePath, "utf8");
    content.split("\n").forEach(line => {
        if (line.trim()) storeSentence(line.trim());
    });
}


async function loadSentencesFromPDF(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filePath}`);
        return;
    }
    const data = await pdfParse(fs.readFileSync(filePath));
    data.text.split("\n").forEach(line => {
        if (line) storeSentence(line.trim());
    });
}

async function addFilePath(filePath) {
    if (!filePaths.includes(filePath)) {
        filePaths.push(filePath);
        console.log(`📂 File path added: ${filePath}`);
        await loadAllFiles(); 
    } else {
        console.log("⚠️ File path already exists!");
    }
}


function showStoredFilePaths() {
    console.log("\n📂 Stored File Paths:");
    filePaths.forEach((path, index) => console.log(`${index + 1}. ${path}`));
}


module.exports = {loadAllFiles,findSimilarSentence,showStoredSentences}
