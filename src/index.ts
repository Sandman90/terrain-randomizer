import randomizeSquare from "./functions/randomizeSquare";
import createGrid from "./functions/grid";

// On page load.
document.addEventListener('DOMContentLoaded', () => {
    // Seleziona gli elementi dal DOM e annota i loro tipi
    const createGridBtn: HTMLButtonElement = document.getElementById('create-grid-btn') as HTMLButtonElement;
    const randomizeBtn: HTMLButtonElement = document.getElementById('randomize-btn') as HTMLButtonElement;
    const rowsInput: HTMLInputElement = document.getElementById('rows') as HTMLInputElement;
    const colsInput: HTMLInputElement = document.getElementById('cols') as HTMLInputElement;

    // Active every square selected.
    createGridBtn.addEventListener('click', () => {
        // Converte i valori degli input in numeri interi, gestendo potenziali valori non validi
        const rows: number = parseInt(rowsInput.value);
        const cols: number = parseInt(colsInput.value);

        // Verifica che i valori inseriti siano numeri positivi
        if (rows > 0 && cols > 0) {
            createGrid(rows, cols); // Chiama la funzione per creare la griglia
        } else {
            alert('Inserisci valori validi per righe e colonne.'); // Messaggio di errore se i valori non sono validi
        }
    });

    // Aggiunge i gestori degli eventi ai pulsanti
    createGridBtn.addEventListener('click', () => {
        // Converte i valori degli input in numeri interi, gestendo potenziali valori non validi
        const rows: number = parseInt(rowsInput.value);
        const cols: number = parseInt(colsInput.value);

        // Verifica che i valori inseriti siano numeri positivi
        if (rows > 0 && cols > 0) {
            createGrid(rows, cols); // Chiama la funzione per creare la griglia
        } else {
            alert('Inserisci valori validi per righe e colonne.'); // Messaggio di errore se i valori non sono validi
        }
    });

    randomizeBtn.addEventListener('click', randomizeSquare); // Chiama la funzione di randomizzazione al click del pulsante

    // Crea una griglia di dimensioni predefinite all'avvio della pagina
    createGrid(15, 15);
});
