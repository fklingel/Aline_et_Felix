document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rsvp-form');
    const loadingIndicator = document.getElementById('loading-indicator');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const retryBtn = document.getElementById('retry-btn');

    // Éléments pour la gestion dynamique des invités
    const guestsContainer = document.getElementById('guests-container');
    const addGuestBtn = document.getElementById('add-guest-btn');
    const aggregatedNamesInput = document.getElementById('names-aggregated');

    let guestCount = 1; // On commence à 1 car il y a déjà un champ

    // URL du script Google Apps (sera remplacé par l'utilisateur)
    // TODO: Remplacer cette URL par celle de votre script déployé
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyDGqrfV95NmjxWpA2od9tU10L0qHf2alFxSDkQrBtP_7Y2BVIZBYn-amUWMycx_rVjvA/exec';

    // --- Gestion des invités dynamiques ---

    if (addGuestBtn && guestsContainer) {
        addGuestBtn.addEventListener('click', () => {
            const newIndex = guestCount;

            const newGuestEntry = document.createElement('div');
            newGuestEntry.className = 'guest-entry';
            newGuestEntry.dataset.index = newIndex;

            newGuestEntry.innerHTML = `
                <div class="form-group">
                    <label for="name-${newIndex}">Nom et Prénom</label>
                    <input type="text" id="name-${newIndex}" name="guest_name_${newIndex}" placeholder="Ex: Invité ${newIndex + 1}" required>
                </div>
                <button type="button" class="remove-guest-btn" aria-label="Supprimer cette personne">&times;</button>
            `;

            guestsContainer.appendChild(newGuestEntry);

            // Ajout du listener pour le bouton supprimer
            const removeBtn = newGuestEntry.querySelector('.remove-guest-btn');
            removeBtn.addEventListener('click', () => {
                newGuestEntry.remove();
            });

            guestCount++;
        });
    }

    // --- Fonctions d'état ---

    function showLoading() {
        form.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    }

    function showSuccess() {
        loadingIndicator.classList.add('hidden');
        successMessage.classList.remove('hidden');
        localStorage.setItem('rsvp_completed', 'true');
    }

    function showError() {
        loadingIndicator.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }

    function showForm() {
        errorMessage.classList.add('hidden');
        form.classList.remove('hidden');
    }

    // --- Soumission du formulaire ---

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Agrégation des noms
        const nameInputs = document.querySelectorAll('input[name^="guest_name_"]');
        const namesList = Array.from(nameInputs).map(input => input.value.trim()).filter(val => val !== '');

        if (namesList.length === 0) {
            alert("Veuillez entrer au moins un nom.");
            return;
        }

        if (aggregatedNamesInput) {
            aggregatedNamesInput.value = namesList.join(', ');
        }

        // 2. Vérification de l'URL Google Script
        if (GOOGLE_SCRIPT_URL === 'VOTRE_URL_GOOGLE_SCRIPT_ICI') {
            alert("L'URL du script Google n'a pas été configurée. Veuillez suivre le fichier GUIDE_RSVP.md.");
            // Pour le débug, on log les données
            // console.log("Données qui seraient envoyées:", Object.fromEntries(new FormData(form)));
            return;
        }

        showLoading();

        // 3. Préparation des données
        const formData = new FormData(form);
        const data = {};

        // On remplit l'objet data 
        formData.forEach((value, key) => {
            // On ignore les champs individuels pour ne garder que 'names' qui contient la liste
            if (!key.startsWith('guest_name_')) {
                data[key] = value;
            }
        });

        // On s'assure que names est bien rempli si le hidden input a échoué
        if (!data.names) {
            data.names = namesList.join(', ');
        }

        // Ajout d'une date d'envoi
        data.timestamp = new Date().toISOString();

        // 4. Envoi vers Google Script
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important pour éviter les erreurs CORS avec Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(() => {
                // Avec mode: 'no-cors', on ne peut pas lire la réponse, 
                // mais si on arrive ici c'est que la requête est partie.
                showSuccess();
            })
            .catch((error) => {
                console.error('Erreur:', error);
                showError();
            });
    });

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            showForm();
        });
    }
});
