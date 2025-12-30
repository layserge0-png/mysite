DeepSeek - Déploiement rapide

Fichiers à placer sur le serveur (même dossier) :

- `deepseek_javascript_20251230_f590fb.js`  (serveur Express principal)
- `package.json` (optionnel, si tu en as déjà un; sinon le script d'installation en crée un)
- `deepseek_html_20251230_e95165 (1).html` (page d'erreur servie par la racine)
- `install-deps.ps1` (script PowerShell pour installer les dépendances)
- `start-server.ps1` (script PowerShell pour démarrer le serveur en arrière-plan)
- `client_example_send_location.html` (optionnel : page cliente exemple pour envoyer la géoloc)

Prérequis
- Node.js (version 18+ recommandée) et npm installés sur le serveur.

Installation (Windows PowerShell)

1. Ouvre PowerShell et place-toi dans le dossier où tu as mis les fichiers :

    cd 'C:\chemin\vers\ton\dossier'

2. Lancer le script d'installation (exécute une seule fois) :

    .\install-deps.ps1

Ce script :
- crée un `package.json` si absent
- installe `express` et `cors`

3. Démarrer le serveur

    .\start-server.ps1

Accéder aux pages
- Page principale (sera la page d'erreur) : http://localhost:3000
- Page /view (visualisation des positions) : http://localhost:3000/view

Notes utiles
- Si tes clients (pages qui envoient la géoloc) sont sur un autre domaine/port, active CORS (le script installe `cors` et le serveur peut être modifié pour l'utiliser).
- Pour que la géolocalisation fonctionne sur un vrai navigateur, la page cliente doit être servie via HTTPS (ou en local `http://localhost`).
- Les positions sont actuellement stockées en mémoire ; pour persister entre redémarrages il faut ajouter de la persistance (fichier/BD).

Support
Si tu veux, je peux modifier le serveur pour :
- activer automatiquement CORS
- persister les positions dans un fichier JSON
- ajouter un bouton sur `/view` pour envoyer une géoloc de test
