"use strict";

// Inserisci qui la tua API Key (oppure lascia vuoto per la chiamata base)
const API_KEY = "live_eoqPl84XOjNfl1CxOulf82WGZP8TPFUkHEpAUm3WpeIOCt71gK2zsI3wJz2T9T85";
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
}

function aggiornaContatorePreferiti(){
    // TODO (Traguardo 2):
    // - Conta quante card nel DOM hanno la classe ".card.preferita" usando document.querySelectorAll
    // - Scrivi il numero dentro spanTotalePreferiti.textContent
}

// 5. EVENTI DEI BOTTONI
btnPesca.addEventListener("click", pescaNuovoGatto);

// TODO (Traguardo 3):
// - Aggiungi gli eventi click a btnSoloGrandi (usa .filter()), btnMostraTutti e btnSvuota