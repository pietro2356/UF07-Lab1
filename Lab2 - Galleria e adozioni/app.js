// Array che contiene i gatti scaricati dall'API
let listaGattiApi = [];

// Array che contiene i gatti adottati
let gattiAdottati = [];

// Chiave API
const API_KEY = "live_3Wia9igZ6zsEJz4Gc7rxf9WBzHlk0nKWa1Z0MNy4kMMGgy4Gne2VojT9Ai4KvPzI";

// Elementi HTML 
const galleriaApi = document.getElementById("galleria-api");
const galleriaAdottati = document.getElementById("galleria-adottati");
const messaggioStato = document.getElementById("messaggio-stato");
const contatoreAdottati = document.getElementById("contatore-adottati");


// Scaricare i gatti dall'API
async function scaricaGatti() {
    messaggioStato.textContent = "Caricamento in corso...";

    try {
        const risposta = await fetch(
            "https://api.thecatapi.com/v1/images/search?limit=6",
            {
                headers: {
                    "x-api-key": API_KEY
                }
            }
        );

        // Controlla se la richiesta è andata a buon fine
        if (!risposta.ok) {
            throw new Error("Errore durante il caricamento dei gatti");
        }

        const dati = await risposta.json();

        // Salva i gatti ricevuti nell'array globale
        listaGattiApi = dati;

        messaggioStato.textContent = "";

        // Mostra i gatti nella pagina
        renderizzaGalleriaApi(listaGattiApi);

    } catch (errore) {
        console.error(errore);
        messaggioStato.textContent =
            "Non è stato possibile caricare i gatti. Controlla la connessione e la chiave API.";
    }
}


// Crea e mostra le card dei gatti disponibili
function renderizzaGalleriaApi(arrayGatti) {
    // Svuota la galleria prima di aggiungere le nuove card
    galleriaApi.innerHTML = "";

    arrayGatti.forEach(function(gatto) {
        // Crea il contenitore della card
        const card = document.createElement("div");
        card.classList.add("card");

        // Crea l'immagine
        const immagine = document.createElement("img");
        immagine.src = gatto.url;
        immagine.alt = "Foto di un gatto";

        // Mostra la larghezza dell'immagine
        const larghezza = document.createElement("p");
        larghezza.textContent = `Larghezza: ${gatto.width}px`;

        // Crea il bottone per adottare il gatto
        const bottone = document.createElement("button");
        bottone.textContent = "Adotta ❤️";

        // Quando si clicca, il gatto viene aggiunto agli adottati
        bottone.addEventListener("click", function() {
            adottaGatto(gatto);
        });

        // Inserisce gli elementi nella card
        card.appendChild(immagine);
        card.appendChild(larghezza);
        card.appendChild(bottone);

        // Inserisce la card nella galleria
        galleriaApi.appendChild(card);
    });
}


// Filtrare i gatti
document.getElementById("btn-grandi").addEventListener("click", function() {

    // Mantiene solamente i gatti con larghezza maggiore di 600 pixel
    const gattiGrandi = listaGattiApi.filter(function(gatto) {
        return gatto.width > 600;
    });

    renderizzaGalleriaApi(gattiGrandi);
});


document.getElementById("btn-tutti").addEventListener("click", function() {

    // Mostra nuovamente tutti i gatti scaricati
    renderizzaGalleriaApi(listaGattiApi);
});


// Adottare un gatto
function adottaGatto(gatto) {

    // Controlla che il gatto non sia già stato adottato
    const giaAdottato = gattiAdottati.some(function(gattoAdottato) {
        return gattoAdottato.id === gatto.id;
    });

    if (giaAdottato) {
        messaggioStato.textContent = "Hai già adottato questo gatto!";
        return;
    }

    // Aggiunge il gatto all'array degli adottati
    gattiAdottati.push(gatto);

    // Salva le modifiche e aggiorna la galleria
    salvaAdottati();
    renderizzaAdottati();

    messaggioStato.textContent = "Gatto adottato con successo!";
}


// Mostra i gatti adottati nella parte inferiore della pagina
function renderizzaAdottati() {

    // Svuota la galleria degli adottati
    galleriaAdottati.innerHTML = "";

    gattiAdottati.forEach(function(gatto) {

        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("adottato");

        const immagine = document.createElement("img");
        immagine.src = gatto.url;
        immagine.alt = "Foto del gatto adottato";

        const larghezza = document.createElement("p");
        larghezza.textContent = `Larghezza: ${gatto.width}px`;

        // Bottone per rimuovere il gatto dagli adottati
        const bottone = document.createElement("button");
        bottone.textContent = "Libera ❌";

        bottone.addEventListener("click", function() {
            liberaGatto(gatto.id);
        });

        card.appendChild(immagine);
        card.appendChild(larghezza);
        card.appendChild(bottone);

        galleriaAdottati.appendChild(card);
    });

    // Aggiorna il numero dei gatti adottati
    contatoreAdottati.textContent = gattiAdottati.length;
}


// Rimuove un gatto dall'array degli adottati
function liberaGatto(idGatto) {

    // Crea un nuovo array senza il gatto selezionato
    gattiAdottati = gattiAdottati.filter(function(gatto) {
        return gatto.id !== idGatto;
    });

    // Salva e aggiorna la pagina
    salvaAdottati();
    renderizzaAdottati();
}


// Salvare e caricare le adozioni
function salvaAdottati() {

    // Trasforma l'array in una stringa JSON e lo salva nel browser
    localStorage.setItem("gattiAdottati", JSON.stringify(gattiAdottati));
}


function caricaAdottati() {

    // Legge i dati salvati nel localStorage
    const datiSalvati = localStorage.getItem("gattiAdottati");

    try {

        // Se non ci sono dati, utilizza un array vuoto
        gattiAdottati = JSON.parse(datiSalvati) || [];

        // Controlla che i dati letti siano effettivamente un array
        if (!Array.isArray(gattiAdottati)) {
            gattiAdottati = [];
        }

    } catch (errore) {

        // In caso di dati non validi, riparte da un array vuoto
        console.error("Errore nella lettura dei gatti adottati:", errore);
        gattiAdottati = [];
    }

    // Mostra i gatti già adottati
    renderizzaAdottati();
}


// Collega il bottone di caricamento alla funzione scaricaGatti
document.getElementById("btn-carica").addEventListener("click", scaricaGatti);


// AVVIO DEL PROGRAMMA
// Prima recupera le adozioni salvate, poi scarica i nuovi gatti
caricaAdottati();
scaricaGatti();