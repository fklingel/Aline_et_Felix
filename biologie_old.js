document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Game script loaded');

    const quizData = [
        {
            animalImage: 'images/animaux/pimousse.png',
            name: 'Pimousse',
            correctOwner: 'both',
            realPhoto: 'images/animaux/aline_pimousse.png'
        },
    ];

    console.log('🔍 Looking for DOM elements...');
    
    const questionCounter = document.getElementById('question-counter');
    const animalImageEl = document.getElementById('animal-image');
    const animalSourceEl = document.getElementById('animal-source');
    const dropZones = document.querySelectorAll('.owner-zone');
    const feedbackOverlay = document.getElementById('feedback-overlay');
    const feedbackTitle = document.getElementById('feedback-title');
    const realPhoto = document.getElementById('real-photo');
    const quizActive = document.getElementById('quiz-active');
    const quizEndScreen = document.getElementById('quiz-end-screen');
    const finalScoreDisplay = document.getElementById('final-score-display');
    const animalNameEl = document.getElementById('animal-name');
    
    if (feedbackOverlay) {
        feedbackOverlay.classList.add('hidden');
        feedbackOverlay.style.display = 'none';
        console.log('🚫 Feedback overlay forcibly hidden at start');
    }

    if (!animalImageEl || !animalSourceEl || dropZones.length === 0) {
        console.error('❌ Critical elements missing! Check your HTML structure.');
        return;
    }

    let currentQuestionIndex = 0;
    let score = 0;
    let questionProcessed = false;
    let isDragging = false; // Le drapeau qui empêche le bug

    function loadQuestion() {
        if (currentQuestionIndex >= quizData.length) {
            endQuiz();
            return;
        }
        
        const currentQuestion = quizData[currentQuestionIndex];
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} / ${quizData.length}`;
        animalNameEl.textContent = currentQuestion.name;
        animalImageEl.src = currentQuestion.animalImage;
        questionProcessed = false;
    }

    function handleDrop(event) {
        console.log('🎯 DROP EVENT TRIGGERED!');
        if (questionProcessed) return;
        
        // CHANGEMENT 1 : On trouve le parent .owner-zone pour récupérer l'ID
        const targetZone = event.to.closest('.owner-zone');
        if (!targetZone) return; // Sécurité si on ne trouve pas le parent

        const droppedElement = event.item;
        questionProcessed = true;
        
        const correctOwner = quizData[currentQuestionIndex].correctOwner;
        let isCorrect = (targetZone.id === correctOwner);

        setTimeout(() => animalSourceEl.appendChild(droppedElement), 100);
        
        if (isCorrect) score++;

        showFeedback(isCorrect);

        setTimeout(() => {
            if (feedbackOverlay) {
                feedbackOverlay.classList.add('hidden');
                feedbackOverlay.style.display = 'none';
            }
            currentQuestionIndex++;
            loadQuestion();
        }, 3000);
    }

    function showFeedback(isCorrect) {
        if (!feedbackOverlay) return;
        
        const currentQuestion = quizData[currentQuestionIndex];
        realPhoto.src = currentQuestion.realPhoto;
        feedbackTitle.textContent = isCorrect ? "Bien joué !" : "Oups, mauvais propriétaire !";
        feedbackOverlay.classList.remove('hidden');
        feedbackOverlay.style.display = 'flex';
    }

    function endQuiz() {
        quizActive.classList.add('hidden');
        quizEndScreen.classList.remove('hidden');
        const finalScore = quizData.length > 0 ? Math.round((score / quizData.length) * 20) : 0;
        finalScoreDisplay.textContent = `${finalScore} / 20`;
        
        try {
            const gameState = JSON.parse(localStorage.getItem('weddingGameData')) || {};
            gameState.biologie = finalScore;
            localStorage.setItem('weddingGameData', JSON.stringify(gameState));
        } catch (e) {
            console.log('⚠️ Could not save to localStorage:', e);
        }
    }

    if (typeof Sortable === 'undefined') {
        console.error('❌ SortableJS not loaded!');
        return;
    }

    new Sortable(animalSourceEl, {
        group: 'biologie-quiz',
        animation: 150,
        sort: false,
        onStart: () => { isDragging = true; },
    });
    
    // CHANGEMENT 2 : On cible le nouveau .owner-photo-container pour le dépôt
    dropZones.forEach(zone => {
        const photoContainer = zone.querySelector('.owner-photo-container');
        if (photoContainer) {
            new Sortable(photoContainer, {
                group: 'biologie-quiz',
                animation: 150,
                sort: false,
                onAdd: (evt) => {
                    // On garde votre logique : on ne traite que les vrais "drags"
                    if (isDragging) {
                        handleDrop(evt);
                        isDragging = false;
                    }
                },
            });
        }
    });

    loadQuestion();
});