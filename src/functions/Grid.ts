import { BrushType, brush } from './Brush';

const gridContainer: HTMLElement = document.getElementById('grid-container') as HTMLElement;

// let isMouseDown = false;
// let startSquare: HTMLElement | null = null;
// let selectedSquares: Set<HTMLElement> = new Set(); // Usiamo un Set per evitare duplicati
// let isDraggingRightClick = false;

// Funzione per creare la griglia con annotazioni di tipo
function createGrid(rows: number, cols: number, brushType: BrushType): void {
  // Pulisce il contenuto precedente del contenitore
  gridContainer.innerHTML = '';

  // Imposta i template per le righe e le colonne della griglia CSS
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  // Calcola la larghezza del contenitore in base al numero di colonne e alla dimensione dei quadrati + bordi
  gridContainer.style.width = `${cols * 42 - 1}px`; // Assumendo che ogni quadrato sia 50px + 2px di bordo totale

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

let isMouseDown = false;
let startSquare: HTMLElement | null = null;
let selectedSquares: Set<HTMLElement> = new Set();
let isDraggingRightClick = false;

// Variabili globali per memorizzare i riferimenti ai listener
let squareListenerRef: ((e: MouseEvent) => void) | null = null;
let squareOverListenerRef: ((e: MouseEvent) => void) | null = null;
let squareUpListenerRef: ((e: MouseEvent) => void) | null = null;

// Funzione per rimuovere tutti i vecchi listener
function removeOldListeners(): void {
  const squares: NodeListOf<HTMLElement> = document.querySelectorAll('.grid-square');
  squares.forEach(square => {
    if (squareListenerRef) {
      square.removeEventListener('mousedown', squareListenerRef);
    }
    if (squareOverListenerRef) {
      square.removeEventListener('mouseover', squareOverListenerRef);
    }
  });

  if (squareUpListenerRef) {
    document.removeEventListener('mouseup', squareUpListenerRef);
  }
}

// Funzione principale per aggiungere nuovi listener
function addSquareListeners(brushType: BrushType, cols: number): void {
  // Rimuove i vecchi listener prima di applicare i nuovi
  removeOldListeners();

  const squares: NodeListOf<HTMLElement> = document.querySelectorAll('.grid-square');
  const squaresArray = Array.from(squares);

  // Dichiarazione dei listener con un nome, in modo che possano essere rimossi
  squareListenerRef = (e: MouseEvent) => {
    e.preventDefault();
    if (e.button === 2) {
      isDraggingRightClick = true;
      (e.target as HTMLElement).classList.remove('active');
    } else {
      brush(brushType, squaresArray, e.target as HTMLElement, squares, cols);
      (e.target as HTMLElement).classList.add('active');
    }
    startSquare = e.target as HTMLElement;
    isMouseDown = true;
    selectedSquares.clear();
    selectedSquares.add(e.target as HTMLElement);
  };

  squareOverListenerRef = (e: MouseEvent) => {
    if (!isMouseDown || !startSquare) return;
    const currentSquare = e.target as HTMLElement;
    if (currentSquare.classList.contains('grid-square') && !selectedSquares.has(currentSquare)) {
      if (isDraggingRightClick) {
        currentSquare.classList.remove('active', 'selected');
      } else {
        brush(brushType, squaresArray, currentSquare, squares, cols);
        currentSquare.classList.add('active');
      }
      selectedSquares.add(currentSquare);
      // console.log('brushType listener: ', brushType);
    }
  };

  squareUpListenerRef = (event: MouseEvent) => {
    if (isDraggingRightClick || isMouseDown) {
      event.preventDefault();
      isDraggingRightClick = false;
      isMouseDown = false;
      startSquare = null;
    }
  };

  // Applicazione dei nuovi listener
  squares.forEach(square => {
    square.addEventListener('mousedown', squareListenerRef as (e: MouseEvent) => void);
    square.addEventListener('mouseover', squareOverListenerRef as (e: MouseEvent) => void);
  });
  document.addEventListener('mouseup', squareUpListenerRef as (e: MouseEvent) => void);
}

export { createGrid, addSquareListeners };