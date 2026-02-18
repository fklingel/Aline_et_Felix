// secure.js - Vérifie si l'utilisateur a le droit d'accéder à la page
(function () {
    // 1. Récupérer les données
    const gameState = JSON.parse(localStorage.getItem('weddingGameData'));
    const scoreNeeded = typeof MIN_SCORE !== 'undefined' ? MIN_SCORE : 20; // Par défaut bloque tout si pas défini

    let isAuthorized = false;

    if (gameState) {
        const MATIERES = ['histoire', 'geographie', 'maths', 'biologie', 'musique', 'sport'];
        let completedCount = 0;
        let totalScore = 0;

        // Calcul de la moyenne recalculée (pour éviter la triche simple via URL)
        MATIERES.forEach(matiere => {
            if (gameState[matiere] !== null) {
                completedCount++;
                totalScore += parseFloat(gameState[matiere]);
            }
        });

        if (completedCount === MATIERES.length) {
            const average = totalScore / MATIERES.length;
            if (average >= scoreNeeded) {
                isAuthorized = true;
            }
        }
    }

    // 2. Redirection si non autorisé
    if (!isAuthorized) {
        console.warn("Accès refusé : Score insuffisant (" + scoreNeeded + " requis)");
        window.location.href = 'prison.html';
    }
})();
