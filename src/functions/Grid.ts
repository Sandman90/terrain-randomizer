import { BrushType, brush } from './Brush';

const gridContainer: HTMLElement = document.getElementById('grid-container') as HTMLElement;

let isMouseDown = false;
let startSquare: HTMLElement | null = null;
let selectedSquares: Set<HTMLElement> = new Set(); // Usiamo un Set per evitare duplicati
let isDraggingRightClick = false;

// Funzione per creare la griglia con annotazioni di tipo
function createGrid(rows: number, cols: number, brushType: BrushType): void {
  // Pulisce il contenuto precedente del contenitore
  gridContainer.innerHTML = '';

  // Imposta i template per le righe e le colonne della griglia CSS
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  // Calcola la larghezza del contenitore in base al numero di colonne e alla dimensione dei quadrati + bordi
  gridContainer.style.width = `${cols * 52 - 1}px`; // Assumendo che ogni quadrato sia 50px + 2px di bordo totale

  // Crea i singoli quadrati della griglia
  for (let i = 0; i < rows * cols; i++) {
    const square: HTMLDivElement = document.createElement('div');
    square.classList.add('grid-square');
    gridContainer.appendChild(square);
  }

  // Active every square selected.
  addSquareListeners(brushType, cols);
  // squares.forEach(square => square.addEventListener('mousedown', () => square.classList.add('active')));
}

// Funzione per aggiungere listener ai quadrati
function addSquareListeners(brushType: BrushType, cols: number): void {
  const squares: NodeListOf<HTMLElement> = document.querySelectorAll('.grid-square');
  const squaresArray = Array.from(squares);
  squares.forEach(square => {
    const squareListener = (e: MouseEvent) => {
      e.preventDefault();
      if (e.button === 2) { // 0 è sinistro, 1 è centrale, 2 è destro
        isDraggingRightClick = true;
        square.classList.remove('active');
      } else {
        brush(brushType, squaresArray, e.target, squares, cols);
        square.classList.add('active'); // Seleziona il primo quadrato
      }
      startSquare = square;
      isMouseDown = true;
      selectedSquares.clear(); // Pulisce le selezioni precedenti
      selectedSquares.add(square);
    };
    square.removeEventListener('mousedown', squareListener);
    square.addEventListener('mousedown', squareListener);

    const squareOverListener = (e: MouseEvent) => {
      if (!isMouseDown || !startSquare) return;
      const currentSquare = e.target as HTMLElement;
      if (currentSquare.classList.contains('grid-square') && !selectedSquares.has(currentSquare)) {
        if (isDraggingRightClick) {
          currentSquare.classList.remove('active', 'selected');
        } else {
          brush(brushType, squaresArray, e.target, squares, cols);
          currentSquare.classList.add('active');
        }
        selectedSquares.add(currentSquare);
      }
    };
    square.removeEventListener('mouseover', squareOverListener);
    square.addEventListener('mouseover', squareOverListener);
  });

  // Listener globale per 'mouseup' per fermare il tracciamento
  const squareUpListener = (event: MouseEvent) => {
    if (isDraggingRightClick || isMouseDown) {
      event.preventDefault();
      isDraggingRightClick = false;
      isMouseDown = false;
      startSquare = null;
    }
  };
  document.removeEventListener('mouseup', squareUpListener);
  document.addEventListener('mouseup', squareUpListener);
}

export { createGrid, addSquareListeners };