// Array con i gatti 
let listaGattiApi = [];

// Array con i gatti salvati nei preferiti
let gattiPreferiti = [];

// Memorizza quale sezione l'utente sta visualizzando
let vistaCorrente = "esplora";

// Chiave API 
const API_KEY = "live_3Wia9igZ6zsEJz4Gc7rxf9WBzHlk0nKWa1Z0MNy4kMMGgy4Gne2VojT9Ai4KvPzI";

// Indirizzo dell'API
const URL_API = "https://api.thecatapi.com/v1/images/search?limit=12&has_breeds=1";

// Elementi HTML utilizzati dal programma
const galleriaGatti = document.getElementById("galleria-gatti");
const messaggioStato = document.getElementById("messaggio-stato");
const campoRicerca = document.getElementById("ricerca");
const filtroOrigine = document.getElementById("filtro-origine");
const btnEsplora = document.getElementById("btn-esplora");
const btnPreferiti = document.getElementById("btn-preferiti");
const btnNuoviGatti = document.getElementById("btn-nuovi-gatti");
const contatorePreferiti = document.getElementById("contatore-preferiti");
const titoloVista = document.getElementById("titolo-vista");


// Scaricare i gatti dall'API
async function scaricaGatti() {
    messaggioStato.textContent = "Caricamento in corso...";
    btnNuoviGatti.disabled = true;

    try {
        const risposta = await fetch(URL_API, {
            method: "GET",
            headers: {
                "x-api-key": API_KEY
            }
        });

        // Se il server restituisce un errore, lo segnaliamo
        if (!risposta.ok) {
            throw new Error("Errore del server: " + risposta.status);
        }

        const dati = await risposta.json();

        // Adapter: prendiamo solo le informazioni che ci servono
        const nuoviGatti = dati.map(function(item) {
            let datiRazza = {};

            // Controlliamo che l'API abbia restituito almeno una razza
            if (item.breeds && item.breeds.length > 0) {
                datiRazza = item.breeds[0];
            }

            return {
                id: item.id,
                immagine: item.url,
                razza: datiRazza.name || "Razza non disponibile",
                origine: datiRazza.origin || "Origine non disponibile",
                temperamento: datiRazza.temperament || "Non specificato",
                descrizione: datiRazza.description || "Descrizione non disponibile."
            };
        });

        // Aggiungiamo i nuovi gatti senza ripetere quelli già presenti
        let gattiAggiunti = 0;

        nuoviGatti.forEach(function(nuovoGatto) {
            const giaPresente = listaGattiApi.some(function(gatto) {
                return gatto.id === nuovoGatto.id;
            });

            if (!giaPresente) {
                listaGattiApi.push(nuovoGatto);
                gattiAggiunti++;
            }
        });

        aggiornaFiltroOrigine();
        applicaFiltri();

        messaggioStato.textContent = gattiAggiunti + " nuovi gatti caricati. Totale in Esplora: " + listaGattiApi.length + ".";

    } catch (errore) {
        console.error("Errore durante il caricamento dei gatti:", errore);
        messaggioStato.textContent = "Non è stato possibile caricare i gatti. Controlla la connessione o la chiave API.";

    } finally {
        // Il pulsante torna disponibile sia in caso di successo sia in caso di errore
        btnNuoviGatti.disabled = false;
    }
}


// Creare le card e mostrarle nella pagina
function renderizzaGatti(lista) {
    // Prima svuotiamo la galleria
    galleriaGatti.innerHTML = "";

    // Se non ci sono risultati, mostriamo un messaggio
    if (lista.length === 0) {
        const messaggioVuoto = document.createElement("p");
        messaggioVuoto.classList.add("messaggio-vuoto");

        if (vistaCorrente === "preferiti" && gattiPreferiti.length === 0) {
            messaggioVuoto.textContent = "Non hai ancora aggiunto gatti ai preferiti. Esplora la galleria e salva quelli che ti piacciono.";
        } else {
            messaggioVuoto.textContent = "Nessun gatto trovato. Prova a cambiare la ricerca o il filtro per origine.";
        }

        galleriaGatti.appendChild(messaggioVuoto);
        return;
    }

    // Creiamo una card per ogni gatto dell'array ricevuto
    lista.forEach(function(gatto) {
        const card = document.createElement("article");
        card.classList.add("card-gatto");

        const immagine = document.createElement("img");
        immagine.src = gatto.immagine;
        immagine.alt = "Gatto di razza " + gatto.razza;
        immagine.loading = "lazy";

        const contenutoCard = document.createElement("div");
        contenutoCard.classList.add("contenuto-card");

        const nomeRazza = document.createElement("h3");
        nomeRazza.classList.add("nome-razza");
        nomeRazza.textContent = gatto.razza;

        const origine = document.createElement("p");
        origine.classList.add("origine-gatto");
        origine.textContent = "Paese d'origine: " + gatto.origine;

        const temperamento = document.createElement("p");
        temperamento.classList.add("temperamento");

        const etichetta = document.createElement("span");
        etichetta.classList.add("etichetta-piccola");
        etichetta.textContent = "Temperamento:";

        temperamento.appendChild(etichetta);
        temperamento.appendChild(document.createTextNode(" " + gatto.temperamento));

        // La descrizione è nascosta all'inizio e si apre cliccando sulla card
        const descrizione = document.createElement("p");
        descrizione.classList.add("descrizione");
        descrizione.textContent = gatto.descrizione;
        descrizione.hidden = true;

        // Controlliamo se il gatto è già tra i preferiti
        const giaPreferito = gattiPreferiti.some(function(preferito) {
            return preferito.id === gatto.id;
        });

        const bottonePreferito = document.createElement("button");
        bottonePreferito.classList.add("bottone-preferito");
        bottonePreferito.type = "button";

        if (giaPreferito) {
            bottonePreferito.textContent = "💔 Rimuovi dai Preferiti";
        } else {
            bottonePreferito.textContent = "❤️ Aggiungi ai Preferiti";
        }

        // Cliccando sulla card mostriamo o nascondiamo la descrizione
        card.addEventListener("click", function() {
            descrizione.hidden = !descrizione.hidden;
        });

        // Il click sul bottone non deve aprire o chiudere la descrizione
        bottonePreferito.addEventListener("click", function(evento) {
            evento.stopPropagation();
            gestisciPreferito(gatto);
        });

        // Inseriamo tutti gli elementi nella card
        contenutoCard.appendChild(nomeRazza);
        contenutoCard.appendChild(origine);
        contenutoCard.appendChild(temperamento);
        contenutoCard.appendChild(descrizione);
        contenutoCard.appendChild(bottonePreferito);

        card.appendChild(immagine);
        card.appendChild(contenutoCard);

        galleriaGatti.appendChild(card);
    });
}


// Gestire l'aggiunta e la rimozione dei preferiti
function gestisciPreferito(gatto) {
    // Controlliamo se il gatto è già presente nei preferiti
    const giaPreferito = gattiPreferiti.some(function(preferito) {
        return preferito.id === gatto.id;
    });

    if (giaPreferito) {
        // Se è già presente, lo rimuoviamo dall'array
        gattiPreferiti = gattiPreferiti.filter(function(preferito) {
            return preferito.id !== gatto.id;
        });
    } else {
        // Altrimenti lo aggiungiamo
        gattiPreferiti.push(gatto);
    }

    salvaPreferiti();
    aggiornaContatore();
    aggiornaFiltroOrigine();
    applicaFiltri();
}


// Salvare i preferiti nel localStorage
function salvaPreferiti() {
    localStorage.setItem("gattiPreferitiLab3", JSON.stringify(gattiPreferiti));
}


// Recuperare i preferiti salvati nelle visite precedenti
function caricaPreferiti() {
    const datiSalvati = localStorage.getItem("gattiPreferitiLab3");

    try {
        const dati = JSON.parse(datiSalvati);

        if (Array.isArray(dati)) {
            gattiPreferiti = dati;
        } else {
            gattiPreferiti = [];
        }

    } catch (errore) {
        console.error("Errore durante il recupero dei preferiti:", errore);
        gattiPreferiti = [];
    }
}


// Aggiornare il numero mostrato accanto a I miei Preferiti
function aggiornaContatore() {
    contatorePreferiti.textContent = gattiPreferiti.length;
}


// Riempire il menu con i paesi presenti nei gatti disponibili e preferiti
function aggiornaFiltroOrigine() {
    const origineSelezionata = filtroOrigine.value;
    const origini = [];

    // Raccogliamo i paesi dei gatti scaricati dall'API
    listaGattiApi.forEach(function(gatto) {
        if (!origini.includes(gatto.origine)) {
            origini.push(gatto.origine);
        }
    });

    // Aggiungiamo anche i paesi dei preferiti
    gattiPreferiti.forEach(function(gatto) {
        if (!origini.includes(gatto.origine)) {
            origini.push(gatto.origine);
        }
    });

    // Ordiniamo alfabeticamente i paesi
    origini.sort();

    // Svuotiamo il menu e ricreiamo la prima opzione
    filtroOrigine.innerHTML = "";

    const opzioneTutte = document.createElement("option");
    opzioneTutte.value = "";
    opzioneTutte.textContent = "Tutte le origini";
    filtroOrigine.appendChild(opzioneTutte);

    // Creiamo un'opzione per ogni paese trovato
    origini.forEach(function(paese) {
        const opzione = document.createElement("option");
        opzione.value = paese;
        opzione.textContent = paese;
        filtroOrigine.appendChild(opzione);
    });

    // Cerchiamo di mantenere il paese che era stato selezionato
    filtroOrigine.value = origineSelezionata;
}


// Applicare insieme ricerca e filtri
function applicaFiltri() {
    const testoRicerca = campoRicerca.value.toLowerCase().trim();
    const origineScelta = filtroOrigine.value;

    let listaDiPartenza = [];

    // Scegliamo l'array in base alla vista selezionata
    if (vistaCorrente === "esplora") {
        listaDiPartenza = listaGattiApi;
        titoloVista.textContent = "Gatti da esplorare";
    } else {
        listaDiPartenza = gattiPreferiti;
        titoloVista.textContent = "I miei gatti preferiti";
    }

    // Applichiamo sia la ricerca testuale sia il filtro per origine
    const listaFiltrata = listaDiPartenza.filter(function(gatto) {
        const razza = gatto.razza.toLowerCase();
        const temperamento = gatto.temperamento.toLowerCase();

        const corrispondeRicerca = razza.includes(testoRicerca) || temperamento.includes(testoRicerca);
        const corrispondeOrigine = origineScelta === "" || gatto.origine === origineScelta;

        return corrispondeRicerca && corrispondeOrigine;
    });

    renderizzaGatti(listaFiltrata);
}


// Cambiare vista: Esplora
btnEsplora.addEventListener("click", function() {
    vistaCorrente = "esplora";
    aggiornaBottoniVista();
    applicaFiltri();
});


// Cambiare vista: I miei Preferiti
btnPreferiti.addEventListener("click", function() {
    vistaCorrente = "preferiti";
    aggiornaBottoniVista();
    applicaFiltri();
});


// Aggiornare l'aspetto dei due pulsanti di selezione vista
function aggiornaBottoniVista() {
    btnEsplora.classList.remove("attivo");
    btnPreferiti.classList.remove("attivo");

    if (vistaCorrente === "esplora") {
        btnEsplora.classList.add("attivo");
    } else {
        btnPreferiti.classList.add("attivo");
    }
}


// La ricerca viene aggiornata ogni volta che l'utente scrive
campoRicerca.addEventListener("input", applicaFiltri);

// Anche il menu del paese aggiorna subito i risultati
filtroOrigine.addEventListener("change", applicaFiltri);

// Il pulsante carica altri 12 gatti senza cancellare i preferiti
btnNuoviGatti.addEventListener("click", scaricaGatti);


// AVVIO DEL PROGRAMMA
caricaPreferiti();
aggiornaContatore();
aggiornaFiltroOrigine();
aggiornaBottoniVista();
scaricaGatti();