"use strict";

// Inserisci qui la tua API Key (oppure lascia vuoto per la chiamata base)
const API_KEY = "";
const API_URL = "https://api.thecatapi.com/v1/images/search";

// 1. SELEZIONE ELEMENTI DEL DOM
const btnPesca = document.querySelector("#btn-pesca");
const btnSoloGrandi = document.querySelector("#btn-solo-grandi");
const btnMostraTutti = document.querySelector("#btn-mostra-tutti");
const btnSvuota = document.querySelector("#btn-svuota");

const statoCaricamento = document.querySelector("#stato-caricamento");
const spanTotaleGatti = document.querySelector("#totale-gatti");
const spanTotalePreferiti = document.querySelector("#totale-preferiti");
const galleria = document.querySelector("#galleria-gatti");

// 2. ARRAY PRINCIPALE (Unica fonte dati)
let listaGatti = [];

// 3. FUNZIONE ASINCRONA PER SCARICARE UN GATTO
async function pescaNuovoGatto(){
    // TODO (Traguardo 1):
    // - Mostra "Caricamento in corso..." in statoCaricamento e disabilita btnPesca
    // - Usa try / catch / finally
    // - Fai la fetch(API_URL) e converti la risposta con await risposta.json()
    // - Attenzione: TheCatAPI restituisce un array con 1 elemento (es. dati[0])
    // - Aggiungi il gatto trovato dentro listaGatti (usando .push())
    // - Chiama renderizzaGalleria(listaGatti)

    try {
        // 1. Mostro il messaggio di caricamento
        statoCaricamento.textContent = "Caricamento in corso...";

        // 2. Disabilito il pulsante per evitare click multipli
        btnPesca.disabled = true;

        // 3. Faccio la richiesta all'API
        const risposta = await fetch(API_URL);

        // Controllo se la risposta è andata a buon fine
        if (!risposta.ok) {
            throw new Error("Errore nella richiesta API");
        }

        // 4. Converto la risposta in JSON
        const dati = await risposta.json();

        // 5. Prendo il primo gatto dall'array
        const nuovoGatto = dati[0];

        // 6. Aggiungo il gatto alla lista principale
        listaGatti.push(nuovoGatto);

        // 7. Aggiorno la galleria
        renderizzaGalleria(listaGatti);

    } catch (errore) {

        // Se qualcosa va storto, mostro un messaggio
        console.error("Errore durante il caricamento del gatto:", errore);

        statoCaricamento.textContent = "Errore nel caricamento delle immagine del gatto 😿";

    } finally {

        // 8. Riattivo il pulsante
        btnPesca.disabled = false;

        // Rimuovo il messaggio di caricamento
        // (solo se non c'è stato un errore)
        if (!btnPesca.disabled) {
            // Il messaggio viene svuotato dopo la richiesta
        }
    }
}

// 4. FUNZIONE PER DISEGNARE LE CARD NEL DOM
function renderizzaGalleria(arrayDaMostrare){
    // TODO (Traguardo 2):
    // - Svuota galleria.innerHTML
    // - Aggiorna spanTotaleGatti.textContent con listaGatti.length
    // - Cicla con .forEach() su arrayDaMostrare:
    //   a) Crea un <div> con classe "card"
    //   b) Inserisci <img> con src = gatto.url e un <p> con le dimensioni (gatto.width + " x " + gatto.height)
    //   c) Al click sulla card, usa classList.toggle("preferita") e chiama aggiornaContatorePreferiti()
    //   d) Aggiungi la card a galleria con appendChild()
    // Svuoto la galleria
    galleria.innerHTML = "";

    // Aggiorno il totale dei gatti presenti nell'array principale
    spanTotaleGatti.textContent = listaGatti.length;

    // Ciclo su tutti i gatti da mostrare
    arrayDaMostrare.forEach((gatto) => {

        // Creo la card
        const card = document.createElement("div");
        card.classList.add("card");

        // Se il gatto è già preferito, mantengo la classe
        if (gatto.preferita) {
            card.classList.add("preferita");
        }

        // Creo l'immagine
        const img = document.createElement("img");
        img.src = gatto.url;
        img.alt = "Foto di un gatto";

        // Creo il paragrafo con le dimensioni
        const p = document.createElement("p");
        p.textContent = gatto.width + " x " + gatto.height;

        // Inserisco immagine e paragrafo nella card
        card.appendChild(img);
        card.appendChild(p);

        // Click sulla card: aggiungo/rimuovo dai preferiti
        card.addEventListener("click", () => {
            card.classList.toggle("preferita");

            // Salvo lo stato anche nell'oggetto gatto
            gatto.preferita = card.classList.contains("preferita");

            aggiornaContatorePreferiti();
        });

        // Inserisco la card nella galleria
        galleria.appendChild(card);
    });

    // Aggiorno il contatore dei preferiti
    aggiornaContatorePreferiti();
}

function aggiornaContatorePreferiti(){
    // TODO (Traguardo 2):
    // - Conta quante card nel DOM hanno la classe ".card.preferita" usando document.querySelectorAll
    // - Scrivi il numero dentro spanTotalePreferiti.textContent

    const preferiti = document.querySelectorAll(".card.preferita");

    spanTotalePreferiti.textContent = preferiti.length;
}

// 5. EVENTI DEI BOTTONI
btnPesca.addEventListener("click", pescaNuovoGatto);

// Mostra solo i gatti grandi
btnSoloGrandi.addEventListener("click", () => {
    const gattiGrandi = listaGatti.filter((gatto) => {
        return gatto.width >= 500 || gatto.height >= 500;
    });

    renderizzaGalleria(gattiGrandi);
});


// Mostra tutti i gatti
btnMostraTutti.addEventListener("click", () => {
    renderizzaGalleria(listaGatti);
});


// Svuota la galleria
btnSvuota.addEventListener("click", () => {
    listaGatti.length = 0;

    renderizzaGalleria(listaGatti);
});

// TODO (Traguardo 3):
// - Aggiungi gli eventi click a btnSoloGrandi (usa .filter()), btnMostraTutti e btnSvuota