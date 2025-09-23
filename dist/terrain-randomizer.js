/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/functions/Brush.ts":
/*!********************************!*\
  !*** ./src/functions/Brush.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.brush = brush;
function brush(brushType, squaresArray, e, squares, cols) {
    switch (brushType) {
        case "cross":
            brushCross(squaresArray, e, squares, cols);
            break;
        case "box":
            brushBox(squaresArray, e, squares, cols);
            break;
        default:
        case "point":
            break;
    }
}
function brushCross(squaresArray, e, squares, cols) {
    const currentIndex = squaresArray.indexOf(e);
    // Up/Down.
    const aboveIndex = currentIndex - cols;
    if (aboveIndex >= 0)
        squares[aboveIndex].classList.add('active');
    const belowIndex = currentIndex + cols;
    if (belowIndex < squares.length)
        squares[belowIndex].classList.add('active');
    // Left/Right.
    const beforeIndex = currentIndex - 1;
    if (beforeIndex >= 0 && beforeIndex % cols !== (cols - 1))
        squares[beforeIndex].classList.add('active');
    const afterIndex = currentIndex + 1;
    if (afterIndex < squares.length && afterIndex % cols !== 0)
        squares[afterIndex].classList.add('active');
    // console.log('beforeIndex: ', beforeIndex, 'afterIndex:', afterIndex, 'Mod: ', beforeIndex % cols, (cols-1));
}
function brushBox(squaresArray, e, squares, cols) {
    const currentIndex = squaresArray.indexOf(e);
    // Up/Down.
    const aboveIndex = currentIndex - cols;
    if (aboveIndex - 1 >= 0) {
        squares[aboveIndex - 1].classList.add('active');
        squares[aboveIndex + 1].classList.add('active');
    }
    const belowIndex = currentIndex + cols;
    if (belowIndex + 1 < squares.length) {
        squares[belowIndex - 1].classList.add('active');
        squares[belowIndex + 1].classList.add('active');
    }
    brushCross(squaresArray, e, squares, cols);
}


/***/ }),

/***/ "./src/functions/Grid.ts":
/*!*******************************!*\
  !*** ./src/functions/Grid.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = createGrid;
const Brush_1 = __webpack_require__(/*! ./Brush */ "./src/functions/Brush.ts");
const gridContainer = document.getElementById('grid-container');
let isMouseDown = false;
let startSquare = null;
let selectedSquares = new Set(); // Usiamo un Set per evitare duplicati
let isDraggingRightClick = false;
// Funzione per creare la griglia con annotazioni di tipo
function createGrid(rows, cols, brushType) {
    // Pulisce il contenuto precedente del contenitore
    gridContainer.innerHTML = '';
    // Imposta i template per le righe e le colonne della griglia CSS
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    // Calcola la larghezza del contenitore in base al numero di colonne e alla dimensione dei quadrati + bordi
    gridContainer.style.width = `${cols * 52 - 1}px`; // Assumendo che ogni quadrato sia 50px + 2px di bordo totale
    // Crea i singoli quadrati della griglia
    for (let i = 0; i < rows * cols; i++) {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        gridContainer.appendChild(square);
    }
    // Active every square selected.
    const squares = document.querySelectorAll('.grid-square');
    addSquareListeners(brushType, squares, cols);
    // squares.forEach(square => square.addEventListener('mousedown', () => square.classList.add('active')));
}
// Funzione per aggiungere listener ai quadrati
function addSquareListeners(brushType, squares, cols) {
    const squaresArray = Array.from(squares);
    squares.forEach(square => {
        square.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (e.button === 2) { // 0 è sinistro, 1 è centrale, 2 è destro
                isDraggingRightClick = true;
                square.classList.remove('active');
            }
            else {
                (0, Brush_1.brush)(brushType, squaresArray, e.target, squares, cols);
                square.classList.add('active'); // Seleziona il primo quadrato
            }
            startSquare = square;
            isMouseDown = true;
            selectedSquares.clear(); // Pulisce le selezioni precedenti
            selectedSquares.add(square);
        });
        square.addEventListener('mouseover', (e) => {
            if (!isMouseDown || !startSquare)
                return;
            const currentSquare = e.target;
            if (currentSquare.classList.contains('grid-square') && !selectedSquares.has(currentSquare)) {
                if (isDraggingRightClick) {
                    currentSquare.classList.remove('active', 'selected');
                }
                else {
                    (0, Brush_1.brush)(brushType, squaresArray, e.target, squares, cols);
                    currentSquare.classList.add('active');
                }
                selectedSquares.add(currentSquare);
            }
        });
    });
    gridContainer.addEventListener('contextmenu', (e) => e.preventDefault());
    // Listener globale per 'mouseup' per fermare il tracciamento
    document.addEventListener('mouseup', (event) => {
        if (isDraggingRightClick || isMouseDown) {
            event.preventDefault();
            isDraggingRightClick = false;
            isMouseDown = false;
            startSquare = null;
        }
    });
}


/***/ }),

/***/ "./src/functions/Save.ts":
/*!*******************************!*\
  !*** ./src/functions/Save.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.saveMapToLocalStorage = saveMapToLocalStorage;
exports.loadMapFromLocalStorage = loadMapFromLocalStorage;
// Assumendo che 'gridContainer' sia il contenitore della tua griglia
function saveMapToLocalStorage(gridContainer) {
    const squares = Array.from(gridContainer.children);
    const mapData = squares.map(square => ({
        s: square.classList.contains('active')
    }));
    // Serializza i dati in una stringa JSON
    const serializedMap = JSON.stringify(mapData);
    // Salva la stringa nel LocalStorage con una chiave
    localStorage.setItem('savedMap', serializedMap);
    console.log('Mappa salvata con successo.');
}
function loadMapFromLocalStorage(gridContainer) {
    // Recupera la stringa serializzata
    const serializedMap = localStorage.getItem('savedMap');
    if (serializedMap) {
        try {
            // Deserializza la stringa in un array di oggetti
            const mapData = JSON.parse(serializedMap);
            const squares = Array.from(gridContainer.children);
            // Assicurati che le dimensioni della griglia corrispondano ai dati salvati
            if (mapData.length === squares.length) {
                // Applica lo stato salvato a ogni quadrato della griglia
                mapData.forEach((data, index) => {
                    if (data.s) {
                        squares[index].classList.add('active');
                    }
                    else {
                        squares[index].classList.remove('active');
                    }
                });
                console.log('Mappa caricata con successo.');
            }
            else {
                console.warn('Le dimensioni della griglia non corrispondono ai dati salvati.');
            }
        }
        catch (e) {
            console.error('Errore durante la deserializzazione dei dati.', e);
        }
    }
    else {
        console.log('Nessuna mappa salvata trovata.');
    }
}


/***/ }),

/***/ "./src/functions/randomizeSquare.ts":
/*!******************************************!*\
  !*** ./src/functions/randomizeSquare.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = randomizeSquare;
// Funzione per randomizzare un quadrato con annotazioni di tipo
function randomizeSquare() {
    // Seleziona tutti gli elementi con la classe 'grid-square'
    const squares = document.querySelectorAll('.grid-square.active');
    // Verifica se ci sono quadrati nella griglia
    if (squares.length === 0) {
        alert('Per favore, crea prima una griglia!');
        return;
    }
    // Rimuove la classe 'selected' da tutti i quadrati per deselezionare quello precedentemente evidenziato
    squares.forEach(square => square.classList.remove('selected'));
    // Calcola un indice casuale all'interno dell'array di quadrati
    const randomIndex = Math.floor(Math.random() * squares.length);
    // Aggiunge la classe 'selected' al quadrato scelto casualmente
    squares[randomIndex].classList.add('selected');
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const randomizeSquare_1 = __importDefault(__webpack_require__(/*! ./functions/randomizeSquare */ "./src/functions/randomizeSquare.ts"));
const Grid_1 = __importDefault(__webpack_require__(/*! ./functions/Grid */ "./src/functions/Grid.ts"));
const Save_1 = __webpack_require__(/*! ./functions/Save */ "./src/functions/Save.ts");
document.addEventListener('DOMContentLoaded', () => {
    // Active every square selected.
    const createGridBtn = document.getElementById('create-grid-btn');
    createGridBtn.addEventListener('click', () => {
        const rows = parseInt(document.getElementById('rows').value);
        const cols = parseInt(document.getElementById('cols').value);
        if (rows > 0 && cols > 0)
            (0, Grid_1.default)(rows, cols, 'point'); // Create grid.
        else
            alert('Inserisci valori validi per righe e colonne.');
    });
    const randomizeBtn = document.getElementById('randomize-btn');
    randomizeBtn.addEventListener('click', randomizeSquare_1.default); // Chiama la funzione di randomizzazione al click del pulsante
    document.getElementById('save-btn').addEventListener('click', () => {
        const gridContainer = document.getElementById('grid-container');
        (0, Save_1.saveMapToLocalStorage)(gridContainer);
    });
    document.getElementById('load-btn').addEventListener('click', () => {
        const gridContainer = document.getElementById('grid-container');
        (0, Save_1.loadMapFromLocalStorage)(gridContainer);
    });
    // Crea una griglia di dimensioni predefinite all'avvio della pagina
    (0, Grid_1.default)(10, 10, 'point');
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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azovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvQnJ1c2gudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9HcmlkLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvU2F2ZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL3JhbmRvbWl6ZVNxdWFyZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnJ1c2ggPSBicnVzaDtcbmZ1bmN0aW9uIGJydXNoKGJydXNoVHlwZSwgc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgc3dpdGNoIChicnVzaFR5cGUpIHtcbiAgICAgICAgY2FzZSBcImNyb3NzXCI6XG4gICAgICAgICAgICBicnVzaENyb3NzKHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJveFwiOlxuICAgICAgICAgICAgYnJ1c2hCb3goc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICBjYXNlIFwicG9pbnRcIjpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGJydXNoQ3Jvc3Moc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gc3F1YXJlc0FycmF5LmluZGV4T2YoZSk7XG4gICAgLy8gVXAvRG93bi5cbiAgICBjb25zdCBhYm92ZUluZGV4ID0gY3VycmVudEluZGV4IC0gY29scztcbiAgICBpZiAoYWJvdmVJbmRleCA+PSAwKVxuICAgICAgICBzcXVhcmVzW2Fib3ZlSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIGNvbnN0IGJlbG93SW5kZXggPSBjdXJyZW50SW5kZXggKyBjb2xzO1xuICAgIGlmIChiZWxvd0luZGV4IDwgc3F1YXJlcy5sZW5ndGgpXG4gICAgICAgIHNxdWFyZXNbYmVsb3dJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgLy8gTGVmdC9SaWdodC5cbiAgICBjb25zdCBiZWZvcmVJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XG4gICAgaWYgKGJlZm9yZUluZGV4ID49IDAgJiYgYmVmb3JlSW5kZXggJSBjb2xzICE9PSAoY29scyAtIDEpKVxuICAgICAgICBzcXVhcmVzW2JlZm9yZUluZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICBjb25zdCBhZnRlckluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcbiAgICBpZiAoYWZ0ZXJJbmRleCA8IHNxdWFyZXMubGVuZ3RoICYmIGFmdGVySW5kZXggJSBjb2xzICE9PSAwKVxuICAgICAgICBzcXVhcmVzW2FmdGVySW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdiZWZvcmVJbmRleDogJywgYmVmb3JlSW5kZXgsICdhZnRlckluZGV4OicsIGFmdGVySW5kZXgsICdNb2Q6ICcsIGJlZm9yZUluZGV4ICUgY29scywgKGNvbHMtMSkpO1xufVxuZnVuY3Rpb24gYnJ1c2hCb3goc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gc3F1YXJlc0FycmF5LmluZGV4T2YoZSk7XG4gICAgLy8gVXAvRG93bi5cbiAgICBjb25zdCBhYm92ZUluZGV4ID0gY3VycmVudEluZGV4IC0gY29scztcbiAgICBpZiAoYWJvdmVJbmRleCAtIDEgPj0gMCkge1xuICAgICAgICBzcXVhcmVzW2Fib3ZlSW5kZXggLSAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgc3F1YXJlc1thYm92ZUluZGV4ICsgMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGNvbnN0IGJlbG93SW5kZXggPSBjdXJyZW50SW5kZXggKyBjb2xzO1xuICAgIGlmIChiZWxvd0luZGV4ICsgMSA8IHNxdWFyZXMubGVuZ3RoKSB7XG4gICAgICAgIHNxdWFyZXNbYmVsb3dJbmRleCAtIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICBzcXVhcmVzW2JlbG93SW5kZXggKyAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgYnJ1c2hDcm9zcyhzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVHcmlkO1xuY29uc3QgQnJ1c2hfMSA9IHJlcXVpcmUoXCIuL0JydXNoXCIpO1xuY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLWNvbnRhaW5lcicpO1xubGV0IGlzTW91c2VEb3duID0gZmFsc2U7XG5sZXQgc3RhcnRTcXVhcmUgPSBudWxsO1xubGV0IHNlbGVjdGVkU3F1YXJlcyA9IG5ldyBTZXQoKTsgLy8gVXNpYW1vIHVuIFNldCBwZXIgZXZpdGFyZSBkdXBsaWNhdGlcbmxldCBpc0RyYWdnaW5nUmlnaHRDbGljayA9IGZhbHNlO1xuLy8gRnVuemlvbmUgcGVyIGNyZWFyZSBsYSBncmlnbGlhIGNvbiBhbm5vdGF6aW9uaSBkaSB0aXBvXG5mdW5jdGlvbiBjcmVhdGVHcmlkKHJvd3MsIGNvbHMsIGJydXNoVHlwZSkge1xuICAgIC8vIFB1bGlzY2UgaWwgY29udGVudXRvIHByZWNlZGVudGUgZGVsIGNvbnRlbml0b3JlXG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAvLyBJbXBvc3RhIGkgdGVtcGxhdGUgcGVyIGxlIHJpZ2hlIGUgbGUgY29sb25uZSBkZWxsYSBncmlnbGlhIENTU1xuICAgIGdyaWRDb250YWluZXIuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtyb3dzfSwgMWZyKWA7XG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke2NvbHN9LCAxZnIpYDtcbiAgICAvLyBDYWxjb2xhIGxhIGxhcmdoZXp6YSBkZWwgY29udGVuaXRvcmUgaW4gYmFzZSBhbCBudW1lcm8gZGkgY29sb25uZSBlIGFsbGEgZGltZW5zaW9uZSBkZWkgcXVhZHJhdGkgKyBib3JkaVxuICAgIGdyaWRDb250YWluZXIuc3R5bGUud2lkdGggPSBgJHtjb2xzICogNTIgLSAxfXB4YDsgLy8gQXNzdW1lbmRvIGNoZSBvZ25pIHF1YWRyYXRvIHNpYSA1MHB4ICsgMnB4IGRpIGJvcmRvIHRvdGFsZVxuICAgIC8vIENyZWEgaSBzaW5nb2xpIHF1YWRyYXRpIGRlbGxhIGdyaWdsaWFcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3MgKiBjb2xzOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdncmlkLXNxdWFyZScpO1xuICAgICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgfVxuICAgIC8vIEFjdGl2ZSBldmVyeSBzcXVhcmUgc2VsZWN0ZWQuXG4gICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZScpO1xuICAgIGFkZFNxdWFyZUxpc3RlbmVycyhicnVzaFR5cGUsIHNxdWFyZXMsIGNvbHMpO1xuICAgIC8vIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4gc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSkpO1xufVxuLy8gRnVuemlvbmUgcGVyIGFnZ2l1bmdlcmUgbGlzdGVuZXIgYWkgcXVhZHJhdGlcbmZ1bmN0aW9uIGFkZFNxdWFyZUxpc3RlbmVycyhicnVzaFR5cGUsIHNxdWFyZXMsIGNvbHMpIHtcbiAgICBjb25zdCBzcXVhcmVzQXJyYXkgPSBBcnJheS5mcm9tKHNxdWFyZXMpO1xuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChlLmJ1dHRvbiA9PT0gMikgeyAvLyAwIMOoIHNpbmlzdHJvLCAxIMOoIGNlbnRyYWxlLCAyIMOoIGRlc3Ryb1xuICAgICAgICAgICAgICAgIGlzRHJhZ2dpbmdSaWdodENsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAoMCwgQnJ1c2hfMS5icnVzaCkoYnJ1c2hUeXBlLCBzcXVhcmVzQXJyYXksIGUudGFyZ2V0LCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IC8vIFNlbGV6aW9uYSBpbCBwcmltbyBxdWFkcmF0b1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhcnRTcXVhcmUgPSBzcXVhcmU7XG4gICAgICAgICAgICBpc01vdXNlRG93biA9IHRydWU7XG4gICAgICAgICAgICBzZWxlY3RlZFNxdWFyZXMuY2xlYXIoKTsgLy8gUHVsaXNjZSBsZSBzZWxlemlvbmkgcHJlY2VkZW50aVxuICAgICAgICAgICAgc2VsZWN0ZWRTcXVhcmVzLmFkZChzcXVhcmUpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlzTW91c2VEb3duIHx8ICFzdGFydFNxdWFyZSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U3F1YXJlID0gZS50YXJnZXQ7XG4gICAgICAgICAgICBpZiAoY3VycmVudFNxdWFyZS5jbGFzc0xpc3QuY29udGFpbnMoJ2dyaWQtc3F1YXJlJykgJiYgIXNlbGVjdGVkU3F1YXJlcy5oYXMoY3VycmVudFNxdWFyZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNEcmFnZ2luZ1JpZ2h0Q2xpY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnLCAnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICgwLCBCcnVzaF8xLmJydXNoKShicnVzaFR5cGUsIHNxdWFyZXNBcnJheSwgZS50YXJnZXQsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxlY3RlZFNxdWFyZXMuYWRkKGN1cnJlbnRTcXVhcmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBncmlkQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgKGUpID0+IGUucHJldmVudERlZmF1bHQoKSk7XG4gICAgLy8gTGlzdGVuZXIgZ2xvYmFsZSBwZXIgJ21vdXNldXAnIHBlciBmZXJtYXJlIGlsIHRyYWNjaWFtZW50b1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGlzRHJhZ2dpbmdSaWdodENsaWNrIHx8IGlzTW91c2VEb3duKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIGlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgICAgICBzdGFydFNxdWFyZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zYXZlTWFwVG9Mb2NhbFN0b3JhZ2UgPSBzYXZlTWFwVG9Mb2NhbFN0b3JhZ2U7XG5leHBvcnRzLmxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlID0gbG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2U7XG4vLyBBc3N1bWVuZG8gY2hlICdncmlkQ29udGFpbmVyJyBzaWEgaWwgY29udGVuaXRvcmUgZGVsbGEgdHVhIGdyaWdsaWFcbmZ1bmN0aW9uIHNhdmVNYXBUb0xvY2FsU3RvcmFnZShncmlkQ29udGFpbmVyKSB7XG4gICAgY29uc3Qgc3F1YXJlcyA9IEFycmF5LmZyb20oZ3JpZENvbnRhaW5lci5jaGlsZHJlbik7XG4gICAgY29uc3QgbWFwRGF0YSA9IHNxdWFyZXMubWFwKHNxdWFyZSA9PiAoe1xuICAgICAgICBzOiBzcXVhcmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKVxuICAgIH0pKTtcbiAgICAvLyBTZXJpYWxpenphIGkgZGF0aSBpbiB1bmEgc3RyaW5nYSBKU09OXG4gICAgY29uc3Qgc2VyaWFsaXplZE1hcCA9IEpTT04uc3RyaW5naWZ5KG1hcERhdGEpO1xuICAgIC8vIFNhbHZhIGxhIHN0cmluZ2EgbmVsIExvY2FsU3RvcmFnZSBjb24gdW5hIGNoaWF2ZVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZE1hcCcsIHNlcmlhbGl6ZWRNYXApO1xuICAgIGNvbnNvbGUubG9nKCdNYXBwYSBzYWx2YXRhIGNvbiBzdWNjZXNzby4nKTtcbn1cbmZ1bmN0aW9uIGxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlKGdyaWRDb250YWluZXIpIHtcbiAgICAvLyBSZWN1cGVyYSBsYSBzdHJpbmdhIHNlcmlhbGl6emF0YVxuICAgIGNvbnN0IHNlcmlhbGl6ZWRNYXAgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2F2ZWRNYXAnKTtcbiAgICBpZiAoc2VyaWFsaXplZE1hcCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gRGVzZXJpYWxpenphIGxhIHN0cmluZ2EgaW4gdW4gYXJyYXkgZGkgb2dnZXR0aVxuICAgICAgICAgICAgY29uc3QgbWFwRGF0YSA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZE1hcCk7XG4gICAgICAgICAgICBjb25zdCBzcXVhcmVzID0gQXJyYXkuZnJvbShncmlkQ29udGFpbmVyLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIC8vIEFzc2ljdXJhdGkgY2hlIGxlIGRpbWVuc2lvbmkgZGVsbGEgZ3JpZ2xpYSBjb3JyaXNwb25kYW5vIGFpIGRhdGkgc2FsdmF0aVxuICAgICAgICAgICAgaWYgKG1hcERhdGEubGVuZ3RoID09PSBzcXVhcmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIEFwcGxpY2EgbG8gc3RhdG8gc2FsdmF0byBhIG9nbmkgcXVhZHJhdG8gZGVsbGEgZ3JpZ2xpYVxuICAgICAgICAgICAgICAgIG1hcERhdGEuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3F1YXJlc1tpbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcXVhcmVzW2luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNYXBwYSBjYXJpY2F0YSBjb24gc3VjY2Vzc28uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0xlIGRpbWVuc2lvbmkgZGVsbGEgZ3JpZ2xpYSBub24gY29ycmlzcG9uZG9ubyBhaSBkYXRpIHNhbHZhdGkuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yZSBkdXJhbnRlIGxhIGRlc2VyaWFsaXp6YXppb25lIGRlaSBkYXRpLicsIGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnTmVzc3VuYSBtYXBwYSBzYWx2YXRhIHRyb3ZhdGEuJyk7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSByYW5kb21pemVTcXVhcmU7XG4vLyBGdW56aW9uZSBwZXIgcmFuZG9taXp6YXJlIHVuIHF1YWRyYXRvIGNvbiBhbm5vdGF6aW9uaSBkaSB0aXBvXG5mdW5jdGlvbiByYW5kb21pemVTcXVhcmUoKSB7XG4gICAgLy8gU2VsZXppb25hIHR1dHRpIGdsaSBlbGVtZW50aSBjb24gbGEgY2xhc3NlICdncmlkLXNxdWFyZSdcbiAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlLmFjdGl2ZScpO1xuICAgIC8vIFZlcmlmaWNhIHNlIGNpIHNvbm8gcXVhZHJhdGkgbmVsbGEgZ3JpZ2xpYVxuICAgIGlmIChzcXVhcmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBhbGVydCgnUGVyIGZhdm9yZSwgY3JlYSBwcmltYSB1bmEgZ3JpZ2xpYSEnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBSaW11b3ZlIGxhIGNsYXNzZSAnc2VsZWN0ZWQnIGRhIHR1dHRpIGkgcXVhZHJhdGkgcGVyIGRlc2VsZXppb25hcmUgcXVlbGxvIHByZWNlZGVudGVtZW50ZSBldmlkZW56aWF0b1xuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4gc3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJykpO1xuICAgIC8vIENhbGNvbGEgdW4gaW5kaWNlIGNhc3VhbGUgYWxsJ2ludGVybm8gZGVsbCdhcnJheSBkaSBxdWFkcmF0aVxuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc3F1YXJlcy5sZW5ndGgpO1xuICAgIC8vIEFnZ2l1bmdlIGxhIGNsYXNzZSAnc2VsZWN0ZWQnIGFsIHF1YWRyYXRvIHNjZWx0byBjYXN1YWxtZW50ZVxuICAgIHNxdWFyZXNbcmFuZG9tSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHJhbmRvbWl6ZVNxdWFyZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9yYW5kb21pemVTcXVhcmVcIikpO1xuY29uc3QgR3JpZF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9HcmlkXCIpKTtcbmNvbnN0IFNhdmVfMSA9IHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9TYXZlXCIpO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAvLyBBY3RpdmUgZXZlcnkgc3F1YXJlIHNlbGVjdGVkLlxuICAgIGNvbnN0IGNyZWF0ZUdyaWRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JlYXRlLWdyaWQtYnRuJyk7XG4gICAgY3JlYXRlR3JpZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY29uc3Qgcm93cyA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb3dzJykudmFsdWUpO1xuICAgICAgICBjb25zdCBjb2xzID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbHMnKS52YWx1ZSk7XG4gICAgICAgIGlmIChyb3dzID4gMCAmJiBjb2xzID4gMClcbiAgICAgICAgICAgICgwLCBHcmlkXzEuZGVmYXVsdCkocm93cywgY29scywgJ3BvaW50Jyk7IC8vIENyZWF0ZSBncmlkLlxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhbGVydCgnSW5zZXJpc2NpIHZhbG9yaSB2YWxpZGkgcGVyIHJpZ2hlIGUgY29sb25uZS4nKTtcbiAgICB9KTtcbiAgICBjb25zdCByYW5kb21pemVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmFuZG9taXplLWJ0bicpO1xuICAgIHJhbmRvbWl6ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJhbmRvbWl6ZVNxdWFyZV8xLmRlZmF1bHQpOyAvLyBDaGlhbWEgbGEgZnVuemlvbmUgZGkgcmFuZG9taXp6YXppb25lIGFsIGNsaWNrIGRlbCBwdWxzYW50ZVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXZlLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtY29udGFpbmVyJyk7XG4gICAgICAgICgwLCBTYXZlXzEuc2F2ZU1hcFRvTG9jYWxTdG9yYWdlKShncmlkQ29udGFpbmVyKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZC1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLWNvbnRhaW5lcicpO1xuICAgICAgICAoMCwgU2F2ZV8xLmxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlKShncmlkQ29udGFpbmVyKTtcbiAgICB9KTtcbiAgICAvLyBDcmVhIHVuYSBncmlnbGlhIGRpIGRpbWVuc2lvbmkgcHJlZGVmaW5pdGUgYWxsJ2F2dmlvIGRlbGxhIHBhZ2luYVxuICAgICgwLCBHcmlkXzEuZGVmYXVsdCkoMTAsIDEwLCAncG9pbnQnKTtcbn0pO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9