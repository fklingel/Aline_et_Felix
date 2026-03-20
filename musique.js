document.addEventListener('DOMContentLoaded', () => {

    const quizData = [
        {
            audioFile: 'q1.mp3',
            acceptedAnswers: ['star wars', 'marche impériale', 'la marche impériale'],
            hint: 'Que la force soit avec toi'
        },
        {
            audioFile: 'q2.mp3',
            acceptedAnswers: ['lacs du connemara', 'les lacs du connemara'],
            hint: 'Race de poneys'
        },
        {
            audioFile: 'q3.mp3',
            acceptedAnswers: ['gimme gimme gimme', 'gimme', 'gimme! gimme! gimme!', 'gimme gimme gimme! gimme! (a man after midnight)', 'a man after midnight', 'Gimme! Gimme! Gimme! A Man After Midnight', 'Gimme Gimme Gimme A Man After Midnight', 'Gimme Gimme Gimme (A Man After Midnight)'],
            hint: 'Donne-moi'
        },
        {
            audioFile: 'q4.mp3',
            acceptedAnswers: ['harry potter', 'hedwig theme', "hedwig\'s theme"],
            hint: 'Tu es un sorcier !'
        },
        {
            audioFile: 'q5.mp3',
            acceptedAnswers: ["les copains d\'abord", "copains d\'abord", "les copains d abord", "copains d abord"],
            hint: 'Pas le radeau'
        },
        {
            audioFile: 'q6.mp3',
            acceptedAnswers: ['bella ciao'],
            hint: 'Au revoir'
        },
        {
            audioFile: 'q7.mp3',
            acceptedAnswers: ['alors on danse'],
            hint: 'Artiste belge'
        },
        {
            audioFile: 'q8.mp3',
            acceptedAnswers: ['enemy'],
            hint: 'Pas mon ami'
        },
        {
            audioFile: 'q9.m4a',
            acceptedAnswers: ['ciel'],
            hint: 'Au-dessus de nos têtes'
        },
        {
            audioFile: 'q10.mp3',
            acceptedAnswers: ["à l\'horizontale", "à l horizontale", "a l\'horizontale", "a l horizontale"],
            hint: 'Une position allongée...'
        }
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
            score++;
            feedbackText.textContent = "Bonne réponse !";
            feedbackText.className = 'feedback-correct';

            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < quizData.length) {
                    loadQuestion();
                } else {
                    endQuiz();
                }
            }, 2000);
        } else {
            feedbackText.textContent = `Dommage, ce n'est pas ça ! Indice : ${currentQuestion.hint || "Écoutez bien !"}`;
            feedbackText.className = 'feedback-incorrect';

            // On laisse plus de temps pour lire l'indice si la réponse est fausse
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < quizData.length) {
                    loadQuestion();
                } else {
                    endQuiz();
                }
            }, 4000);
        }
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
