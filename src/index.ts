import randomizeSquare from "./functions/randomizeSquare";
import createGrid from "./functions/Grid";
import { saveMapToLocalStorage, loadMapFromLocalStorage } from "./functions/Save";

document.addEventListener('DOMContentLoaded', () => {
  // Active every square selected.
  const createGridBtn: HTMLButtonElement = document.getElementById('create-grid-btn') as HTMLButtonElement;
  createGridBtn.addEventListener('click', () => {
    const rows: number = parseInt((document.getElementById('rows') as HTMLInputElement).value);
    const cols: number = parseInt((document.getElementById('cols') as HTMLInputElement).value);
    if (rows > 0 && cols > 0) createGrid(rows, cols, 'point'); // Create grid.
    else alert('Inserisci valori validi per righe e colonne.');
  });

  const randomizeBtn: HTMLButtonElement = document.getElementById('randomize-btn') as HTMLButtonElement;
  randomizeBtn.addEventListener('click', randomizeSquare); // Chiama la funzione di randomizzazione al click del pulsante

  (document.getElementById('save-btn') as HTMLButtonElement).addEventListener('click', () => {
    const gridContainer: HTMLElement = document.getElementById('grid-container') as HTMLElement;
    saveMapToLocalStorage(gridContainer);
  });
  (document.getElementById('load-btn') as HTMLButtonElement).addEventListener('click', () => {
    const gridContainer: HTMLElement = document.getElementById('grid-container') as HTMLElement;
    loadMapFromLocalStorage(gridContainer);
  });

  // Crea una griglia di dimensioni predefinite all'avvio della pagina
  createGrid(10, 10, 'point');
});
