import CatCard from "./CatCard.js";
import { applyStyleToElement } from "./utils.js";

// Raccogliere i dati sui gatti

const API_KEY= "live_TxSRI7URqV6ALh9dP1saWru4S71FElbearqSOjYSFoGEwNoFWZUucHp2sqOg9wfY";

async function getData() {
  const url = "https://api.thecatapi.com/v1/images/search?limit=12&has_breeds=1";
  try {
    const response = await fetch(url, {
        headers: {
            "x-api-key": API_KEY,
        },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

const renderCats= (cats)=> {
    const catsContainer= document.getElementById("cats-container");

    cats.forEach(cat=> {
        const catCard= new CatCard(cat);

        catsContainer.appendChild(catCard.domElement);
    });
}

const main= async ()=> {
    // Mostrare una schermata di caricamento
    const loadingScreen= document.createElement("div");
    applyStyleToElement(loadingScreen, {
        margin: "auto",
    });

    {
        const loadingScreenText= document.createElement("p");
        loadingScreenText.innerText= "Caricamento in corso...";
        applyStyleToElement(loadingScreenText, {
            fontSize: "3rem",
        });

        loadingScreen.appendChild(loadingScreenText);
    }

    const catsContainer= document.getElementById("cats-container");
    catsContainer.append(
        loadingScreen
    );

    let cats= await getData();

    // Adattare i dati
    cats= cats.map(gatto => (
        {
            id: gatto.id,
            immagine: gatto.url,
            razza: gatto.breeds[0].name,
            origine: gatto.breeds[0].origin,
            temperamento: gatto.breeds[0].temperament,
            descrizione: gatto.breeds[0].description,
        }
    ));

    console.log(cats);

    loadingScreen.remove();

    // Visualizzare le card
    renderCats(cats);
};

main();