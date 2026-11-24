"use strict";

// Inserisci qui la tua API Key (oppure lascia vuoto per la chiamata base)
const API_KEY = "live_3Wia9igZ6zsEJz4Gc7rxf9WBzHlk0nKWa1Z0MNy4kMMGgy4Gne2VojT9Ai4KvPzI";
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
    statoCaricamento.textContent = "Caricamento gatto in corso...";
    btnPesca.disabled = true;

    try {

        const risposta = await fetch(API_URL);

        if (!risposta.ok){
            throw new Error("Errore nel download");
        }

        const dati = await risposta.json();

        listaGatti.push(dati[0]);

        renderizzaGalleria(listaGatti);

    } catch(err){

        statoCaricamento.textContent = err.message;
        statoCaricamento.style.color = "red";

    } finally {

        if(statoCaricamento.textContent !== "Errore nel download"){
            statoCaricamento.textContent = "";
        }

        btnPesca.disabled = false;
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
    galleria.innerHTML = "";

    spanTotaleGatti.textContent = listaGatti.length;

    arrayDaMostrare.forEach(gatto => {

        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = gatto.url;

        const p = document.createElement("p");
p.textContent = `Dimensioni: ${gatto.width}x${gatto.height}px`;

// EXTRA FACOLTATIVO
const btnElimina = document.createElement("button");
btnElimina.textContent = "Elimina";

btnElimina.addEventListener("click", (e) => {

    e.stopPropagation();

    listaGatti = listaGatti.filter(
        item => item.id !== gatto.id
    );

    renderizzaGalleria(listaGatti);

    aggiornaContatorePreferiti();

});

card.appendChild(img);
card.appendChild(p);
card.appendChild(btnElimina);

card.addEventListener("click", () => {

    card.classList.toggle("preferita");
    aggiornaContatorePreferiti();

});

galleria.appendChild(card);

});

}

function aggiornaContatorePreferiti(){
    // TODO (Traguardo 2):
    // - Conta quante card nel DOM hanno la classe ".card.preferita" usando document.querySelectorAll
    // - Scrivi il numero dentro spanTotalePreferiti.textContent
    const numeroPreferiti =
        document.querySelectorAll(".card.preferita").length;

    spanTotalePreferiti.textContent = numeroPreferiti;
}

// 5. EVENTI DEI BOTTONI
btnPesca.addEventListener("click", pescaNuovoGatto);
// TODO (Traguardo 3):
// - Aggiungi gli eventi click a btnSoloGrandi (usa .filter()), btnMostraTutti e btnSvuota

// Solo foto grandi
btnSoloGrandi.addEventListener("click", () => {

    const gattiGrandi = listaGatti.filter(gatto => gatto.width > 600);

    renderizzaGalleria(gattiGrandi);

});

// Mostra tutti
btnMostraTutti.addEventListener("click", () => {

    renderizzaGalleria(listaGatti);

});

// Svuota tutto
btnSvuota.addEventListener("click", () => {

    listaGatti = [];

    renderizzaGalleria(listaGatti);

    spanTotalePreferiti.textContent = 0;

});