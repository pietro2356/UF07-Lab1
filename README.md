# Laboratorio Pratico JavaScript: Fetch API, Stato e LocalStorage

**Corso:** UF07 – Programmazione WEB (AFP G. Marconi Rovereto)  
**Durata:** 3 Ore  
**API di riferimento:** [TheCatAPI](https://thecatapi.com/)

---

## Obiettivo del Laboratorio

Consolidare le competenze acquisite in JavaScript moderno realizzando una Web App interattiva che recupera dati reali da un'API esterna tramite `fetch` e `async/await`, manipola dinamicamente il DOM, filtra i risultati e gestisce lo stato dell'applicazione.

Per permettere a ciascuno di lavorare al proprio ritmo, il laboratorio è suddiviso in **tre livelli di difficoltà**. Scegli il livello più adatto alla tua preparazione attuale (puoi sempre passare al livello successivo se termini in anticipo).

---

## Panoramica dei Tre Livelli

| Livello | Titolo Progetto | Concetti Chiave | File di Partenza |
| :--- | :--- | :--- | :--- |
| **1. Facile** | *Pesca il tuo Gatto* | `fetch` singola, `createElement`, `classList.toggle`, `.filter()` base | `index.html` + `app.js` con scheletro `TODO` |
| **2. Intermedio** | *Galleria e Adozioni* | `fetch` multipla (`limit=6`), due array/gallerie, `.filter()`, `localStorage` | `index.html` pronto + `app.js` da scrivere |
| **3. Difficile** | *Gattile AFP* | Dati annidati (`breeds`), Adapter (`.map`), State Management, filtri a cascata, `localStorage` | Sviluppo autonomo completo (HTML/CSS/JS) |

---

## Dettaglio delle Tracce

### Livello 1 (Facile): "Pesca il tuo Gatto"

Ideale per consolidare le basi della chiamata asincrona e della manipolazione del DOM senza dover gestire la persistenza.

* **Endpoint:** `https://api.thecatapi.com/v1/images/search`
* **Funzionalità richieste:**
  * Scaricare un gatto casuale al click su **"Pesca un Gatto"** e aggiungerlo all'array principale.
  * Visualizzare le card con immagine e dimensioni (`width` x `height`).
  * Permettere di cliccare su una card per aggiungerla/rimuoverla dai preferiti (`classList.toggle`) aggiornando il contatore.
  * Filtrare i gatti con foto grandi (`width > 600`), mostrare tutti o svuotare la galleria.

### Livello 2 (Intermedio): "Galleria e Adozioni"

Ideale per esercitarsi nella gestione di due elenchi distinti e introdurre il salvataggio locale nel browser.

* **Endpoint:** `https://api.thecatapi.com/v1/images/search?limit=6`
* **Funzionalità richieste:**
  * Scaricare 6 gatti alla volta e mostrarli nella sezione **"Gatti Disponibili"**.
  * Filtrare i gatti disponibili per dimensione (`width > 600`).
  * Cliccare su **"Adotta ❤️"** per spostare un gatto nella sezione inferiore **"I Miei Gatti Adottati"** (evitando duplicati) e permettere di rimuoverlo.
  * Salvare l'elenco dei gatti adottati nel `localStorage` (`JSON.stringify` / `JSON.parse`) affinché restino salvati anche ricaricando la pagina (`F5`).

### Livello 3 (Difficile): "Gattile AFP"

Pensato per chi padroneggia già gli argomenti e vuole strutturare un'applicazione completa con architettura a Stato.

* **Endpoint:** `https://api.thecatapi.com/v1/images/search?limit=12&has_breeds=1`
* **Funzionalità richieste:**
  * Mappare i dati annidati dell'API (`breeds[0]`) in un array di oggetti puliti (razza, origine, temperamento, descrizione, immagine).
  * Gestire lo **Stato dell'interfaccia** con un'unica funzione motore (`applicaFiltri()`) che combini il cambio vista (**Esplora** vs **Preferiti**) e una **barra di ricerca live** (per razza o temperamento).
  * Salvare e recuperare i preferiti tramite `localStorage`.
  * **Sfide Bonus:** pulsante per caricare nuovi gatti, filtro `<select>` per paese d'origine, descrizione espandibile al click sulla card.

---

## Promemoria: Utilizzo della API Key

Per autenticarsi verso **TheCatAPI**, passa la tua chiave personale nell'header `x-api-key` della chiamata `fetch`:

```javascript
const API_KEY = "LA_TUA_API_KEY";

const risposta = await fetch(URL, {
    headers: {
        "x-api-key": API_KEY
    }
});
```

---

## Guida alla Consegna su Git (Branch `<nome-cognome>`)

Ogni studente deve sviluppare e consegnare il proprio lavoro su un **branch personale** dedicato, senza modificare direttamente il branch `main`.

### Regole per il nome del branch

* Usa il formato **`nome-cognome`** tutto in **minuscolo**, separato da un trattino (`-`), senza spazi né caratteri accentati.
* **Esempio corretto:** `mario-rossi`
* **Esempi errati:** `Mario Rossi`, `mario_rossi`, `esercizio-gatti`

---

### Passo 1: Clona o aggiorna il repository

Se non hai ancora scaricato il repository sul tuo computer:

```bash
git clone https://github.com/pietro2356/UF07-Lab1.git
cd UF07-Lab1
```

Se hai già il repository in locale, assicurati di partire dal `main` aggiornato:

```bash
git checkout main
git pull origin main
```

---

### Passo 2: Crea e spostati sul tuo branch `<nome-cognome>`

Esegui questo comando sostituendo `nome-cognome` con i tuoi dati (es. `git checkout -b luca-verdi`):

```bash
git checkout -b nome-cognome
```

Verifica di essere effettivamente sul nuovo branch (l'asterisco `*` deve trovarsi accanto al tuo nome):

```bash
git branch
```

---

### Passo 3: Sviluppa l'esercizio

Trovate già le cartelle predisposte con i file necessari per lo sviluppo.

---

### Passo 4: Salva le modifiche (Add & Commit)

Al termine del lavoro (o anche durante, per salvare i progressi intermedi), aggiungi i file all'area di staging e crea un commit:

```bash
# Controlla quali file sono stati modificati o creati
git status

# Aggiunge tutti i file modificati
git add .

# Crea il commit indicando il livello svolto
git commit -m "Consegna laboratorio TheCatAPI - Livello [Facile/Intermedio/Difficile]"
```

---

### Passo 5: Carica il branch su GitHub (Push)

Invia il tuo branch locale sul repository remoto GitHub:

```bash
git push -u origin nome-cognome
```
