/****   JSON Data parsing and Similarity search ****/
// Examples*
async function JSON() {
    let readJson = require("./readers/jsonReader")
    let parsedData = readJson("./test-script/data.json")
    let { findBestMatch, storeParagraph } = require("./index")
    for (let i = 0; i < parsedData.length; i++) {
        storeParagraph(parsedData[i].data)
    }
    console.log(findBestMatch("we need to have a proper plan"))
}
// uncomment it to check the output
//JSON()
/****   END ****/

/****   PDF Data parsing and Similarity search ****/
async function Pdf() {
    let { loadAllFiles, findSimilarSentence, showStoredSentences } = require("./readers/pdfreader")
    await loadAllFiles(["./test-script/dataset.pdf"])
    console.log(findSimilarSentence("we need to learn AI and improve our life"))

}
// uncomment it to check the output
//Pdf()
/**** END ****/

/****   CSV Data parsing and Similarity search ****/
async function CSV() {
    const {findBestMatch} = require("./index")
    let { readCSV,sentenceStore } = require("./readers/csvReader")
    let data =await readCSV("./test-script/test.csv", "Video")
    console.log(findBestMatch("charlie chaplin"),sentenceStore)
}
// uncomment it to check the output
//CSV()
/**** END ****/
