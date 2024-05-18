const questions = [
    {
        question: 'Approximately how much stronger was a Tyrannosaurus bite compared to a lions bite?:',
        options: ['twice', 'thrice', 'four times', 'five times'],
        answer: 1
    },
    {
        question: 'What contient did dinosaurs NOT live on?',
        options: ['Australia', 'Antarctica', 'Europe', 'False, all of them'],
        answer: 4
    },
    {
        question: 'What diet were most dinosaurs?',
        options: ['carnivores', 'omnivores', 'herbivores', 'piscivores'],
        answer: 3
    },
    {
        question: 'Which dinosaur had the largest crest?',
        options: ['Dilophosaurus', 'Parasaurolophus', 'Oviraptor', 'Tsintaosaurus'],
        answer: 2
    },
    {
        question: 'What creature is not a dinosaur?',
        options: ['Velociraptor', 'ichthyosaurs', 'Stegosaurus', 'Tyrannosaurus'],
        answer: 2
    }
];

const timer = document.getElementById('timer');
const viewHighscores = document.getElementById('highscores-button');
const questionContainer = document.getElementById('question-container');
const scoreContainer = document.getElementById('score-container');
const submit = document.getElementById('submit');
var activeQuestion = undefined;
var timeInterval;
var timeLeft;

viewHighscores.addEventListener('click', renderHighScores);
submit.addEventListener('click', submitScore);

function countdown() {
    timeLeft = 75;
    timer.textContent = 'Time: ' + timeLeft;
    timeInterval = setInterval(function () {
        timeLeft--;
        if (timeLeft < 0)
            timeLeft = 0;
        timer.textContent = 'Time: ' + timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timeInterval);
            renderInitials();
        }
    }, 1000);
}

function cleanQuestionContainer() {
    questionContainer.innerHTML = '';
}

function cleanScoreContainer() {
    scoreContainer.innerHTML = '<h1 id="score-header">All done!</h1>\n' +
        '                       <p id="final-score"></p>';
}

function createTemplateElements() {
    let questionText = document.createElement('h4');
    let answersList = document.createElement('ul');

    questionText.setAttribute('id', 'question-header');
    questionContainer.appendChild(questionText);
    questionContainer.appendChild(answersList);
    for (let i = 1; i <= 4; i++) {
        let liElement = document.createElement('li');
        let buttonElement = document.createElement('button');

        buttonElement.setAttribute('class', 'option-item');
        buttonElement.setAttribute('id', 'option_' + i);
        answersList.appendChild(liElement);
        liElement.appendChild(buttonElement);
    }
}

function sortHighScores() {
    let scores = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith('player')) {
            scores.push(JSON.parse(localStorage.getItem(key)));
        }
    }
    scores.sort((a, b) => b.score - a.score); // Sort scores in descending order
    return scores;
}

function renderHighScores() {
    clearInterval(timeInterval);
    timeLeft = 0;
    timer.textContent = 'Time: ' + timeLeft;

    cleanQuestionContainer();
    cleanScoreContainer();
    questionContainer.classList.add('hidden');
    scoreContainer.classList.remove('hidden');

    let header = document.getElementById('score-header');
    let text = document.getElementById('final-score');
    let scoresList = document.createElement('ul');
    text.replaceWith(scoresList);
    scoresList.setAttribute('id', 'scores-list');
    let scoresArray = sortHighScores();
    header.textContent = 'High Scores';

    scoresArray.forEach((score, index) => {
        let liElement = document.createElement('li');
        liElement.textContent = `${index + 1}. ${score.initials} - ${score.score}`;
        scoresList.appendChild(liElement);
    });

    let backButton = document.createElement('button');
    let clearScores = document.createElement('button');
    backButton.setAttribute('id', 'back-button');
    clearScores.setAttribute('id', 'clear-scores');
    backButton.textContent = 'Back';
    clearScores.textContent = 'Clear scores';
    scoreContainer.appendChild(backButton);
    scoreContainer.appendChild(clearScores);
}

function renderInitials() {
    questionContainer.classList.add('hidden');
    scoreContainer.classList.remove('hidden');

    timer.textContent = 'Time: ' + timeLeft;
    let finalScore = document.getElementById('final-score');
    finalScore.textContent = 'Your final score is ' + timeLeft;
}

function renderQuestion() {
    let questionText = document.getElementById('question-header');
    questionText.textContent = questions[activeQuestion].question;

    for (let i = 1; i <= 4; i++) {
        let buttonElement = document.getElementById("option_" + i);
        buttonElement.textContent = i + '.' + questions[activeQuestion].options[i - 1];
    }
}

function renderCorrectIncorrect(isCorrect) {
    let hr = document.createElement('hr');
    let span = document.createElement('span');

    if (isCorrect)
        span.textContent = 'Correct';
    else
        span.textContent = 'Wrong';

    questionContainer.appendChild(hr);
    questionContainer.appendChild(span);

    let timeout = setTimeout(function () {
        hr.remove();
        span.remove();
    }, 1000);
}

function checkAnswer(option) {
    let number = option.charAt(option.length - 1);
    number = parseInt(number);

    if (questions[activeQuestion].answer === number)
        renderCorrectIncorrect(true);
    else {
        renderCorrectIncorrect(false);
        timeLeft -= 10;
        if (timeLeft <= 0) {
            renderInitials();
            timeLeft = 0;
            timer.textContent = 'Time: ' + timeLeft;
        }
    }
}

function questionContainerClickHandler(event) {
    let element = event.target;

    if (element.matches('#startQuiz')) {
        cleanQuestionContainer();
        activeQuestion = 0;
        createTemplateElements();
        countdown();
        renderQuestion();
    } else if (element.id.includes('option')) {
        checkAnswer(element.id);
        activeQuestion++;
        if (activeQuestion < questions.length)
            renderQuestion();
        else {
            clearInterval(timeInterval);
            cleanQuestionContainer();
            renderInitials();
        }
    } else if (element.matches('#back-button')) {
        location.reload();
    } else if (element.matches('#clear-scores')) {
        localStorage.clear();
        let list = document.getElementById('scores-list');
        list.remove();
    }
}

function submitScore(event) {
    event.preventDefault();
    let inputText = document.getElementById('initials');
    let playerNumber = localStorage.length + 1;
    let player = {
        initials: inputText.value,
        score: timeLeft
    };
    let key = 'player ' + playerNumber;
    localStorage.setItem(key, JSON.stringify(player));
    renderHighScores();
}

questionContainer.addEventListener('click', questionContainerClickHandler);
submit.addEventListener('click', submitScore);
scoreContainer.addEventListener('click', questionContainerClickHandler);
viewHighscores.addEventListener('click', renderHighScores);