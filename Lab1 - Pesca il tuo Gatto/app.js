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
async function pescaNuovoGatto() {
    // Mostra il messaggio di attesa e blocca il bottone
    statoCaricamento.textContent = "Caricamento in corso...";
    btnPesca.disabled = true;

    try {
        // Chiede i dati all'API e aspetta la risposta
        const risposta = await fetch(API_URL);
        // Converte la risposta in un formato leggibile da JavaScript (JSON)
        const dati = await risposta.json();

        // L'API restituisce una lista con 1 solo gatto: lo prendiamo con [0] e lo salviamo
        listaGatti.push(dati[0]);

        // Ridisegna la galleria con la lista aggiornata
        renderizzaGalleria(listaGatti);
    } catch (errore) {
        // Se qualcosa va storto (es. internet staccato), stampa l'errore in console e avvisa l'utente
        console.error("Errore durante il download:", errore);
        statoCaricamento.textContent = "Errore nel caricamento del gatto!";
    } finally {
        // Viene eseguito sempre alla fine (sia se va bene, sia se va male)
        // Svuota la scritta di caricamento (solo se non c'è un errore) e riattiva il bottone
        if (statoCaricamento.textContent === "Caricamento in corso...") {
            statoCaricamento.textContent = "";
        }
        btnPesca.disabled = false;
    }
}

// 4. FUNZIONE PER DISEGNARE LE CARD NEL DOM
function renderizzaGalleria(arrayDaMostrare) {
    // Svuota la galleria per evitare di duplicare i gatti già presenti
    galleria.innerHTML = "";

    // Aggiorna il contatore totale dei gatti pescati
    spanTotaleGatti.textContent = listaGatti.length;

    // Cicla su ogni gatto presente nell'array passato alla funzione
    arrayDaMostrare.forEach(function (gatto) {
        // a) Crea un contenitore <div> e gli assegna la classe "card"
        const card = document.createElement("div");
        card.classList.add("card");

        // b) Crea l'immagine, imposta l'indirizzo (url) e il testo alternativo
        const img = document.createElement("img");
        img.src = gatto.url;
        img.alt = "Foto di un gatto";

        // Crea il paragrafo con larghezza e altezza
        const info = document.createElement("p");
        info.textContent = gatto.width + " x " + gatto.height;

        // Inserisce immagine e paragrafo dentro la card
        card.appendChild(img);
        card.appendChild(info);

        // c) Quando clicchi sulla card, aggiunge/toglie la classe "preferita" e aggiorna il contatore
        card.addEventListener("click", function () {
            card.classList.toggle("preferita");
            aggiornaContatorePreferiti();
        });

        // d) Inserisce la card completa dentro la galleria nella pagina HTML
        galleria.appendChild(card);
    });

    // Aggiorna i preferiti a 0 quando la galleria viene ridisegnata
    aggiornaContatorePreferiti();
}

function aggiornaContatorePreferiti() {
    // Cerca tutti gli elementi che hanno sia la classe "card" che "preferita"
    const preferiti = document.querySelectorAll(".card.preferita");
    // Scrive quanti ne ha trovati (.length) dentro lo span
    spanTotalePreferiti.textContent = preferiti.length;
}

// 5. EVENTI DEI BOTTONI
btnPesca.addEventListener("click", pescaNuovoGatto);

// Filtra e mostra solo i gatti con larghezza maggiore di 500 pixel
btnSoloGrandi.addEventListener("click", function () {
    const gattiGrandi = listaGatti.filter(function (gatto) {
        return gatto.width > 500;
    });
    renderizzaGalleria(gattiGrandi);
});

// Mostra di nuovo tutti i gatti salvati
btnMostraTutti.addEventListener("click", function () {
    renderizzaGalleria(listaGatti);
});

// Svuota l'array dei gatti e ripulisce la galleria
btnSvuota.addEventListener("click", function () {
    listaGatti = [];
    renderizzaGalleria(listaGatti);
});