"use strict";

// Inserisci qui la tua API Key (oppure lascia vuoto per la chiamata base)
const API_KEY = "";
const API_URL = "https://api.thecatapi.com/v1/images/search";

// 1. SELEZIONE ELEMENTI DEL DOM
const btnPesca = document.querySelector("#btn-pesca");
const btnSoloGrandi = document.querySelector("#btn-solo-grandi");
const btnMostraTutti = document.querySelector("#btn-mostra-tutti");
const btnSvuota = document.querySelector("#btn-svuota");
const btnMostraPreferiti = document.querySelector("#btn-mostra-preferiti");

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

    statoCaricamento.textContent = "Caricamento in corso...";
    btnPesca.disabled = true;

    try {
        const risposta = await fetch(API_URL);
        if (!risposta.ok) {
            throw new Error("Errore nella richiesta API");
        }
        const dati = await risposta.json();
        const gatto = dati[0];

        // Inizializza il gatto come non preferito
        gatto.preferita = false;

        // Aggiungiamo il gatto all'array
        listaGatti.push(gatto);

        // Mostria tutti i gatti
        renderizzaGalleria(listaGatti);
    } catch (errore) {
        console.error("Errore:", errore);
        statoCaricamento.textContent = "Errore durante il caricamento!";
    } finally {
        btnPesca.disabled = false;
        if (statoCaricamento.textContent === "Caricamento in corso...") {
            statoCaricamento.textContent = "";
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

     // Svuota la galleria
     galleria.innerHTML = "";

    // Aggiorna il totale dei gatti
    spanTotaleGatti.textContent = listaGatti.length;

    // Cicla su tutti i gatti da mostrare
    arrayDaMostrare.forEach(function(gatto) {

        // Crea la card
        const card = document.createElement("div");
        card.classList.add("card");

        // Se il gatto è preferito aggiunge la classe
        if (gatto.preferita) {
            card.classList.add("preferita");
        }

        // Crea l'immagine
        const img = document.createElement("img");
        img.src = gatto.url;

        // Crea il paragrafo con le dimensioni
        const paragrafo = document.createElement("p");
        paragrafo.textContent = gatto.width + " x " + gatto.height;

        // Inserisce gli elementi nella card
        card.appendChild(img);
        card.appendChild(paragrafo);

        // Gestisce il click sulla card
        card.addEventListener("click", function() {

            // Cambia lo stato del preferito
            gatto.preferita = !gatto.preferita;

            // Aggiorna la classe CSS
            card.classList.toggle("preferita");

            // Aggiorna il contatore
            aggiornaContatorePreferiti();

        });

        // Inserisce la card nella galleria
        galleria.appendChild(card);
    });
}

function aggiornaContatorePreferiti(){
    // TODO (Traguardo 2):
    // - Conta quante card nel DOM hanno la classe ".card.preferita" usando document.querySelectorAll
    // - Scrivi il numero dentro spanTotalePreferiti.textContent

    const preferiti = listaGatti.filter(function(gatto) {
        return gatto.preferita === true;
    });

    spanTotalePreferiti.textContent = preferiti.length;
}

// 5. EVENTI DEI BOTTONI
btnPesca.addEventListener("click", pescaNuovoGatto);

// TODO (Traguardo 3):
// - Aggiungi gli eventi click a btnSoloGrandi (usa .filter()), btnMostraTutti e btnSvuota

// Pesca un nuovo gatto
btnPesca.addEventListener("click", pescaNuovoGatto);

// Mostra solamente i gatti grandi
btnSoloGrandi.addEventListener("click", function() {

    const gattiGrandi = listaGatti.filter(function(gatto) {
        return gatto.width > 500;
    });

    renderizzaGalleria(gattiGrandi);

});

// Mostra tutti i gatti
btnMostraTutti.addEventListener("click", function() {

    renderizzaGalleria(listaGatti);

});

// Mostra solamente i preferiti
btnMostraPreferiti.addEventListener("click", function() {

    const gattiPreferiti = listaGatti.filter(function(gatto) {
        return gatto.preferita === true;
    });

    renderizzaGalleria(gattiPreferiti);

});

// Svuota tutta la galleria
btnSvuota.addEventListener("click", function() {

    listaGatti = [];

    renderizzaGalleria(listaGatti);

    aggiornaContatorePreferiti();

});