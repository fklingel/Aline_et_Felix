// configuration des questions
// Format: { image: "chemin/vers/image.jpg", text: "Description...", coords: [lat, lon] }

const questions = [
    {
        image: "images/geo/vacances_ski.jpg", // Exemple
        text: "Nos premières vacances au ski ensemble. C'était dans les Alpes, mais où exactement ?",
        coords: [45.9237, 6.8694] // Chamonix (Exemple)
    },
    {
        image: "images/geo/plage_ete.jpg",
        text: "Un coucher de soleil mémorable sur cette plage bretonne.",
        coords: [48.6500, -2.0167] // Saint-Malo (Exemple)
    },
    {
        image: "images/geo/restaurant_paris.jpg",
        text: "Le restaurant de notre premier anniversaire.",
        coords: [48.8566, 2.3522] // Paris (Exemple)
    },
    // Ajoutez vos questions ici. Copiez-collez le bloc {} et modifiez les valeurs.
    // Vous pouvez récupérer les coordonnées sur Google Maps (clic droit > plus d'infos).
];

// Nombre de questions à jouer par partie
const QUESTIONS_PER_GAME = 10;
