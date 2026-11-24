
// Indirizzo dell'API
const URL_API = "https://api.thecatapi.com/v1/images/search?limit=6";

// Elementi HTML
const galleriaDisponibili = document.getElementById("galleria-api");
const galleriaAdottati = document.getElementById("galleria-adottati");
const messaggioStato = document.getElementById("messaggio-stato");
const contatoreAdottati = document.getElementById("contatore-adottati");

const pulsanteCarica = document.getElementById("btn-carica");
const pulsanteGrandi = document.getElementById("btn-grandi");
const pulsanteTutti = document.getElementById("btn-tutti");

// Array dei gatti
let gattiDisponibili = [];
let gattiAdottati = [];

// Variabile per il filtro delle immagini grandi
let filtroImmaginiGrandi = false;


// 1. CARICAMENTO DEI GATTI ADOTTATI DAL LOCALSTORAGE

function caricaGattiAdottatiSalvati() {

    const gattiSalvati = localStorage.getItem("gattiAdottati");

    if (gattiSalvati) {
        gattiAdottati = JSON.parse(gattiSalvati);
    }

    mostraGattiAdottati();
}


// 2. SALVATAGGIO DEI GATTI ADOTTATI

function salvaGattiAdottati() {

    localStorage.setItem(
        "gattiAdottati",
        JSON.stringify(gattiAdottati)
    );
}


// 3. CARICAMENTO DI 6 GATTI DALL'API

async function caricaGatti() {

    messaggioStato.textContent = "Caricamento dei gatti in corso...";
    pulsanteCarica.disabled = true;

    try {

        const risposta = await fetch(URL_API);

        if (!risposta.ok) {
            throw new Error("Errore nel caricamento dei gatti");
        }

        const dati = await risposta.json();

        gattiDisponibili = dati;

        mostraGattiDisponibili();

        messaggioStato.textContent =
            "Sono stati caricati " + gattiDisponibili.length + " gatti!";

    } catch (errore) {

        console.error(errore);

        messaggioStato.textContent =
            "Errore durante il caricamento dei gatti.";

    } finally {

        pulsanteCarica.disabled = false;
    }
}


// 4. VISUALIZZAZIONE DEI GATTI DISPONIBILI

function mostraGattiDisponibili() {

    galleriaDisponibili.innerHTML = "";

    let gattiDaVisualizzare = gattiDisponibili;

    // Se il filtro è attivo, seleziona solo le foto
    // con una larghezza superiore a 600 pixel

    if (filtroImmaginiGrandi) {

        gattiDaVisualizzare = gattiDisponibili.filter(
            gatto => gatto.width > 600
        );
    }

    gattiDaVisualizzare.forEach(gatto => {

        // Controlla se il gatto è già stato adottato

        const giaAdottato = gattiAdottati.some(
            adottato => adottato.id === gatto.id
        );

        if (giaAdottato) return;

        // Crea la scheda del gatto

        const scheda = document.createElement("div");

        scheda.classList.add("card");

        scheda.innerHTML = `
            <img src="${gatto.url}" alt="Foto di un gatto">
            <p>Larghezza: ${gatto.width} pixel</p>
            <p>Altezza: ${gatto.height} pixel</p>
            <button class="pulsante-adotta">Adotta ❤️</button>
        `;

        // Pulsante per adottare il gatto

        const pulsanteAdotta = scheda.querySelector(".pulsante-adotta");

        pulsanteAdotta.addEventListener("click", function () {

            adottaGatto(gatto);

        });

        galleriaDisponibili.appendChild(scheda);
    });
}


// 5. ADOZIONE DI UN GATTO

function adottaGatto(gatto) {

    // Verifica che il gatto non sia già stato adottato

    const giaAdottato = gattiAdottati.some(
        adottato => adottato.id === gatto.id
    );

    if (giaAdottato) return;

    // Aggiunge il gatto all'elenco degli adottati

    gattiAdottati.push(gatto);

    // Salva i dati nel localStorage

    salvaGattiAdottati();

    // Aggiorna le due gallerie

    mostraGattiAdottati();
    mostraGattiDisponibili();
}


// 6. VISUALIZZAZIONE DEI GATTI ADOTTATI

function mostraGattiAdottati() {

    galleriaAdottati.innerHTML = "";

    gattiAdottati.forEach(gatto => {

        const scheda = document.createElement("div");

        scheda.classList.add("card", "adottato");

        scheda.innerHTML = `
            <img src="${gatto.url}" alt="Gatto adottato">
            <p>Gatto adottato! ❤️</p>
            <button class="pulsante-rimuovi">Rimuovi</button>
        `;

        // Pulsante per rimuovere il gatto

        const pulsanteRimuovi = scheda.querySelector(".pulsante-rimuovi");

        pulsanteRimuovi.addEventListener("click", function () {

            rimuoviGatto(gatto.id);

        });

        galleriaAdottati.appendChild(scheda);
    });

    // Aggiorna il numero dei gatti adottati

    contatoreAdottati.textContent = gattiAdottati.length;
}


// 7. RIMOZIONE DI UN GATTO ADOTTATO

function rimuoviGatto(id) {

    // Crea un nuovo array senza il gatto selezionato

    gattiAdottati = gattiAdottati.filter(
        gatto => gatto.id !== id
    );

    // Aggiorna il localStorage

    salvaGattiAdottati();

    // Aggiorna le gallerie

    mostraGattiAdottati();
    mostraGattiDisponibili();
}


// 8. FILTRO PER LE IMMAGINI GRANDI

pulsanteGrandi.addEventListener("click", function () {

    filtroImmaginiGrandi = true;

    mostraGattiDisponibili();

    messaggioStato.textContent =
        "Visualizzazione dei gatti con immagini superiori a 600 pixel.";

});


// 9. VISUALIZZAZIONE DI TUTTI I GATTI

pulsanteTutti.addEventListener("click", function () {

    filtroImmaginiGrandi = false;

    mostraGattiDisponibili();

    messaggioStato.textContent =
        "Visualizzazione di tutti i gatti disponibili.";

});


// 10. PULSANTE PER CARICARE NUOVI GATTI

pulsanteCarica.addEventListener("click", caricaGatti);


// 11. AVVIO DEL PROGRAMMA

// Recupera i gatti adottati precedentemente salvati

caricaGattiAdottatiSalvati();

// Carica automaticamente i gatti dall'API

caricaGatti();
