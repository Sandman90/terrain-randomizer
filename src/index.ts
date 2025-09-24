import randomizeSquare from "./functions/randomizeSquare";
import { createGrid, addSquareListeners } from "./functions/Grid";
import { BrushType } from "./functions/Brush";
import { saveMapToLocalStorage, loadMapFromLocalStorage } from "./functions/Save";
import {back, BackType} from "./functions/Background";

document.addEventListener('DOMContentLoaded', () => {
  let brushType: string = 'cross';
  let gridCols: number = 15;
  let gridRows: number = 15;
  const gridContainer: HTMLElement = document.getElementById('grid-container') as HTMLElement;

  // Active every square selected.
  const createGridBtn: HTMLButtonElement = document.getElementById('create-grid-btn') as HTMLButtonElement;
  createGridBtn.addEventListener('click', () => {
    gridRows = parseInt((document.getElementById('grid-range-rows') as HTMLInputElement).value);
    gridCols = parseInt((document.getElementById('grid-range') as HTMLInputElement).value);
    createGrid(gridRows, gridCols, brushType as BrushType);
  });
  (document.getElementById('clear-btn') as HTMLButtonElement).addEventListener('click', () => {
    createGrid(gridRows, gridCols, brushType as BrushType);
  });

  (document.getElementById('grid-range') as HTMLElement).addEventListener('change', (e: Event | null) => {
    gridCols = parseInt((e?.target as HTMLInputElement).value);
    (document.getElementById('grid-label') as HTMLElement).innerText = gridCols + 'x' + gridRows;
  });

  (document.getElementById('randomize-btn') as HTMLButtonElement).addEventListener('click', randomizeSquare);
  // Chiama la funzione di randomizzazione al click del pulsante.

  (document.getElementById('save-btn') as HTMLButtonElement).addEventListener('click', () => {
    const mapName = (document.getElementById('map-name') as HTMLInputElement).value;
    saveMapToLocalStorage(gridContainer, mapName);
  });
  (document.getElementById('load-btn') as HTMLButtonElement).addEventListener('click', () => {
    const mapName = (document.getElementById('map-names') as HTMLInputElement).value;
    loadMapFromLocalStorage(gridContainer, mapName);
  });

  (document.querySelectorAll('input[name="brush-options"]')).forEach(radio => {
    radio.addEventListener('click', (e: Event) => {
      brushType = (e?.target as HTMLInputElement).value;
      addSquareListeners(brushType as BrushType, gridCols);
    });
  });
  (document.querySelectorAll('input[name="back-options"]')).forEach(radio => {
    radio.addEventListener('click', (e: Event) => back(gridContainer, ((e?.target as HTMLInputElement).value as BackType)));
  });

  // Crea una griglia di dimensioni predefinite all'avvio della pagina
  createGrid(gridRows, gridCols, brushType as BrushType);
});
