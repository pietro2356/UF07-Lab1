import { applyStyleToElement } from "./utils.js";

export default class Chip{
    #domElement;

    constructor(text, style){
        this.text= text;
        this.style= style;

        this.#init();
    }

    #init(){
        this.#domElement= document.createElement("div");
        applyStyleToElement(this.#domElement, {
            display: "flex",
            border: "1px dashed black",
            whitespace: "none",
            borderRadius: "4px",
            padding: "4px",
            textWrap: "nowrap"
        });

        {
            const text= document.createElement("p");
            text.innerText= this.text;

            this.#domElement.append(
                text,
            );
        }
    }

    get domElement(){
        return this.#domElement;
    }
}