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
    statoCaricamento.textContent = "Caricamento in corso...";
    btnPesca.disabled = true;

    try {
        const opzioni = API_KEY ? { headers: { "x-api-key": API_KEY } } : {};
        const risposta = await fetch(API_URL, opzioni);

        if (!risposta.ok) {
            throw new Error("Errore HTTP: ${risposta.status}");
        }

        const dati = await risposta.json();
        const nuovoGatto = dati[0];

        listaGatti.push(nuovoGatto);
        renderizzaGalleria(listaGatti);
    } catch (errore) {
        console.error("Errore durante il download:", errore);
        statoCaricamento.textContent = "Errore nel caricamento del gatto. Riprova.";
    } finally {
        btnPesca.disabled = false;
        if (statoCaricamento.textContent === "Caricamento in corso..."){
            statoCaricamento.textContent = "";
        }
    }
    
}

// 4. FUNZIONE PER DISEGNARE LE CARD NEL DOM
function renderizzaGalleria(arrayDaMostrare) {
    galleria.innerHTML = "";
    spanTotaleGatti.textContent = listaGatti.length;

    arrayDaMostrare.forEach((gatto) => {
        const card = document.createElement("div");
        card.classList.add("card");
        if (gatto.preferita) card.classList.add("preferita");

        const img = document.createElement("img");
        img.src = gatto.url;
        img.alt = "Gatto";

        const info = document.createElement("p");
        info.textContent = `${gatto.width} x ${gatto.height}`;

        card.addEventListener("click", () => {
            gatto.preferita = !gatto.preferita;
            card.classList.toggle("preferita");
            aggiornaContatorePreferiti();
        });

        card.appendChild(img);
        card.appendChild(info);
        galleria.appendChild(card);
    });

    aggiornaContatorePreferiti();
}

function aggiornaContatorePreferiti(){
    const totale = document.querySelectorAll(".card.preferita").length;
    spanTotalePreferiti.textContent = totale;
}

// 5. EVENTI DEI BOTTONI
btnPesca.addEventListener("click", pescaNuovoGatto);

btnSoloGrandi.addEventListener("click", () => {
    const gattiGrandi = listaGatti.filter((gatto) => gatto.width > 600);
    renderizzaGalleria(gattiGrandi);
});

btnMostraTutti.addEventListener("click", () => {
    renderizzaGalleria(listaGatti);
});

btnSvuota.addEventListener("click", () => {
    listaGatti = [];
    renderizzaGalleria(listaGatti);
});