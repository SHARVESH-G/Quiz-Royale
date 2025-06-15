import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';



const dataBase = new pg.Client({
    user:'postgres',
    host:'localhost',
    database:'world',
    password:'Ram32694',
    port:5432,
})

dataBase.connect();

let quiz;
let currentQuestion = {};
let score = 0;

dataBase.query('SELECT * FROM capitals', (err, res) => {
    if(err){
        console.log('Error executing query');
    }else{
        quiz = res.rows;
    }
    dataBase.end();
});

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));




app.get('/',(req,res)=>{
    nextQuestion();
    res.render('index.ejs', {question: currentQuestion , score:score , mess: "Welcome to the Quiz Game! Answer the question below." , mess1:"info"});
})


app.post('/quiz', (req, res) => {
    let userAnswer = req.body.answer;
    let correctAnswer = currentQuestion.capital;

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        score++;
        nextQuestion();
        res.render('index.ejs', {
            question: currentQuestion,
            score: score,
            mess: "Correct answer! Well done!",
            mess1: "Correct!"
        });
    } else {
        resetQuiz();
        res.render('index.ejs', {
            question: currentQuestion,
            score: score,
            mess: "Incorrect answer. Try again!",
            mess1: "Wrong!"
        });
    }
});


async function nextQuestion(){
    const randomCoutry = quiz[Math.floor(Math.random() * quiz.length)];
    currentQuestion = randomCoutry;
}

async function resetQuiz(){
    const randomCoutry = quiz[Math.floor(Math.random() * quiz.length)];
    currentQuestion = randomCoutry;
    score = 0;
}

app.listen(port , ()=>{
    console.log("Server Started");
})