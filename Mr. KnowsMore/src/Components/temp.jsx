import React from 'react'

const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');


let ParagraphEmbeddings= [];
let QuestionEmbeddings= [];


//----------------------------------------------------------------//----------------------------------------------------------------//---------------------------------  
// Converting  paragraph into the embeddings
function FunParagraphEmbedding()  {


// Book content
const bookContent = `
And yet it is one of the simplest ideas that anyone ever had. 
Here I want to persuade you how evolution explains the beginning of life on earth. Darwin uncovered the theory of evolution and the method of natural selection. 
The idea of evolution is probably one of the most important ideas that anyone has ever had. Today, thanks to Darwin, we know why life is the way it is. 
We can predict how life will be in the future.
We can even postulate about the life on other planets. How amazing is that! Now answer the following questions:
`;

// Split book content into dataChunks
const bookContentembeddings = bookContent.split(/[.!?]/)
  .map(dataChunks => dataChunks.trim())
  .filter(dataChunks => dataChunks.length > 0);

// Load the Universal Sentence Encoder model
async function loadModel() {
  const model = await use.load();
  return model;
}

// Convert bookContentembeddings to embeddings using the Universal Sentence Encoder
async function convertToEmbeddings(bookContentembeddings) {

  const model = await loadModel();
  const embeddings = await model.embed(bookContentembeddings);
    return embeddings;
}

// Example usage
convertToEmbeddings(bookContentembeddings)
  .then(embeddings => {
    embeddings.array().then(__ParagraphEmbeddings => {
      // Further processing with the embeddings
      ParagraphEmbeddings = __ParagraphEmbeddings
      console.log('Book :', __ParagraphEmbeddings);

    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

//----------------------------------------------------------------//----------------------------------------------------------------//---------------------------------  
// Converting the question into the embeddings  
function FunQuestionEmbedding()  {

  
// Function to create embeddings for a given question
async function createEmbeddings(question) {
  // Load the Universal question Encoder model
  const model = await use.load();
  // Convert the question to embeddings
  const embeddings = await model.embed(question); 
  // Get the array of embeddings
  const embeddingsArray = await embeddings.array();
  return embeddingsArray;
}




  const question = "What is the topic of the paragraph? ";



  createEmbeddings(question)
  .then(__questionEmbeddings => {
    // Further processing with the embeddings
    QuestionEmbeddings = __questionEmbeddings
    console.log("Question :" , QuestionEmbeddings) ;
  })
  .catch(error => {
    console.error('Error:', error);
  });


}


//----------------------------------------------------------------//----------------------------------------------------------------//---------------------------------  
// Function to find the answer to an embedded question within an paragraph
function FunFindAnswer()
{

// Function to calculate cosine similarity between two vectors
function MycosineSimilarity(embedding1, embedding2) {
  // Calculate dot product
  const dotProduct = tf.dot(embedding1, embedding2).dataSync()[0];

  // Calculate lengths
  const length1 = tf.norm(embedding1).dataSync()[0];
  const length2 = tf.norm(embedding2).dataSync()[0];

  // Calculate cosine similarity
  const similarity = dotProduct / (length1 * length2);

  return similarity;
}

const similarityScores = [];
for (let i = 0; i < bookEmbeddings.shape[0]; i++) {
  const embedding = bookEmbeddings.slice([i, 0], [1, -1]);
  const similarity = cosineSimilarity(embedding, QuestionEmbeddings);tf
  similarityScores.push(similarity);
}

const maxScoreIndex = similarityScores.indexOf(Math.max(...similarityScores));
const answer = book[maxScoreIndex];



// Function to find the answer to an embedded question in a paragraph
async function findAnswer(ParagraphEmbeddings,  QuestionEmbeddings) {
  // Load the Universal Sentence Encoder model
  const model = await use.load();
  // Calculate the similarity scores between the question and each sentence in the paragraph
  const similarityScores = ParagraphEmbeddings.map(embedding =>
    MycosineSimilarity(embedding,  QuestionEmbeddings)
  );
  // Find the index of the sentence with the highest similarity score
  const maxScoreIndex = similarityScores.indexOf(Math.max(...similarityScores));
  
  
  // Return the corresponding sentence as the answer
  
  // return maxScoreIndex >= 0 ? ParagraphEmbeddings[maxScoreIndex] : null;
  return ParagraphEmbeddings[maxScoreIndex];
}

findAnswer(ParagraphEmbeddings, QuestionEmbeddings)
.then(answer => {
  console.log('Answer:', answer);
})
.catch(error => {
  console.error('Error:', error);
});

// findAnswer(ParagraphEmbeddings, QuestionEmbeddings)
//   .then(answer => {
//     console.log('Answer should be there ');
//     console.log('Answer:', answer);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });

}


FunParagraphEmbedding()
FunQuestionEmbedding()



//----------------------------------------------------------------------------------------------//----------------------------------------------------------------------------------------------
// UI 



function Embeddings() {    
    return (
       <h1>
            Book Content :    
                  <br/>
                  { }
                  <br />
                  <br />
            Question :
            <br />
            <button onClick={FunFindAnswer}>
                CLick ME          
                  </button>
       </h1>
); 
}

export default Embeddings;