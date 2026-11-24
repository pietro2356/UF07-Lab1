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
    statoCaricamento.textContent = "Caricamento in corso...";
    // - Usa try / catch / finally
    try {
        // - Fai la fetch(API_URL) e converti la risposta con await risposta.json()
        const risposta = await fetch(API_URL);
        if (!risposta.ok){
            throw new Error("Errore HTTP: " + risposta.status);
        }
        const dati = await risposta.json();
        // - Attenzione: TheCatAPI restituisce un array con 1 elemento (es. dati[0])
        // - Aggiungi il gatto trovato dentro listaGatti (usando .push())
        listaGatti.push(dati[0]);
        // - Chiama renderizzaGalleria(listaGatti)
        renderizzaGalleria(listaGatti);
    } catch(err) {
        console.error("Caricamento fallito", err)
    } finally {
        console.log("Caricamento terminato!");
        statoCaricamento.textContent = "";
    }
}

// 4. FUNZIONE PER DISEGNARE LE CARD NEL DOM
function renderizzaGalleria(arrayDaMostrare){
    // TODO (Traguardo 2):
    // - Svuota galleria.innerHTML
    galleria.innerHTML = "";
    // - Aggiorna spanTotaleGatti.textContent con listaGatti.length
    spanTotaleGatti.textContent = listaGatti.length;
    // - Cicla con .forEach() su arrayDaMostrare:
    arrayDaMostrare.forEach(gatto => {
        //   a) Crea un <div> con classe "card"
        const card = document.createElement("div");
        card.classList.add("card");
        //   b) Inserisci <img> con src = gatto.url e un <p> con le dimensioni (gatto.width + " x " + gatto.height)
        const img = document.createElement("img");
        img.src = gatto.url;
        const p = document.createElement("p");
        p.textContent = `${gatto.width} x ${gatto.height}`;
        //   c) Al click sulla card, usa classList.toggle("preferita") e chiama aggiornaContatorePreferiti()
        card.addEventListener("click", () => {
            card.classList.toggle("preferita");
            aggiornaContatorePreferiti();
        });
        //   d) Aggiungi la card a galleria con appendChild()
        card.appendChild(img);
        card.appendChild(p);
        galleria.appendChild(card);
    });
}

function aggiornaContatorePreferiti(){
    // TODO (Traguardo 2):
    // - Conta quante card nel DOM hanno la classe ".card.preferita" usando document.querySelectorAll
    const preferiti = document.querySelectorAll(".card.preferita");
    // - Scrivi il numero dentro spanTotalePreferiti.textContent
    spanTotalePreferiti.textContent = preferiti.length;
}

// 5. EVENTI DEI BOTTONI
btnPesca.addEventListener("click", pescaNuovoGatto);

// TODO (Traguardo 3):
// - Aggiungi gli eventi click a btnSoloGrandi (usa .filter()), btnMostraTutti e btnSvuota
btnSoloGrandi.addEventListener("click", () => {
    const gattiGrandi = listaGatti.filter(gatto => gatto.width > 500 && gatto.height > 500);
    renderizzaGalleria(gattiGrandi);
});

btnMostraTutti.addEventListener("click", () => {
    renderizzaGalleria(listaGatti);
});

btnSvuota.addEventListener("click", () => {
    listaGatti = [];
    renderizzaGalleria(listaGatti);
});