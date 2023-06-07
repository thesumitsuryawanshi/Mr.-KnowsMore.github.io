  import React from 'react'
  import '../App.css'
  import  book_cover  from '../Photos/book_cover.jpeg'
  import  Knowsmore  from '../Photos/Knowsmore.png'
  import Redis from 'ioredis';
  import Constants from '../utils/Constants';



  const OpenAI = require('openai-api');  
  const {Configuration,OpenAIApi} = require('openai')
  const redis = new Redis(Constants.redis)
  const dotenvFile =  require('dotenv').config()



  //  require('dotenv').config()
  //  console.log(process.env)
   
  //  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;  
  //  const openai = new OpenAI(OPENAI_API_KEY);
  
  function Questions()
  {
      return (
       <div className='body-container'>
            <div>
        <div className='App '>
        <div className='App-header'>
        <header className='headerContainer'>
        
          <a  href='https://www.amazon.com/Minimalist-Entrepreneur-Great-Founders-More/dp/0593192397' target='_blank' >
                <img src={Knowsmore} className="bookcover"  alt="book-logo" />
                </a>       
        
                <h4> Mr. KnowsMore <br /> Knows <br /> Everything </h4>
                <p>
                       This is an experiment in using AI. <br/> 
                       Ask a question and AI'll answer it in real-time. 
                </p>  
                          <input className='textbox'  placeholder="Who is Elon Musk ?"  id='ip_field'  />  
                          <div className='answer-container'>
                          { <div id='answerFieldContainerID' className='answerFieldContainer'> <p className='answerField' > Answer : </p> <p id='ans_field'>  </p> </div> }
                          </div>

           </header> 
        <body>        

             <div className='buttonContainer'>
                 <button onClick={AskQuestionToAI} className='button'>  Ask Question to ChatGPT3 </button>
                 <button  onClick={AskQuestionToGoogle} type="button" className='buttonTwo'> I'm feeling Lucky </button>
             </div>
        
        </body>

    
        </div>
        </div>
  
              </div>    
       </div>
      )  
  }


  function AskQuestionToGoogle() {
   var question = document.getElementById("ip_field").value;
   
   var searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(question);
   window.open(searchUrl, "searchUrl");  

   document.getElementById("ip_field").value = '' ;
    document.getElementById("ip_field").placeholder = "Any other question ?";
    // getAnswerfromPDF(question)



  }
  
  function AskQuestionToAI() {
    var question = document.getElementById("ip_field").value;
    document.getElementById("ip_field").value = '';

    var y= document.getElementById("answerFieldContainerID").style.display = 'flex';
    document.getElementById("ip_field").placeholder = "Any other question ?";
     
    var received_answer = getAnswerfromAI(question)
    document.getElementById("ans_field").innerHTML = received_answer;
  }

//-------------------------//-------------------------expansion of abv buttons -------------------------//-------------------------//----
  
const  getAnswerfromPDF = async(question) => {


let receivedQuestion = question
let CheckQInRedis =  await redis.get(question)

alert(question);

if(receivedQuestion == CheckQInRedis) {
console.log("Cache Hit")
let answer = await redis.get("/"+CheckQInRedis).answer
console.log(answer);

}

}

function getAnswerfromAI(questionForAI) {


console.log("Answering with OpenAI");

let _answer ='' 


const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY 
    });

const openai = new OpenAIApi(configuration);

openai.createCompletion({
    model: 'text-davinci-003',
    prompt: questionForAI,
    max_tokens: 3330,
    temperature: 0
})
.then((response) => {

  _answer = response.data.choices[0].text
console.log(response.data);
document.getElementById("answerFieldContainerID").style.display = 'flex';
document.getElementById('ans_field').innerHTML = _answer; 
    console.log(_answer);
})
.catch(err => {
    console.log(err.message);
})
return _answer;
}

const quit = () => {
    redis.quit()
    process.exit()
  }
   
 export default Questions;