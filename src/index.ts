import randomizeSquare from "./functions/randomizeSquare";
import createGrid from "./functions/Grid";
import { saveMapToLocalStorage, loadMapFromLocalStorage } from "./functions/Save";

document.addEventListener('DOMContentLoaded', () => {
  // Active every square selected.
  const createGridBtn: HTMLButtonElement = document.getElementById('create-grid-btn') as HTMLButtonElement;
  createGridBtn.addEventListener('click', () => {
    // const rows: number = parseInt((document.getElementById('rows') as HTMLInputElement).value);
    // const cols: number = parseInt((document.getElementById('cols') as HTMLInputElement).value);
    const range: number = parseInt((document.getElementById('grid-range') as HTMLInputElement).value);

    // if (rows > 0 && cols > 0) createGrid(rows, cols, 'point'); // Create grid.
    if (range > 0) createGrid(range, range, 'point'); // Create grid.
    else alert('Inserisci valori validi per righe e colonne.');
  });

  (document.getElementById('grid-range') as HTMLElement).addEventListener('change', (e: Event | null) => {
    const gridRange = parseInt((e?.target as HTMLInputElement).value);
    (document.getElementById('grid-label') as HTMLElement).innerText = gridRange + 'x' + gridRange;
  });

  (document.getElementById('randomize-btn') as HTMLButtonElement).addEventListener('click', randomizeSquare);
  // Chiama la funzione di randomizzazione al click del pulsante.

  (document.getElementById('save-btn') as HTMLButtonElement).addEventListener('click', () => {
    const gridContainer: HTMLElement = document.getElementById('grid-container') as HTMLElement;
    const mapName = (document.getElementById('map-name') as HTMLInputElement).value;
    saveMapToLocalStorage(gridContainer, mapName);
  });
  (document.getElementById('load-btn') as HTMLButtonElement).addEventListener('click', () => {
    const gridContainer: HTMLElement = document.getElementById('grid-container') as HTMLElement;
    const mapName = (document.getElementById('map-names') as HTMLInputElement).value;
    loadMapFromLocalStorage(gridContainer, mapName);
  });

  // Crea una griglia di dimensioni predefinite all'avvio della pagina
  createGrid(15, 15, 'point');
});
