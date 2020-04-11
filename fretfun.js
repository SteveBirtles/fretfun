let w = 0, h = 0;
const baseImage = new Image();
const cheatImage = new Image();
let cheat = false;

const notes = [ "E", "F", null, "G", null, "A", null, "B", "C",
                "B", "C", null, "D", null, "E", "F", null, "G",
                "G", null, "A", null, "B", "C", null, "D", null,
                "D", null, "E", "F", null, "G", null, "A", null,
                "A", null, "B", "C", null, "D", null, "E", "F",
                "E", "F", null, "G", null, "A", null, "B", "C" ];

const scores = [];

function fixSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const canvas = document.getElementById('fretCanvas');
    canvas.width = w;
    canvas.height = h;
}

let theOne;

function pickOne() {
    let lastOne = theOne;
    do {
        theOne = Math.floor(Math.random() * notes.length);
    } while (notes[theOne] === null || lastOne === theOne);
    scores[theOne].seen++;
    theColour = "navy";
}

function pageLoad() {

    for (let n = 0; n < notes.length; n++) {
        scores.push({ seen: 0, correct:0 });
    }
    pickOne();

    window.addEventListener("resize", fixSize);
    fixSize();

    document.addEventListener('keydown', checkIt);

    baseImage.src = "Base.png";
    baseImage.onload = () => window.requestAnimationFrame(redraw);
    cheatImage.src = "Solution.png";

}

function checkIt(event) {

    if (event.key === " ") {
        cheat = !cheat;
        return;
    }

    if (event.key.toUpperCase() === notes[theOne]) {
        if (theColour === "navy") {
            scores[theOne].correct++;
        }
        pickOne();
    } else {
        theColour = "red";
    }
}

function redraw() {

    const canvas = document.getElementById('fretCanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = 'white';
    context.fillRect(0, 0, w, h);

    const left = w/2 - baseImage.width/2;
    const top = h/2 - baseImage.height/2;

    if (cheat) {
        context.drawImage(cheatImage, left, top);
    } else {
        context.drawImage(baseImage, left, top);
    }

    context.font = "14px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    let n = -1;

    for (let string = 0; string < 6; string++) {
        for (let fret = 0; fret < 9; fret++) {

            n++;
            if (notes[n] === null) continue;

            if (n === theOne) {
                context.fillStyle = theColour;
            } else {
                if (scores[n].seen - scores[n].correct > 0) {
                    context.fillStyle = "maroon";
                } else {
                    context.fillStyle = "grey";
                }
            }

            let x = left + 42 + fret*104;
            let y = top + 93 + string*71;

            if (!(cheat && n === theOne)) {
                context.beginPath();
                context.arc(x, y, 30, 0, 2*Math.PI);
                context.fill();
            }

            if (scores[n].seen > 0 && theOne !== n) {
                context.strokeText(Math.floor(100 * scores[n].correct / scores[n].seen) + "%", x, y);
            }

        }
    }

    window.requestAnimationFrame(redraw);

}
