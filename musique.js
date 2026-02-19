document.addEventListener('DOMContentLoaded', () => {

    const quizData = [
        // Remplissez vos 20 questions ici
        {
            audioFile: 'q1.mp3',
            acceptedAnswers: ['star wars']
        },
        {
            audioFile: 'q2.mp3',
            acceptedAnswers: ['lacs du connemara']
        },
        {
            audioFile: 'q3.mp3',
            acceptedAnswers: ['gimme gimme gimme']
        },
        {
            audioFile: 'q4.mp3',
            acceptedAnswers: ['harry potter']
        },
        {
            audioFile: 'q5.mp3',
            acceptedAnswers: ["les copains d'abord"]
        },
        {
            audioFile: 'q6.mp3',
            acceptedAnswers: ['bella ciao']
        },
        {
            audioFile: 'q7.mp3',
            acceptedAnswers: ['alors on danse']
        },
        {
            audioFile: 'q8.mp3',
            acceptedAnswers: ['enemy']
        },
        {
            audioFile: 'q9.mp3',
            acceptedAnswers: ['ciel']
        },
        {
            audioFile: 'q10.mp3',
            acceptedAnswers: ["à l'horizontale"]
        },
        // ... etc.
    ];

    // Références aux éléments de la page
    const quizActive = document.getElementById('quiz-active');
    const quizEndScreen = document.getElementById('quiz-end-screen');
    const questionCounter = document.getElementById('question-counter');
    const audioPlayer = document.getElementById('audio-player');
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-button');
    const feedbackText = document.getElementById('feedback-text');
    const finalScoreDisplay = document.getElementById('final-score-display');
    const whistlingAnimation = document.getElementById('whistling-animation');

    let currentQuestionIndex = 0;
    let score = 0;

    function loadQuestion() {
        feedbackText.textContent = '';
        answerInput.value = '';
        answerInput.disabled = false;
        submitButton.disabled = false;

        const currentQuestion = quizData[currentQuestionIndex];
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} / ${quizData.length}`;
        audioPlayer.src = `audio/${currentQuestion.audioFile}`;

        whistlingAnimation.pause();
        whistlingAnimation.currentTime = 0;
    }

    function handleSubmit() {
        const userAnswer = answerInput.value.toLowerCase().trim();
        if (!userAnswer) return;

        const currentQuestion = quizData[currentQuestionIndex];
        const isCorrect = currentQuestion.acceptedAnswers.includes(userAnswer);

        answerInput.disabled = true;
        submitButton.disabled = true;

        if (isCorrect) {
            score++;
            feedbackText.textContent = "Bonne réponse !";
            feedbackText.className = 'feedback-correct';
        } else {
            feedbackText.textContent = "Dommage, ce n'est pas ça !";
            feedbackText.className = 'feedback-incorrect';
        }

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                loadQuestion();
            } else {
                endQuiz();
            }
        }, 2000);
    }

    function endQuiz() {
        quizActive.classList.add('hidden');
        quizEndScreen.classList.remove('hidden');
        finalScoreDisplay.textContent = score;
        const gameState = JSON.parse(localStorage.getItem('weddingGameData'));
        const currentScore = gameState['musique'];
        if (currentScore === null || score > currentScore) {
            gameState['musique'] = score;
            localStorage.setItem('weddingGameData', JSON.stringify(gameState));
        }
    }

    audioPlayer.addEventListener('play', () => {
        whistlingAnimation.play();
    });

    audioPlayer.addEventListener('pause', () => {
        whistlingAnimation.pause();
    });

    audioPlayer.addEventListener('ended', () => {
        whistlingAnimation.pause();
    });

    loadQuestion();

    submitButton.addEventListener('click', handleSubmit);
    answerInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    });
});