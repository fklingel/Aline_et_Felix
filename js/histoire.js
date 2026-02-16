// histoire.js

let timeline = [];
let deck = [];
let currentCard = null;
let gameFinished = false;

// Variables pour le Drag & Drop
let dragSrcType = null; // 'new' ou 'timeline'
let dragSrcIndex = null; // Index dans la timeline si 'timeline'

// Variables Touch DnD
let touchDragEl = null; // L'élément ghost
let touchSrcEl = null;  // L'élément source original

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    let allCards = [...questions];
    // Mélange
    for (let i = allCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }

    // Vide au départ
    timeline = [];
    deck = allCards;

    // Configurer la zone de drop (timeline)
    setupTimelineDropZone();

    drawNextCard();
    renderTimeline();
}

function drawNextCard() {
    if (deck.length === 0) {
        currentCard = null;
        renderCurrentCard();
        checkEndGame();
        return;
    }
    currentCard = deck.pop();
    renderCurrentCard();
}

function renderCurrentCard() {
    const container = document.getElementById('current-card-container');
    if (!currentCard) {
        container.innerHTML = '';
        return;
    }

    // Carte draggable
    container.innerHTML = `
        <div class="card-to-place" draggable="true" id="new-card-draggable">
            <img src="${currentCard.image}" onerror="this.src='https://placehold.co/400x300?text=Image'">
            <div class="card-title" style="font-size: 1.2rem; font-weight: bold; margin-top: 10px;">${currentCard.title}</div>
            <div class="card-description">${currentCard.description}</div>
        </div>
    `;

    const el = document.getElementById('new-card-draggable');
    addStandardDnD(el, 'new');
    addTouchDnD(el, 'new');
}

function renderTimeline(lisIndices = []) {
    const timelineContainer = document.getElementById('timeline-container');

    // Ne pas vider s'il y a des enfants déjà (optimisation possible), mais ici on reset tout pour simplifier
    timelineContainer.innerHTML = '';

    if (timeline.length === 0) {
        timelineContainer.innerHTML = '<div class="empty-message">Déposez votre première carte ici !</div>';
        return;
    }

    timeline.forEach((card, index) => {
        let isCorrect = false;
        if (gameFinished) {
            isCorrect = lisIndices.includes(index);
        }

        const cardElement = createTimelineCardElement(card, index, isCorrect);
        timelineContainer.appendChild(cardElement);
    });
}

function createTimelineCardElement(card, index, isCorrectForDisplay = false) {
    const el = document.createElement('div');
    el.className = 'timeline-card';
    el.setAttribute('draggable', !gameFinished);
    el.dataset.index = index;

    let dateHtml = '';
    if (gameFinished) {
        el.classList.add('revealed');
        dateHtml = `<div class="card-date" style="display:block">${formatDate(card.date)}</div>`;

        if (isCorrectForDisplay) {
            el.classList.add('correct');
        } else {
            el.classList.add('incorrect');
        }
    }

    el.innerHTML = `
        <img src="${card.image}" onerror="this.src='https://placehold.co/200x150?text=Image'">
        <div class="card-title">${card.title}</div>
        ${dateHtml}
    `;

    if (!gameFinished) {
        addStandardDnD(el, 'timeline');
        addTouchDnD(el, 'timeline');
    }

    return el;
}

// --- Standard HTML5 Drag & Drop ---

function addStandardDnD(el, type) {
    el.addEventListener('dragstart', (e) => {
        dragSrcType = type;
        if (type === 'timeline') dragSrcIndex = parseInt(el.dataset.index);

        e.dataTransfer.effectAllowed = 'move';
        el.style.opacity = '0.4';
    });

    el.addEventListener('dragend', (e) => {
        el.style.opacity = '1';
    });
}

function setupTimelineDropZone() {
    const timelineContainer = document.getElementById('timeline-container');

    timelineContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(timelineContainer, e.clientX);
    });

    timelineContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        handleDropAction(e.clientX);
    });
}

function handleDropAction(clientX) {
    const timelineContainer = document.getElementById('timeline-container');
    const afterElement = getDragAfterElement(timelineContainer, clientX);

    let targetIndex;
    if (afterElement == null) {
        targetIndex = timeline.length;
    } else {
        targetIndex = parseInt(afterElement.dataset.index);
    }

    if (dragSrcType === 'new') {
        timeline.splice(targetIndex, 0, currentCard);
        drawNextCard();
    } else if (dragSrcType === 'timeline') {
        const item = timeline[dragSrcIndex];

        let finalIndex = targetIndex;
        if (dragSrcIndex < targetIndex) {
            finalIndex--;
        }

        timeline.splice(dragSrcIndex, 1);
        timeline.splice(finalIndex, 0, item);
    }

    renderTimeline();
}


function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.timeline-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


// --- Touch Event Handlers (Mobile) ---

function addTouchDnD(el, type) {
    el.addEventListener('touchstart', (e) => handleTouchStart(e, el, type), { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);
}

function handleTouchStart(e, el, type) {
    if (gameFinished) return;

    // Prevent scrolling
    e.preventDefault();

    const touch = e.touches[0];
    dragSrcType = type;
    touchSrcEl = el;

    if (type === 'timeline') {
        dragSrcIndex = parseInt(el.dataset.index);
    }

    // Create Ghost Card
    touchDragEl = el.cloneNode(true);
    touchDragEl.classList.add('ghost-card');
    touchDragEl.style.width = '150px'; // Force smaller size

    // Remove IDs to avoid duplicates
    touchDragEl.removeAttribute('id');

    document.body.appendChild(touchDragEl);

    updateGhostPosition(touch.clientX, touch.clientY);

    // Visual feedback on source
    el.style.opacity = '0.5';
}

function handleTouchMove(e) {
    if (!touchDragEl) return;
    e.preventDefault(); // Stop scrolling

    const touch = e.touches[0];
    updateGhostPosition(touch.clientX, touch.clientY);

    // Auto-scroll timeline
    autoScrollTimeline(touch.clientX);
}

function handleTouchEnd(e) {
    if (!touchDragEl) return;

    // Get drop position from the last touch coordinate
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

    // Check if dropped near timeline
    const timelineArea = document.querySelector('.timeline-area');
    const timelineRect = timelineArea.getBoundingClientRect();

    // Check collision simple
    const isOverTimeline = (
        touch.clientX >= timelineRect.left &&
        touch.clientX <= timelineRect.right &&
        touch.clientY >= timelineRect.top &&
        touch.clientY <= timelineRect.bottom
    );

    if (isOverTimeline) {
        handleDropAction(touch.clientX);
    }

    // Cleanup
    document.body.removeChild(touchDragEl);
    touchDragEl = null;
    if (touchSrcEl) touchSrcEl.style.opacity = '1';
    touchSrcEl = null;
}

function updateGhostPosition(x, y) {
    if (touchDragEl) {
        touchDragEl.style.left = x + 'px';
        touchDragEl.style.top = y + 'px';
    }
}

function autoScrollTimeline(x) {
    const timelineArea = document.querySelector('.timeline-area');
    const rect = timelineArea.getBoundingClientRect();
    const threshold = 50; // pixels from edge

    if (x < rect.left + threshold) {
        timelineArea.scrollLeft -= 5;
    } else if (x > rect.right - threshold) {
        timelineArea.scrollLeft += 5;
    }
}


// --- Validation ---

function checkEndGame() {
    if (!currentCard && deck.length === 0) {
        const btnContainer = document.getElementById('validate-container');
        if (btnContainer) btnContainer.style.display = 'block';
        document.querySelector('.current-card-area').innerHTML = "<p>Frise complète ! Vérifiez l'ordre et validez.</p>";
    }
}

function validateTimeline() {
    gameFinished = true;
    document.getElementById('validate-container').style.display = 'none';

    if (timeline.length === 0) {
        showFinalScreen(0);
        return;
    }

    const n = timeline.length;
    const dp = new Array(n).fill(1);
    const prev = new Array(n).fill(-1);

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (new Date(timeline[i].date) >= new Date(timeline[j].date)) {
                if (dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    prev[i] = j;
                }
            }
        }
    }

    let maxLen = 0;
    let endIndex = -1;
    for (let i = 0; i < n; i++) {
        if (dp[i] > maxLen) {
            maxLen = dp[i];
            endIndex = i;
        }
    }

    const lisIndices = [];
    let curr = endIndex;
    while (curr !== -1) {
        lisIndices.push(curr);
        curr = prev[curr];
    }

    renderTimeline(lisIndices);

    const finalScore = Math.round((maxLen / timeline.length) * 20);
    saveScore(finalScore);

    showFinalScreen(finalScore);
}

function showFinalScreen(score) {
    const overlay = document.getElementById('feedback-overlay');
    overlay.innerHTML = `
        <div class="feedback-content" style="background:white; padding:40px; border-radius:20px; text-align:center;">
             <h1 style="color:#5a4e49; font-family:'Dancing Script'; font-size:3rem; margin:0;">Terminé !</h1>
             <p style="font-size:1.2rem; margin:20px 0;">Votre score :</p>
             <div style="font-size:4rem; color:#E91E63; font-weight:bold; margin-bottom:20px;">${score} / 20</div>
             <button onclick="document.getElementById('feedback-overlay').style.display='none'" style="padding:10px 20px; font-size:1.2rem; cursor:pointer; background:#4CAF50; color:white; border:none; border-radius:50px;">Voir la correction</button>
             <br><br>
             <a href="jeu.html" style="text-decoration:underline; color:#666;">Retour au menu</a>
        </div>
    `;
    overlay.style.display = 'flex';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function saveScore(score) {
    let gameState = JSON.parse(localStorage.getItem('weddingGameData')) || {};
    const currentScore = gameState['histoire'];

    if (currentScore === null || score > currentScore) {
        gameState['histoire'] = score;
        localStorage.setItem('weddingGameData', JSON.stringify(gameState));
    }
}
