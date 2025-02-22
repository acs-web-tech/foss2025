let memoryStore = []; // In-memory sentence storage

// Function to store a sentence
function store(sentence) {
    memoryStore.push(sentence);
}

// Function to get all stored sentences
function getAllData() {
    return memoryStore;
}

// Convert sentence into binary format
function toBinary(sentence) {
    return sentence.split("")
                   .map(char => char.charCodeAt(0).toString(2))
                   .join(" ");
}

module.exports = { store, getAllData, toBinary };
