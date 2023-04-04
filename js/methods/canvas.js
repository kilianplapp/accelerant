import { hash } from "../utils/hash";
export async function canvas() {
    const canvas = document.createElement("canvas");
    canvas.id = "c3";
    canvas.style.display = "none";
    canvas.height = 30;
    canvas.width = 700;
    canvas.style.background = "white";

    // insert it into the dom
    document.body.appendChild(canvas);

    // get the 2d context and apply the text
    const context = canvas.getContext("2d");
    context.font = "18pt Arial";
    context.textBaseline = "top";
    context.fillText("How quickly daft jumping zebras vex. (Also, punctuation: Ɛ/ζ}Φ)", 2, 2);

    // fetch the base64 encoded image
    const data = canvas.toDataURL("image/png");
    const fingerprint = hash(data);
    return fingerprint;
}

