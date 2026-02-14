# Guide d'installation : Réception des RSVP vers Google Sheets

Pour que le formulaire fonctionne, nous allons utiliser un script Google gratuit qui recevra les données et les mettra dans un tableau.

## Étape 1 : Créer la Google Sheet
1. Allez sur [Google Sheets](https://sheets.google.com) et créez une nouvelle feuille vide.
2. Nommez-la "RSVP Mariage Aline & Felix" (ou ce que vous voulez).
3. **IMPORTANT** : La première ligne doit contenir les en-têtes exacts qui correspondent aux "name" dans le HTML. Copiez-collez ceci dans la première ligne (A1, B1, C1, etc.) :

   | A | B | C | D | E | F | G | H | I |
   |---|---|---|---|---|---|---|---|---|
   | timestamp | names | mairie | reception | brunch | dimanche_soir | hebergement | enfants | comments |

## Étape 2 : Créer le Script
1. Dans votre Google Sheet, cliquez sur **Extensions** > **Apps Script**.
2. Une nouvelle fenêtre s'ouvre. Supprimez tout le code présent dans `Code.gs` et remplacez-le par ceci :

```javascript
/*
  Script pour recevoir des données de formulaire et les ajouter à Google Sheets.
*/

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // Verrouillage pour éviter les conflits d'écriture simultanés
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;
    var newRow = [];
    
    // On parse les données reçues
    var postData = JSON.parse(e.postData.contents);

    // Pour chaque en-tête, on cherche la valeur correspondante dans les données
    headers.forEach(function(header) {
      newRow.push(postData[header] || ''); // Si pas de donnée, on met vide
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    lock.releaseLock();
  }
}
```

3. Cliquez sur l'icône de disquette pour **Enregistrer** (Nommez le projet "Script RSVP").

## Étape 3 : Déployer le Script
1. Cliquez sur le bouton bleu **Déployer** (en haut à droite) > **Nouveau déploiement**.
2. À gauche de la fenêtre qui s'ouvre, cliquez sur la roue dentée et choisissez **Application Web**.
3. Remplissez les champs :
   - **Description** : "Version 1"
   - **Exécuter en tant que** : "Moi" (votre adresse email)
   - **Qui peut accéder** : **Tout le monde** (C'est très important pour que le site puisse envoyer des données sans que les invités n'aient besoin de compte Google).
4. Cliquez sur **Déployer**.
5. Google vous demandera d'autoriser l'accès. Cliquez sur "Autoriser l'accès", choisissez votre compte.
   - *Note : Google affichera peut-être une alerte "Google n'a pas validé cette application". Cliquez sur "Paramètres avancés" (en petit) puis "Accéder à Script RSVP (non sécurisé)". C'est normal car c'est votre propre script.*
6. Copiez l'URL de l'application Web (elle ressemble à `https://script.google.com/macros/s/AKfycbx.../exec`).

## Étape 4 : Mettre l'URL dans le site
1. Ouvrez le fichier `rsvp.js` sur votre ordinateur.
2. À la ligne qui commence par `const GOOGLE_SCRIPT_URL = ...`, remplacez `'VOTRE_URL_GOOGLE_SCRIPT_ICI'` par l'URL que vous venez de copier, entre les guillemets.
3. Sauvegardez le fichier.

**C'est fini !** Ouvrez `rsvp.html` dans votre navigateur, remplissez le formulaire et validez. La ligne devrait apparaître magiquement dans votre Google Sheet quelques secondes plus tard.
