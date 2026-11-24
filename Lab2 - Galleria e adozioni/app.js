
"use strict";

// 1. API
const API_URL = "https://api.thecatapi.com/v1/images/search?limit=6";

// 2. SELEZIONE ELEMENTI DOM
const btnCarica = document.querySelector("#btn-carica");
const btnGrandi = document.querySelector("#btn-grandi");
const btnTutti = document.querySelector("#btn-tutti");

const messaggioStato = document.querySelector("#messaggio-stato");
const galleriaAPI = document.querySelector("#galleria-api");
const galleriaAdottati = document.querySelector("#galleria-adottati");
const contatoreAdottati = document.querySelector("#contatore-adottati");

// 3. ARRAY
let listaGatti = [];

let listaAdottati = JSON.parse(localStorage.getItem("adottati")) || [];

// 4. FUNZIONE PER SALVARE GLI ADOTTATI
function salvaAdottati() {
    localStorage.setItem("adottati", JSON.stringify(listaAdottati));
}

// 5. CARICARE I GATTI
async function caricaGatti() {

    messaggioStato.textContent = "Caricamento in corso...";
    btnCarica.disabled = true;

    try {

        const risposta = await fetch(API_URL);
        const dati = await risposta.json();

        dati.forEach(function(gatto) {
            listaGatti.push(gatto);
        });

        renderizzaGatti(listaGatti);

    } catch (errore) {

        console.log(errore);
        messaggioStato.textContent = "Errore nel caricamento";

    } finally {

        btnCarica.disabled = false;
        if (messaggioStato.textContent === "Caricamento in corso...") {
            messaggioStato.textContent = "";
        }

    }
}

// 6. MOSTRARE I GATTI DISPONIBILI
function renderizzaGatti(arrayDaMostrare) {

    galleriaAPI.innerHTML = "";

    arrayDaMostrare.forEach(function(gatto) {

        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = gatto.url;

        const p = document.createElement("p");
        p.textContent = gatto.width + " x " + gatto.height;

        const btnAdotta = document.createElement("button");
        btnAdotta.textContent = "Adotta ❤️";

        btnAdotta.addEventListener("click", function() {

            listaAdottati.push(gatto);

            listaGatti = listaGatti.filter(function(g) {
                return g.id !== gatto.id;
            });

            salvaAdottati();

            renderizzaGatti(listaGatti);
            renderizzaAdottati();

        });

        card.appendChild(img);
        card.appendChild(p);
        card.appendChild(btnAdotta);

        galleriaAPI.appendChild(card);

    });

}

// 7. MOSTRARE I GATTI ADOTTATI
function renderizzaAdottati() {

    galleriaAdottati.innerHTML = "";

    contatoreAdottati.textContent = listaAdottati.length;

    listaAdottati.forEach(function(gatto) {

        const card = document.createElement("div");
        card.classList.add("card", "adottato");

        const img = document.createElement("img");
        img.src = gatto.url;

        const p = document.createElement("p");
        p.textContent = gatto.width + " x " + gatto.height;

        const btnRimuovi = document.createElement("button");
        btnRimuovi.textContent = "Rimuovi";

        btnRimuovi.addEventListener("click", function() {

            listaAdottati = listaAdottati.filter(function(g) {
                return g.id !== gatto.id;
            });

            listaGatti.push(gatto);

            salvaAdottati();

            renderizzaGatti(listaGatti);
            renderizzaAdottati();

        });

        card.appendChild(img);
        card.appendChild(p);
        card.appendChild(btnRimuovi);

        galleriaAdottati.appendChild(card);

    });

}

// 8. FILTRO GATTI GRANDI
btnGrandi.addEventListener("click", function() {

    const gattiGrandi = listaGatti.filter(function(gatto) {
        return gatto.width > 600;
    });

    renderizzaGatti(gattiGrandi);

});

// 9. MOSTRA TUTTI
btnTutti.addEventListener("click", function() {

    renderizzaGatti(listaGatti);

});

// 10. EVENTO CARICA
btnCarica.addEventListener("click", caricaGatti);

// 11. MOSTRA GLI ADOTTATI SALVATI
renderizzaAdottati();