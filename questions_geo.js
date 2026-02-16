// configuration des questions
// Format: { image: "chemin/vers/image.jpg", text: "Description...", coords: [lat, lon] }

const questions = [
    {
        image: "images/geo/amsterdam.jpg",
        text: "",
        coords: [52.372189, 4.888475]
    },
    {
        image: "images/geo/vb.jpg",
        text: "Lieu de notre rencontre et de nos fiançailles.",
        coords: [46.902294, -0.297276]
    },
    {
        image: "images/geo/cinq.jpg",
        text: "",
        coords: [44.107363, 9.725592]
    },
    {
        image: "images/geo/dubrovnik.jpg",
        text: "",
        coords: [42.641293, 18.109321]
    },
    {
        image: "images/geo/islande.jpg",
        text: "",
        coords: [64.050179, -16.178718]
    },
    {
        image: "images/geo/cape.jpg",
        text: "",
        coords: [-33.906081, 18.421040]
    },
    {
        image: "images/geo/londres.jpg",
        text: "",
        coords: [51.507351, -0.127758]
    },
    // Ajoutez vos questions ici. Copiez-collez le bloc {} et modifiez les valeurs.
    // Vous pouvez récupérer les coordonnées sur Google Maps (clic droit > plus d'infos).
];

// Nombre de questions à jouer par partie
const QUESTIONS_PER_GAME = 10;
