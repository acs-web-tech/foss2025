let memoryStore = []; // In-memory sentence storage

// Function to store a sentence
function store(sentence) {
    memoryStore.push(sentence);
    return memoryStore
}

// Function to get all stored sentences
function getAllData() {
    return memoryStore;
}


module.exports = { store, getAllData };
