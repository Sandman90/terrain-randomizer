import randomizeSquare from "./functions/randomizeSquare";
import createGrid from "./functions/grid";

document.addEventListener('DOMContentLoaded', () => {
    // Active every square selected.
    const createGridBtn: HTMLButtonElement = document.getElementById('create-grid-btn') as HTMLButtonElement;
    const rowsInput: HTMLInputElement = document.getElementById('rows') as HTMLInputElement;
    const rows: number = parseInt(rowsInput.value);
    const colsInput: HTMLInputElement = document.getElementById('cols') as HTMLInputElement;
    const cols: number = parseInt(colsInput.value);
    createGridBtn.addEventListener('click', () => {
        if (rows > 0 && cols > 0) createGrid(rows, cols, 'cross'); // Create grid.
        else alert('Inserisci valori validi per righe e colonne.');
    });

    const randomizeBtn: HTMLButtonElement = document.getElementById('randomize-btn') as HTMLButtonElement;
    randomizeBtn.addEventListener('click', randomizeSquare); // Chiama la funzione di randomizzazione al click del pulsante

    // Crea una griglia di dimensioni predefinite all'avvio della pagina
    createGrid(15, 15, 'cross');
});
