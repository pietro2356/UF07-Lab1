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
  // Feedback visivo e blocco temporaneo del pulsante
  statoCaricamento.textContent = "Caricamento in corso...";
  btnPesca.disabled = true;

  try {
    // Configura gli headers solo se è presente una API_KEY
    const opzioni = API_KEY ? { headers: { "x-api-key": API_KEY } } : {};
    const risposta = await fetch(API_URL, opzioni);

    if (!risposta.ok) {
      throw new Error(`Errore HTTP: ${risposta.status}`);
    }

    const dati = await risposta.json();
    const nuovoGatto = dati[0]; // TheCatAPI restituisce un array con 1 oggetto

    if (nuovoGatto) {
      listaGatti.push(nuovoGatto);
      renderizzaGalleria(listaGatti);
      statoCaricamento.textContent = "";
    }
  } catch (errore) {
    console.error("Errore durante il recupero del gatto:", errore);
    statoCaricamento.textContent = "❌ Errore nel caricamento. Riprova!";
  } finally {
    // Riabilita sempre il pulsante a prescindere dall'esito
    btnPesca.disabled = false;
  }
}

// 4. FUNZIONE PER DISEGNARE LE CARD NEL DOM
function renderizzaGalleria(arrayDaMostrare) {
  // Svuota il contenitore prima di ridisegnare
  galleria.innerHTML = "";

  // Aggiorna il contatore totale dei gatti in memoria
  spanTotaleGatti.textContent = listaGatti.length;

  arrayDaMostrare.forEach((gatto) => {
    // a) Crea il contenitore della card
    const card = document.createElement("div");
    card.classList.add("card");

    // b) Crea immagine e paragrafo con le dimensioni
    const img = document.createElement("img");
    img.src = gatto.url;
    img.alt = "Foto di un gatto";

    const infoDimensioni = document.createElement("p");
    infoDimensioni.textContent = `${gatto.width} x ${gatto.height}`;

    card.appendChild(img);
    card.appendChild(infoDimensioni);

    // c) Gestione preferiti al click sulla card
    card.addEventListener("click", () => {
      card.classList.toggle("preferita");
      aggiornaContatorePreferiti();
    });

    // d) Inserisce la card nella galleria
    galleria.appendChild(card);
  });

  // Riallinea il contatore preferiti dopo ogni render (es. dopo un filtro o svuotamento)
  aggiornaContatorePreferiti();
}

function aggiornaContatorePreferiti() {
  const cardPreferite = document.querySelectorAll(".card.preferita");
  spanTotalePreferiti.textContent = cardPreferite.length;
}

// 5. EVENTI DEI BOTTONI
btnPesca.addEventListener("click", pescaNuovoGatto);

// Filtra solo i gatti con larghezza superiore a 600px
btnSoloGrandi.addEventListener("click", () => {
  const gattiGrandi = listaGatti.filter((gatto) => gatto.width > 600);
  renderizzaGalleria(gattiGrandi);
});

// Ripristina la visualizzazione dell'intero array principale
btnMostraTutti.addEventListener("click", () => {
  renderizzaGalleria(listaGatti);
});

// Azzera l'array principale e aggiorna l'interfaccia
btnSvuota.addEventListener("click", () => {
  listaGatti = [];
  statoCaricamento.textContent = "";
  renderizzaGalleria(listaGatti);
});