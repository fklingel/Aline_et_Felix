// geographie.js - Logique du jeu de géographie

let currentQuestionIndex = 0;
let score = 0;
let totalScore = 0;
let map;
let marker; // Marqueur du joueur
let correctMarker; // Marqueur de la bonne réponse
let polyline; // Ligne entre les deux
let gameQuestions = [];
let userGuessed = false;

// Configuration de la carte
const MAP_DEFAULT_CENTER = [46.603354, 1.888334]; // Centre de la France
const MAP_DEFAULT_ZOOM = 5;

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    // Initialiser la carte
    map = L.map('map').setView(MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', onMapClick);

    // Charger les questions (mélanger si besoin, ici on prend les premières)
    // On pourrait mélanger avec : gameQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
    gameQuestions = questions.slice(0, 10);

    // Afficher la première question
    loadQuestion(0);
}

function loadQuestion(index) {
    if (index >= gameQuestions.length) {
        endGame();
        return;
    }

    const question = gameQuestions[index];

    // Reset UI
    document.getElementById('question-image').src = question.image;
    document.getElementById('question-text').textContent = question.text;
    document.getElementById('feedback-text').textContent = "";
    document.getElementById('validate-btn').disabled = true;
    document.getElementById('validate-btn').style.display = 'inline-block'; // Réafficher le bouton valider
    document.getElementById('next-btn').style.display = 'none';

    // Reset Map State
    if (marker) map.removeLayer(marker);
    if (correctMarker) map.removeLayer(correctMarker);
    if (polyline) map.removeLayer(polyline);
    map.setView(MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM);
    marker = null;
    userGuessed = false;

    // Mettre à jour la progression
    document.getElementById('question-count').textContent = `Question ${index + 1} / ${gameQuestions.length}`;
}

function onMapClick(e) {
    if (userGuessed) return; // Empêcher de changer après validation

    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        marker = L.marker(e.latlng).addTo(map);
    }

    document.getElementById('validate-btn').disabled = false;
}

function validateAnswer() {
    if (!marker) return;

    userGuessed = true;
    document.getElementById('validate-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'inline-block';

    const question = gameQuestions[currentQuestionIndex];
    const correctLatLng = L.latLng(question.coords[0], question.coords[1]);
    const userLatLng = marker.getLatLng();

    // Distance en km
    const distance = userLatLng.distanceTo(correctLatLng) / 1000;

    // Calcul du score (Exemple: 5000 points max, décroit avec la distance)
    // 0km -> 5000 pts
    // > 2000km -> 0 pts
    let points = Math.max(0, 5000 - Math.round(distance * 2.5)); // Ajustable

    // Bonus precision extrême (< 20km)
    if (distance < 20) points = 5000;

    score = points;
    totalScore += points;

    // Affichage résultat
    const feedback = document.getElementById('feedback-text');
    feedback.innerHTML = `Distance: <strong>${Math.round(distance)} km</strong> - Score: <strong>${points} pts</strong>`;

    // Afficher la bonne réponse
    correctMarker = L.marker(correctLatLng, {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map);

    // Trait entre les deux
    polyline = L.polyline([userLatLng, correctLatLng], { color: 'red', dashArray: '5, 10' }).addTo(map);

    // Zoomer pour voir les deux points
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    // Mettre à jour le score total affiché
    document.getElementById('score-display').textContent = `Score Total: ${totalScore}`;
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex);
}

function endGame() {
    // Sauvegarder le score pour le tableau de bord principal
    // Score sur 20 based on 50000 max score
    const scoreOn20 = Math.round((totalScore / 50000) * 20);

    // Récupérer les données existantes
    let gameState = JSON.parse(localStorage.getItem('weddingGameData')) || {};

    // Mettre à jour si meilleur score ou si pas encore fait
    // On garde la meilleure note si on rejoue ? Ou la dernière ? 
    // Généralement on garde la meilleure.
    const currentScore = gameState['geographie'];
    if (currentScore === null || scoreOn20 > currentScore) {
        gameState['geographie'] = scoreOn20;
        localStorage.setItem('weddingGameData', JSON.stringify(gameState));
    }

    const container = document.querySelector('.geo-container');
    container.innerHTML = `
        <div class="final-screen">
            <h1>Bravo !</h1>
            <p>Vous avez terminé l'épreuve de géographie.</p>
            <div class="final-score-large">${scoreOn20} / 20</div>
            <p>Votre connaissance de nos aventures est impressionnante !</p>
            <a href="jeu.html" class="back-button">Retour aux jeux</a>
        </div>
    `;
}
