# Latent Search Library
## Overview 
Developed as a Node.js Library reads sentences from a PDF file and identifies the closest match to a given input sentence through TF-IDF (Term Frequency - Inverse Document Frequency) and Cosine Similarity measures. which is an attempt to reduce the influence of embedding models on semantic search this library attempts to match by distance score of each tokens.

## Features 
- The system uses TF-IDF to transform sentences into numerical vectors for analysis.
- Determines the best matching sentence by calculating cosine similarity.
- Generates a sorted list of sentences along with their similarity scores.

## Installation 
### Prerequisites 
- Node.js installed on your system 

### Steps 
1. Download the repository or place the code files into a directory:
```bash 
git clone <repository-url> 
cd <project-directory> 
``` 
2. Install dependencies: 
```bash 
npm install 
``` 
[Demo video link](https://drive.google.com/file/d/1yBqbifa3MyVGs66R85gwjochXga_FHpR/view?usp=sharing)
## Usage 
Run the script using: 
```bash 
node main.js 
``` 
# check the main.js file for examples

## How It Works 
### Preprocessing 
- Converts text to lowercase. 
- Removes punctuation and extra spaces. 
- Tokenizes paragraphs into sentences. 

### TF-IDF (Term Frequency - Inverse Document Frequency)

- TF-TDF is used to trasform text into a numerical representation.
- Each term's importance is calculated using:

TF(Term Frequency): how often a word appears in a sentence.
IDF(Inverse Document Frequency): adjust weights for words that  appear Frequently across all sentences

-The last document added to TF-IDF model is the query sentence, and similarity is computed between it and stored sentence.

### Consine Similarity Check

The similarity between the query vector and each stored sentence TF-IDF vector is calculated using cosine similarity:

cosine similarity = A.B/||A||||B||
where:
- A = TF-IDF vector of the query sentence 
- B = TF-TDF vector of a stored sentence
- ||A|| and ||B|| = magnitude (norm) of each vector 
- The result is a similarity score between 0 and 1 (1 being an exact match)

### Ranking sentences

- All sentences are ranked based on their cosine similarity score.
- The highest-scoring sentence is displayed as the best match.
- Other sentences are listed with thier similarity scores.


### Dependencies

- Natural - NLP processing for tokenization and TF-IDF
- CSV-Parser - Reads CSV Files
- pdf-parse - For parsing pdf's

## Cosine Similarity Algorithm
 - The cosine similarity algorithm or metric calculates how similar two sentences or text documents are by comparing the cosine of the angle between their vector representation. The closer the cosine similarity is to 1, the more similar the text are.

## Cosine Similarity- 3 main steps:
  1. Data Preprocessing:
     - Tokenizing the sentences and calculating the TF-IDF scores.
  
  2. Vectorization:
     - Computing the stored sentences and query to numerical vectors.
  
  3. Cosine Similarity Comparison:
     - The cosine of the angle of the two query and stored sentence vectors are calculated and compared.


## Data Preprocessing- Tokenization and TF-IDF Values:
   - Before comparing sentence they need to be tokenized or split into words.
   - Tokenization:
       ```const tokenizer=new natural.wordTokenizer();```
   - TF-IDF Model:
       ``` const tfidf=new natural.TfIdf();```
           - The the tf-idf stands for Term frequency and Inverse document frequency. The Term frequency is for how often a word appears in a sentence.
           - The Inverse document frequency stands for importance of the word across all the stored sentences(to down-weight common words).
   - Storing and Processing sentences:
        ``` function storeSentence(sentence){
            storedSentences.push(sentence.toLowerCase())
            tfidf.addDocument(tokenizer.tokenize(sentence.toLoweCase()))
        }; ``` 
            - This code converts the sentence to lowercase, tokenizes it and adds it to the tf-idf model.

## Vectorization-Mapping Sentences to Numerical Values:
   - Now each sentence is transformed into a TF-IDF vector, which is a numerical representation.
   - Extracting words and scores from query:
         
## Natural Library Usage for Text Tokenization and TF-IDF Calculation

This project uses the `natural` library in JavaScript to process text data effectively using tokenization and TF-IDF (Term Frequency-Inverse Document Frequency) calculations. The library helps in breaking down sentences into meaningful words and figuring out their importance within a dataset.

### 1. Tokenization (natural.WordTokenizer)
- You'll need to set up the tokenizer like this:
  ```javascript
  const natural = require('natural');
  const tokenizer = new natural.WordTokenizer();
  ```
- It breaks sentences into individual words. which are called tokens which is important for any kind of text processing.
- Tokenized words can be used for further computations, like calculating cosine similarity.

### 2. TF-IDF Calculation (natural.TfIdf)
- You'll want to create an instance of TF-IDF, and you can do it this way:
  ```javascript
  const tfidf = new natural.TfIdf();
  ```
- TF-IDF is about measuring how important a word is in a particular sentence compared to all the sentences in your dataset.
- Each sentence is treated as a separate document.
- When you add sentences you do like this:
  ```javascript
  tfidf.addDocument(tokenizer.tokenize(sentence.toLowerCase()));
  ```
- This whole process calculates TF-IDF scores for words in the sentence.
- When you throw a  new query sentence, the library generates a TF-IDF vector for it and compares it with stored sentences.

### 3. Vector Representation (tfidf.listTerms())
- To retrieve the TF-IDF vector for a sentence:
  ```javascript
  const vector = tfidf.listTerms(index);
  ```
- For a query sentence:
  ```javascript
  const queryVector = tfidf.listTerms(0);
  ```
- These vectors are used in the `cosineSimilarity()` function to determine the most similar stored sentence.

### 4. Cosine Similarity Calculation
- Cosine similarity measures the similarity between two sentences based on their TF-IDF vectors.
- The function `cosineSimilarity(vector1, vector2)` computes the similarity score between two vectors.
- Higher similarity scores indicate more relevant matches.

### Use Cases
- Search Engines: Improve search relevance by finding the most similar documents.
- Plagiarism Detection: Compare text similarity in academic or legal cases.
- Semantic Text Matching: Match job descriptions with resumes.

## Additional Benfit
- Data retrieval from disk storage is generally slower compared to retrieval from RAM. The Latent Search Library enhances performance by storing data in-memory (RAM), enabling significantly faster access and processing times might differ upto the size the data.
- 
### For Developers
- Extend Functionality: Modify the tokenization, stop-word removal, or similarity computation.
- Integrate with APIs: Connect the library to web applications for real-time text comparison.
- Enhance NLP Pipelines: Use in combination with machine learning models for semantic understanding.

This approach enhances document similarity, making information retrieval more efficient.

### Our outcome
  -  Match sentences based on thier tokenized distance between each , the user input and the data's in the dataset which achived 56% of evaluation score without a embedding model involvement and with less expensive NLP Algorithms

### License

- This project is licensed under the [GPL License](LICENSE).
- You are free to use, modify, and distribute this software under the terms of the MIT license. 

