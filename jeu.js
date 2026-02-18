// Attend que toute la page HTML soit chargée avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {

    // La liste de nos matières, pour ne pas faire d'erreur de frappe
    const MATIERES = ['histoire', 'geographie', 'maths', 'biologie', 'musique', 'sport'];

    // 1. Initialiser ou récupérer l'état du jeu
    let gameState = JSON.parse(localStorage.getItem('weddingGameData'));

    if (!gameState) {
        // Si le joueur n'a jamais joué, on crée un objet de sauvegarde vide
        gameState = {};
        MATIERES.forEach(matiere => {
            gameState[matiere] = null; // null signifie "pas encore fait"
        });
        localStorage.setItem('weddingGameData', JSON.stringify(gameState));
    }

    // 2. Fonction pour mettre à jour tout l'affichage
    function updateDashboard() {
        let completedCount = 0;
        let totalScore = 0;

        // --- SYNCHRONISATION SPORT ---
        // On recalcule la note de sport à la volée depuis les High Scores pour être sûr qu'elle est à jour
        const alineScores = JSON.parse(localStorage.getItem('aquaRythmeScores'));
        const felixScores = JSON.parse(localStorage.getItem('alpinHighScores'));

        // Si l'un des jeux a été joué (les scores existent)
        if (alineScores || felixScores) {
            const bestAline = alineScores && alineScores.length > 0 ? Math.max(...alineScores) : 0;
            const bestFelix = felixScores && felixScores.length > 0 ? Math.max(...felixScores) : 0;

            // Calcul Note : (Score / 1000) plafonné à 10. Total / 20.
            const gradeAline = Math.min(10, bestAline / 1000);
            const gradeFelix = Math.min(10, bestFelix / 1000);
            const totalSport = parseFloat((gradeAline + gradeFelix).toFixed(1));

            // Mise à jour de l'état global
            gameState['sport'] = totalSport;
            localStorage.setItem('weddingGameData', JSON.stringify(gameState));
        }

        // Mise à jour des cartes de matières
        MATIERES.forEach(matiere => {
            const score = gameState[matiere];
            const scoreElement = document.querySelector(`.score[data-subject="${matiere}"]`);

            if (score !== null) {
                scoreElement.textContent = `${score} / 20`;
                completedCount++;
                totalScore += score;
            } else {
                scoreElement.textContent = "- / 20";
            }
        });

        // Mise à jour du bilan
        document.getElementById('completed-count').textContent = `${completedCount} / ${MATIERES.length}`;

        if (completedCount > 0) {
            const average = (totalScore / completedCount).toFixed(2); // Moyenne avec 2 décimales
            document.getElementById('average-score').textContent = `${average} / 20`;
        } else {
            document.getElementById('average-score').textContent = "-- / 20";
        }

        // Mise à jour de la remarque finale
        const remarkElement = document.getElementById('final-remark');
        if (completedCount === MATIERES.length) {
            const finalAverage = parseFloat(document.getElementById('average-score').textContent);
            let remark = "";
            if (finalAverage < 10) {
                remark = "Mention 'Peut mieux faire' ! On vous attend au rattrapage au vin d'honneur !";
            } else if (finalAverage < 14) {
                remark = "Mention 'Assez Bien' ! Vous avez bien suivi notre histoire.";
            } else if (finalAverage < 18) {
                remark = "Mention 'Très Bien' ! Vous faites partie des experts de notre couple !";
            } else {
                remark = "Mention 'Excellent' avec les félicitations du jury ! Impressionnant !";
            }
            remarkElement.textContent = remark;
            remarkElement.classList.remove('hidden');
        } else {
            remarkElement.textContent = "Terminez toutes les épreuves pour voir votre mention !";
            remarkElement.classList.add('hidden'); // On la cache si tout n'est pas fini
        }
    }

    // 3. Appel initial pour afficher les données dès l'arrivée sur la page
    updateDashboard();

});