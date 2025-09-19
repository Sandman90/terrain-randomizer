import randomizeSquare from "./functions/randomizeSquare";
import createGrid from "./functions/grid";

document.addEventListener('DOMContentLoaded', () => {
    // Active every square selected.
    const createGridBtn: HTMLButtonElement = document.getElementById('create-grid-btn') as HTMLButtonElement;
    createGridBtn.addEventListener('click', () => {
        const rows: number = parseInt((document.getElementById('rows') as HTMLInputElement).value);
        const cols: number = parseInt((document.getElementById('cols') as HTMLInputElement).value);
        if (rows > 0 && cols > 0) createGrid(rows, cols, 'box'); // Create grid.
        else alert('Inserisci valori validi per righe e colonne.');
    });

    const randomizeBtn: HTMLButtonElement = document.getElementById('randomize-btn') as HTMLButtonElement;
    randomizeBtn.addEventListener('click', randomizeSquare); // Chiama la funzione di randomizzazione al click del pulsante

    // Crea una griglia di dimensioni predefinite all'avvio della pagina
    createGrid(15, 15, 'box');
});
