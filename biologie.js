document.addEventListener('DOMContentLoaded', () => {

    const quizData = [
        // Remplissez vos questions ici (vous pouvez en ajouter autant que vous voulez)
        {
            correctAnswer: 'chat',
            audioFile: 'Chat.mp3', // Placez ce fichier dans le dossier "audio"
            imageFile: 'Chat.jpg'  // Placez ce fichier dans le dossier "images"
        },
        {
            correctAnswer: 'cheval',
            audioFile: 'Cheval.mp3',
            imageFile: 'Cheval.jpg'
        },
        {
            correctAnswer: 'chevre',
            audioFile: 'Chevre.mp3',
            imageFile: 'Chevre.jpg'
        },
        {
            correctAnswer: 'cochon d\'inde',
            audioFile: 'Cochon_d_inde.mp3',
            imageFile: 'Cochon_d_inde.jpg'
        },
        {
            correctAnswer: 'dindon',
            audioFile: 'Dindon.mp3',
            imageFile: 'Dindon.jpg'
        },
        {
            correctAnswer: 'hyène',
            audioFile: 'Hyène.mp3',
            imageFile: 'Hyène.jpg'
        },
        {
            correctAnswer: 'paon',
            audioFile: 'Paon.mp3',
            imageFile: 'Paon.jpg'
        }
        // Ajoutez d'autres animaux...
    ];

    // Références aux éléments du DOM
    const quizActive = document.getElementById('quiz-active');
    const quizEndScreen = document.getElementById('quiz-end-screen');
    const questionCounter = document.getElementById('question-counter');
    const audioPlayer = document.getElementById('audio-player');
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-button');
    const feedbackText = document.getElementById('feedback-text');
    const animalReveal = document.getElementById('animal-reveal');
    const finalScoreDisplay = document.getElementById('final-score-display');

    let currentQuestionIndex = 0;
    let score = 0;

    function loadQuestion() {
        if (currentQuestionIndex >= quizData.length) {
            endQuiz();
            return;
        }

        // Reset UI
        feedbackText.textContent = '';
        feedbackText.className = '';
        answerInput.value = '';
        answerInput.disabled = false;
        submitButton.disabled = false;
        animalReveal.style.display = 'none'; // Cache l'image
        animalReveal.src = '';

        const currentQuestion = quizData[currentQuestionIndex];
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} / ${quizData.length}`;
        audioPlayer.src = `audio/${currentQuestion.audioFile}`;
    }

    function handleSubmit() {
        const userAnswer = answerInput.value.toLowerCase().trim();
        if (!userAnswer) return; // Ne rien faire si vide

        const currentQuestion = quizData[currentQuestionIndex];

        // Vérification simple (peut être améliorée avec une liste de synonymes si besoin)
        // Pour l'instant on compare strictement (en minuscule)
        // Vous pouvez changer la logique si "correctAnswer" devient un tableau de réponses acceptées
        const isCorrect = (userAnswer === currentQuestion.correctAnswer.toLowerCase());

        answerInput.disabled = true;
        submitButton.disabled = true;

        // Affiche l'image réponse
        // animalReveal.src = `images/${currentQuestion.imageFile}`;
        // animalReveal.style.display = 'block'; // Affiche l'image

        if (isCorrect) {
            score++;
            feedbackText.textContent = "Bravo ! C'est bien ça.";
            feedbackText.className = 'feedback-correct'; // Assurez-vous d'avoir ce style dans CSS
            feedbackText.style.color = 'green';
        } else {
            const hint = currentQuestion.correctAnswer.charAt(0).toUpperCase() + "...";
            feedbackText.textContent = `Dommage ! C'était un ${hint}`;
            feedbackText.className = 'feedback-incorrect';
            feedbackText.style.color = 'red';
        }

        // On attend un peu plus longtemps pour laisser le temps de voir l'image (4 secondes)
        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 2500);
    }

    function endQuiz() {
        quizActive.classList.add('hidden');
        quizActive.style.display = 'none'; // Sécurité
        quizEndScreen.classList.remove('hidden');
        quizEndScreen.style.display = 'block';

        // Calcul du score sur 20
        const finalScore = quizData.length > 0 ? Math.round((score / quizData.length) * 20) : 0;
        finalScoreDisplay.textContent = finalScore;

        // Sauvegarde dans le localStorage
        try {
            const gameState = JSON.parse(localStorage.getItem('weddingGameData')) || {};
            gameState.biologie = finalScore;
            localStorage.setItem('weddingGameData', JSON.stringify(gameState));
        } catch (e) {
            console.error("Erreur sauvegarde score", e);
        }
    }

    // Listeners
    submitButton.addEventListener('click', handleSubmit);

    answerInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    });

    // Chargement initial
    loadQuestion();
});
