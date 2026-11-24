import Chip from "./Chip.js";
import { applyStyleToElement } from "./utils.js";

export default class CatCard{
    static #FAVOURITES_KEY= "favourite-cats";

    #domElement;

    /**
     {
        id: gatto.id,
        immagine: gatto.url,
        razza: gatto.breeds[0].name,
        origine: gatto.breeds[0].origin,
        temperamento: gatto.breeds[0].temperament,
        descrizione: gatto.breeds[0].description,
     }
     */
    constructor(args= {}){
        this.id= args.id;
        this.image= args.immagine;
        this.breed= args.razza;
        this.origin= args.origine;
        this.temperament= args.temperamento;
        this.description= args.descrizione;

        this.#init();
    }

    #init(){
        this.#domElement= document.createElement("div");
        applyStyleToElement(this.#domElement, {
            display: "flex",
            flexDirection: "column",
            backgroundColor: "pearl",
            boxShadow: "2px 2px 4px #000000ae",
            bordeRadius: "1rem",
            width: "512px",
            maxWidth: "100vw",
            borderRadius: "1rem",
            padding: "1rem",
            gap: ".5rem",
        });

        {
            const image= document.createElement("img");
            image.setAttribute("src", this.image);

            applyStyleToElement(image, {
                height: "128px",
                margin: "0 auto 0 auto",
                display: "block",
            });

            const chips= document.createElement("div");
            applyStyleToElement(chips, {
                display: "flex",
                overflowX: "scroll",
                gap: ".5rem",
            });
            {
                const breedChip= new Chip(this.breed).domElement;
                const originChip= new Chip(this.origin).domElement;
                const temperamentChip= new Chip(this.temperament).domElement;

                chips.append(
                    breedChip,
                    originChip,
                    temperamentChip,
                );
            }

            const favouritesButton= document.createElement("div");
            applyStyleToElement(favouritesButton, {
                backgroundColor: "pink",
                cursor: "pointer",
                padding: ".5rem",
                borderRadius: ".5rem",
                display: "flex",
                gap: ".5rem",
            });
            {
                // Icon states
                const hearthFullIcon= document.createElement("span");
                hearthFullIcon.classList.add("fi", "fi-ss-heart");

                const hearthEmptyIcon= document.createElement("span");
                hearthEmptyIcon.classList.add("fi", "fi-bs-heart");

                const hearthBrokenIcon= document.createElement("span");
                hearthBrokenIcon.classList.add("fi", "fi-ss-heart-crack");

                let icon;

                if (this.isFavourite()){
                    icon= hearthFullIcon;
                }
                else{
                    icon= hearthEmptyIcon;
                }

                const text= document.createElement("p");
                text.innerText= "Aggiungi ai preferiti";

                favouritesButton.append(
                    icon,
                    text,
                );

                favouritesButton.addEventListener("mouseover", ()=> {
                    if (this.isFavourite()){
                        favouritesButton.replaceChild(hearthBrokenIcon, icon);
                        icon= hearthBrokenIcon;
                    }
                    else{
                        favouritesButton.replaceChild(hearthFullIcon, icon);
                        icon= hearthFullIcon;
                    }
                });

                favouritesButton.addEventListener("mouseout", ()=> {
                    if (this.isFavourite()){
                        favouritesButton.replaceChild(hearthFullIcon, icon);
                        icon= hearthFullIcon;
                    }
                    else{
                        favouritesButton.replaceChild(hearthEmptyIcon, icon);
                        icon= hearthEmptyIcon;
                    }
                });

                favouritesButton.addEventListener("click", ()=> {
                    if (this.isFavourite()){
                        this.removeFromFavourites();
                    }
                    else{
                        this.addToFavourites();
                    }

                    // Update icons
                    if (this.isFavourite()){
                        favouritesButton.replaceChild(hearthFullIcon, icon);
                        icon= hearthFullIcon;
                    }
                    else{
                        favouritesButton.replaceChild(hearthEmptyIcon, icon);
                        icon= hearthEmptyIcon;
                    }
                });
            }

            const description= document.createElement("p");
            description.innerText= this.description;

            this.#domElement.append(
                image,
                chips,
                favouritesButton,
                description,
            );
        }
    }

    get domElement(){
        return this.#domElement;
    }

    #getFavourites(){
        return JSON.parse(localStorage.getItem(CatCard.#FAVOURITES_KEY) || "[]");
    }

    addToFavourites(){
        const favourites= this.#getFavourites();
        favourites.push(this.id);
        localStorage.setItem(CatCard.#FAVOURITES_KEY, JSON.stringify(favourites));
    }

    removeFromFavourites(){
        let favourites= this.#getFavourites();
        favourites= favourites.filter(el => el!== this.id);
        localStorage.setItem(CatCard.#FAVOURITES_KEY, JSON.stringify(favourites));
    }

    isFavourite(){
        const favourites= this.#getFavourites();
        return favourites.includes(this.id);
    }
}