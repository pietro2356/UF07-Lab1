import Chip from "./Chip.js";
import { applyStyleToElement } from "./utils.js";

export default class CatCard{
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
                // width: "128px",
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

            const description= document.createElement("p");
            description.innerText= this.description;

            this.#domElement.append(
                image,
                chips,
                description,
            );
        }
    }

    get domElement(){
        return this.#domElement;
    }
}