// maths.js

let currentQuestionIndex = 0;
let score = 0;
let totalScore = 0;
const POINTS_PER_QUESTION = 4;

document.addEventListener('DOMContentLoaded', () => {
    initGame();

    // Permettre de valider avec la touche Entrée
    const input = document.getElementById('math-answer');
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("submit-button").click();
        }
    });
});

function initGame() {
    loadQuestion(0);
}

function loadQuestion(index) {
    if (index >= questions.length) {
        endGame();
        return;
    }

    const question = questions[index];

    // UI Updates
    document.getElementById('question-text').innerHTML = question.text; // innerHTML allows formatting
    document.getElementById('math-answer').value = '';
    document.getElementById('feedback-text').textContent = '';
    document.getElementById('question-count').textContent = `Problème ${index + 1} / ${questions.length}`;

    // Reset buttons
    const submitBtn = document.getElementById('submit-button');
    const nextBtn = document.getElementById('next-button');

    submitBtn.style.display = 'inline-block';
    nextBtn.style.display = 'none';
    document.getElementById('math-answer').disabled = false;
    document.getElementById('math-answer').focus();
}

function checkAnswer() {
    const input = document.getElementById('math-answer');
    const userAnswer = parseFloat(input.value);
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (isNaN(userAnswer)) {
        alert("Veuillez entrer un nombre !");
        return;
    }

    const feedback = document.getElementById('feedback-text');
    const submitBtn = document.getElementById('submit-button');
    const nextBtn = document.getElementById('next-button');

    input.disabled = true;
    submitBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';

    if (userAnswer === correctAnswer) {
        feedback.textContent = "Correct ! (+4 points)";
        feedback.className = "feedback-correct";
        score += POINTS_PER_QUESTION;
        totalScore += POINTS_PER_QUESTION;
    } else {
        feedback.textContent = `Faux ! La réponse était ${correctAnswer}.`;
        feedback.className = "feedback-incorrect";
    }

    document.getElementById('score-display').textContent = `Score Total: ${totalScore} / 20`;
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex);
}

function endGame() {
    // Save score
    let gameState = JSON.parse(localStorage.getItem('weddingGameData')) || {};
    const currentScore = gameState['maths'];

    if (currentScore === null || totalScore > currentScore) {
        gameState['maths'] = totalScore;
        localStorage.setItem('weddingGameData', JSON.stringify(gameState));
    }

    const container = document.querySelector('.math-container');
    container.innerHTML = `
        <div class="final-screen" style="text-align: center; padding: 40px;">
            <h1 style="font-family: 'Dancing Script'; font-size: 3rem; color: #5a4e49;">Bravo !</h1>
            <p style="font-size: 1.2rem; margin: 20px 0;">Vous avez terminé l'épreuve de Maths.</p>
            <div class="final-score-large" style="font-size: 4rem; color: #FF9800; font-family: 'Dancing Script'; margin: 30px 0;">${totalScore} / 20</div>
            <p>On espère que vous n'avez pas trop mal à la tête !</p>
            <a href="jeu.html" class="back-button">Retour aux jeux</a>
        </div>
    `;
}
