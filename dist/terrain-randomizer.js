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
// Filter map name for technical ID.
const mapNameFn = (mapName) => mapName.replaceAll(' ', '');
// Assumendo che 'gridContainer' sia il contenitore della tua griglia
function saveMapToLocalStorage(gridContainer, mapName) {
    const squares = Array.from(gridContainer.children);
    const mapData = squares.map(square => ({
        s: square.classList.contains('active')
    }));
    const mapNameFiltered = mapNameFn(mapName);
    // Add option to saved maps.
    const mapNames = document.getElementById('map-names');
    const newOption = document.createElement('option');
    newOption.value = mapNameFiltered; // Il valore effettivo dell'opzione
    newOption.textContent = mapName; // Il testo visibile all'utente
    mapNames.appendChild(newOption);
    // Serializza i dati in una stringa JSON
    const serializedMap = JSON.stringify(mapData);
    // Salva la stringa nel LocalStorage con una chiave
    localStorage.setItem('savedMap_' + mapNameFiltered, serializedMap);
    console.log('Mappa salvata con successo.');
}
function loadMapFromLocalStorage(gridContainer, mapName) {
    // Recupera la stringa serializzata
    const serializedMap = localStorage.getItem('savedMap_' + mapNameFn(mapName));
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
        // const rows: number = parseInt((document.getElementById('rows') as HTMLInputElement).value);
        // const cols: number = parseInt((document.getElementById('cols') as HTMLInputElement).value);
        const range = parseInt(document.getElementById('grid-range').value);
        // if (rows > 0 && cols > 0) createGrid(rows, cols, 'point'); // Create grid.
        if (range > 0)
            (0, Grid_1.default)(range, range, 'point'); // Create grid.
        else
            alert('Inserisci valori validi per righe e colonne.');
    });
    document.getElementById('grid-range').addEventListener('change', (e) => {
        const gridRange = parseInt((e?.target).value);
        document.getElementById('grid-label').innerText = gridRange + 'x' + gridRange;
    });
    document.getElementById('randomize-btn').addEventListener('click', randomizeSquare_1.default);
    // Chiama la funzione di randomizzazione al click del pulsante.
    document.getElementById('save-btn').addEventListener('click', () => {
        const gridContainer = document.getElementById('grid-container');
        const mapName = document.getElementById('map-name').value;
        (0, Save_1.saveMapToLocalStorage)(gridContainer, mapName);
    });
    document.getElementById('load-btn').addEventListener('click', () => {
        const gridContainer = document.getElementById('grid-container');
        const mapName = document.getElementById('map-names').value;
        (0, Save_1.loadMapFromLocalStorage)(gridContainer, mapName);
    });
    // Crea una griglia di dimensioni predefinite all'avvio della pagina
    (0, Grid_1.default)(15, 15, 'point');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL0JydXNoLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvR3JpZC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL1NhdmUudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9yYW5kb21pemVTcXVhcmUudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJydXNoID0gYnJ1c2g7XG5mdW5jdGlvbiBicnVzaChicnVzaFR5cGUsIHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIHN3aXRjaCAoYnJ1c2hUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJjcm9zc1wiOlxuICAgICAgICAgICAgYnJ1c2hDcm9zcyhzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib3hcIjpcbiAgICAgICAgICAgIGJydXNoQm94KHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgY2FzZSBcInBvaW50XCI6XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5mdW5jdGlvbiBicnVzaENyb3NzKHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHNxdWFyZXNBcnJheS5pbmRleE9mKGUpO1xuICAgIC8vIFVwL0Rvd24uXG4gICAgY29uc3QgYWJvdmVJbmRleCA9IGN1cnJlbnRJbmRleCAtIGNvbHM7XG4gICAgaWYgKGFib3ZlSW5kZXggPj0gMClcbiAgICAgICAgc3F1YXJlc1thYm92ZUluZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICBjb25zdCBiZWxvd0luZGV4ID0gY3VycmVudEluZGV4ICsgY29scztcbiAgICBpZiAoYmVsb3dJbmRleCA8IHNxdWFyZXMubGVuZ3RoKVxuICAgICAgICBzcXVhcmVzW2JlbG93SW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIC8vIExlZnQvUmlnaHQuXG4gICAgY29uc3QgYmVmb3JlSW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuICAgIGlmIChiZWZvcmVJbmRleCA+PSAwICYmIGJlZm9yZUluZGV4ICUgY29scyAhPT0gKGNvbHMgLSAxKSlcbiAgICAgICAgc3F1YXJlc1tiZWZvcmVJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgY29uc3QgYWZ0ZXJJbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XG4gICAgaWYgKGFmdGVySW5kZXggPCBzcXVhcmVzLmxlbmd0aCAmJiBhZnRlckluZGV4ICUgY29scyAhPT0gMClcbiAgICAgICAgc3F1YXJlc1thZnRlckluZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAvLyBjb25zb2xlLmxvZygnYmVmb3JlSW5kZXg6ICcsIGJlZm9yZUluZGV4LCAnYWZ0ZXJJbmRleDonLCBhZnRlckluZGV4LCAnTW9kOiAnLCBiZWZvcmVJbmRleCAlIGNvbHMsIChjb2xzLTEpKTtcbn1cbmZ1bmN0aW9uIGJydXNoQm94KHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHNxdWFyZXNBcnJheS5pbmRleE9mKGUpO1xuICAgIC8vIFVwL0Rvd24uXG4gICAgY29uc3QgYWJvdmVJbmRleCA9IGN1cnJlbnRJbmRleCAtIGNvbHM7XG4gICAgaWYgKGFib3ZlSW5kZXggLSAxID49IDApIHtcbiAgICAgICAgc3F1YXJlc1thYm92ZUluZGV4IC0gMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIHNxdWFyZXNbYWJvdmVJbmRleCArIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBjb25zdCBiZWxvd0luZGV4ID0gY3VycmVudEluZGV4ICsgY29scztcbiAgICBpZiAoYmVsb3dJbmRleCArIDEgPCBzcXVhcmVzLmxlbmd0aCkge1xuICAgICAgICBzcXVhcmVzW2JlbG93SW5kZXggLSAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgc3F1YXJlc1tiZWxvd0luZGV4ICsgMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGJydXNoQ3Jvc3Moc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlR3JpZDtcbmNvbnN0IEJydXNoXzEgPSByZXF1aXJlKFwiLi9CcnVzaFwiKTtcbmNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1jb250YWluZXInKTtcbmxldCBpc01vdXNlRG93biA9IGZhbHNlO1xubGV0IHN0YXJ0U3F1YXJlID0gbnVsbDtcbmxldCBzZWxlY3RlZFNxdWFyZXMgPSBuZXcgU2V0KCk7IC8vIFVzaWFtbyB1biBTZXQgcGVyIGV2aXRhcmUgZHVwbGljYXRpXG5sZXQgaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgPSBmYWxzZTtcbi8vIEZ1bnppb25lIHBlciBjcmVhcmUgbGEgZ3JpZ2xpYSBjb24gYW5ub3RhemlvbmkgZGkgdGlwb1xuZnVuY3Rpb24gY3JlYXRlR3JpZChyb3dzLCBjb2xzLCBicnVzaFR5cGUpIHtcbiAgICAvLyBQdWxpc2NlIGlsIGNvbnRlbnV0byBwcmVjZWRlbnRlIGRlbCBjb250ZW5pdG9yZVxuICAgIGdyaWRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgLy8gSW1wb3N0YSBpIHRlbXBsYXRlIHBlciBsZSByaWdoZSBlIGxlIGNvbG9ubmUgZGVsbGEgZ3JpZ2xpYSBDU1NcbiAgICBncmlkQ29udGFpbmVyLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KCR7cm93c30sIDFmcilgO1xuICAgIGdyaWRDb250YWluZXIuc3R5bGUuZ3JpZFRlbXBsYXRlQ29sdW1ucyA9IGByZXBlYXQoJHtjb2xzfSwgMWZyKWA7XG4gICAgLy8gQ2FsY29sYSBsYSBsYXJnaGV6emEgZGVsIGNvbnRlbml0b3JlIGluIGJhc2UgYWwgbnVtZXJvIGRpIGNvbG9ubmUgZSBhbGxhIGRpbWVuc2lvbmUgZGVpIHF1YWRyYXRpICsgYm9yZGlcbiAgICBncmlkQ29udGFpbmVyLnN0eWxlLndpZHRoID0gYCR7Y29scyAqIDUyIC0gMX1weGA7IC8vIEFzc3VtZW5kbyBjaGUgb2duaSBxdWFkcmF0byBzaWEgNTBweCArIDJweCBkaSBib3JkbyB0b3RhbGVcbiAgICAvLyBDcmVhIGkgc2luZ29saSBxdWFkcmF0aSBkZWxsYSBncmlnbGlhXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzICogY29sczsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgIH1cbiAgICAvLyBBY3RpdmUgZXZlcnkgc3F1YXJlIHNlbGVjdGVkLlxuICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcbiAgICBhZGRTcXVhcmVMaXN0ZW5lcnMoYnJ1c2hUeXBlLCBzcXVhcmVzLCBjb2xzKTtcbiAgICAvLyBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJykpKTtcbn1cbi8vIEZ1bnppb25lIHBlciBhZ2dpdW5nZXJlIGxpc3RlbmVyIGFpIHF1YWRyYXRpXG5mdW5jdGlvbiBhZGRTcXVhcmVMaXN0ZW5lcnMoYnJ1c2hUeXBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgY29uc3Qgc3F1YXJlc0FycmF5ID0gQXJyYXkuZnJvbShzcXVhcmVzKTtcbiAgICBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoZS5idXR0b24gPT09IDIpIHsgLy8gMCDDqCBzaW5pc3RybywgMSDDqCBjZW50cmFsZSwgMiDDqCBkZXN0cm9cbiAgICAgICAgICAgICAgICBpc0RyYWdnaW5nUmlnaHRDbGljayA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgKDAsIEJydXNoXzEuYnJ1c2gpKGJydXNoVHlwZSwgc3F1YXJlc0FycmF5LCBlLnRhcmdldCwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpOyAvLyBTZWxlemlvbmEgaWwgcHJpbW8gcXVhZHJhdG9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXJ0U3F1YXJlID0gc3F1YXJlO1xuICAgICAgICAgICAgaXNNb3VzZURvd24gPSB0cnVlO1xuICAgICAgICAgICAgc2VsZWN0ZWRTcXVhcmVzLmNsZWFyKCk7IC8vIFB1bGlzY2UgbGUgc2VsZXppb25pIHByZWNlZGVudGlcbiAgICAgICAgICAgIHNlbGVjdGVkU3F1YXJlcy5hZGQoc3F1YXJlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFpc01vdXNlRG93biB8fCAhc3RhcnRTcXVhcmUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFNxdWFyZSA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRTcXVhcmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdncmlkLXNxdWFyZScpICYmICFzZWxlY3RlZFNxdWFyZXMuaGFzKGN1cnJlbnRTcXVhcmUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRHJhZ2dpbmdSaWdodENsaWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJywgJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAoMCwgQnJ1c2hfMS5icnVzaCkoYnJ1c2hUeXBlLCBzcXVhcmVzQXJyYXksIGUudGFyZ2V0LCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRTcXVhcmVzLmFkZChjdXJyZW50U3F1YXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgZ3JpZENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChlKSA9PiBlLnByZXZlbnREZWZhdWx0KCkpO1xuICAgIC8vIExpc3RlbmVyIGdsb2JhbGUgcGVyICdtb3VzZXVwJyBwZXIgZmVybWFyZSBpbCB0cmFjY2lhbWVudG9cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChpc0RyYWdnaW5nUmlnaHRDbGljayB8fCBpc01vdXNlRG93bikge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlzRHJhZ2dpbmdSaWdodENsaWNrID0gZmFsc2U7XG4gICAgICAgICAgICBpc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICAgICAgc3RhcnRTcXVhcmUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2F2ZU1hcFRvTG9jYWxTdG9yYWdlID0gc2F2ZU1hcFRvTG9jYWxTdG9yYWdlO1xuZXhwb3J0cy5sb2FkTWFwRnJvbUxvY2FsU3RvcmFnZSA9IGxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlO1xuLy8gRmlsdGVyIG1hcCBuYW1lIGZvciB0ZWNobmljYWwgSUQuXG5jb25zdCBtYXBOYW1lRm4gPSAobWFwTmFtZSkgPT4gbWFwTmFtZS5yZXBsYWNlQWxsKCcgJywgJycpO1xuLy8gQXNzdW1lbmRvIGNoZSAnZ3JpZENvbnRhaW5lcicgc2lhIGlsIGNvbnRlbml0b3JlIGRlbGxhIHR1YSBncmlnbGlhXG5mdW5jdGlvbiBzYXZlTWFwVG9Mb2NhbFN0b3JhZ2UoZ3JpZENvbnRhaW5lciwgbWFwTmFtZSkge1xuICAgIGNvbnN0IHNxdWFyZXMgPSBBcnJheS5mcm9tKGdyaWRDb250YWluZXIuY2hpbGRyZW4pO1xuICAgIGNvbnN0IG1hcERhdGEgPSBzcXVhcmVzLm1hcChzcXVhcmUgPT4gKHtcbiAgICAgICAgczogc3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcbiAgICB9KSk7XG4gICAgY29uc3QgbWFwTmFtZUZpbHRlcmVkID0gbWFwTmFtZUZuKG1hcE5hbWUpO1xuICAgIC8vIEFkZCBvcHRpb24gdG8gc2F2ZWQgbWFwcy5cbiAgICBjb25zdCBtYXBOYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtbmFtZXMnKTtcbiAgICBjb25zdCBuZXdPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBuZXdPcHRpb24udmFsdWUgPSBtYXBOYW1lRmlsdGVyZWQ7IC8vIElsIHZhbG9yZSBlZmZldHRpdm8gZGVsbCdvcHppb25lXG4gICAgbmV3T3B0aW9uLnRleHRDb250ZW50ID0gbWFwTmFtZTsgLy8gSWwgdGVzdG8gdmlzaWJpbGUgYWxsJ3V0ZW50ZVxuICAgIG1hcE5hbWVzLmFwcGVuZENoaWxkKG5ld09wdGlvbik7XG4gICAgLy8gU2VyaWFsaXp6YSBpIGRhdGkgaW4gdW5hIHN0cmluZ2EgSlNPTlxuICAgIGNvbnN0IHNlcmlhbGl6ZWRNYXAgPSBKU09OLnN0cmluZ2lmeShtYXBEYXRhKTtcbiAgICAvLyBTYWx2YSBsYSBzdHJpbmdhIG5lbCBMb2NhbFN0b3JhZ2UgY29uIHVuYSBjaGlhdmVcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRNYXBfJyArIG1hcE5hbWVGaWx0ZXJlZCwgc2VyaWFsaXplZE1hcCk7XG4gICAgY29uc29sZS5sb2coJ01hcHBhIHNhbHZhdGEgY29uIHN1Y2Nlc3NvLicpO1xufVxuZnVuY3Rpb24gbG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2UoZ3JpZENvbnRhaW5lciwgbWFwTmFtZSkge1xuICAgIC8vIFJlY3VwZXJhIGxhIHN0cmluZ2Egc2VyaWFsaXp6YXRhXG4gICAgY29uc3Qgc2VyaWFsaXplZE1hcCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlZE1hcF8nICsgbWFwTmFtZUZuKG1hcE5hbWUpKTtcbiAgICBpZiAoc2VyaWFsaXplZE1hcCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gRGVzZXJpYWxpenphIGxhIHN0cmluZ2EgaW4gdW4gYXJyYXkgZGkgb2dnZXR0aVxuICAgICAgICAgICAgY29uc3QgbWFwRGF0YSA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZE1hcCk7XG4gICAgICAgICAgICBjb25zdCBzcXVhcmVzID0gQXJyYXkuZnJvbShncmlkQ29udGFpbmVyLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIC8vIEFzc2ljdXJhdGkgY2hlIGxlIGRpbWVuc2lvbmkgZGVsbGEgZ3JpZ2xpYSBjb3JyaXNwb25kYW5vIGFpIGRhdGkgc2FsdmF0aVxuICAgICAgICAgICAgaWYgKG1hcERhdGEubGVuZ3RoID09PSBzcXVhcmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIEFwcGxpY2EgbG8gc3RhdG8gc2FsdmF0byBhIG9nbmkgcXVhZHJhdG8gZGVsbGEgZ3JpZ2xpYVxuICAgICAgICAgICAgICAgIG1hcERhdGEuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3F1YXJlc1tpbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcXVhcmVzW2luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNYXBwYSBjYXJpY2F0YSBjb24gc3VjY2Vzc28uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0xlIGRpbWVuc2lvbmkgZGVsbGEgZ3JpZ2xpYSBub24gY29ycmlzcG9uZG9ubyBhaSBkYXRpIHNhbHZhdGkuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yZSBkdXJhbnRlIGxhIGRlc2VyaWFsaXp6YXppb25lIGRlaSBkYXRpLicsIGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnTmVzc3VuYSBtYXBwYSBzYWx2YXRhIHRyb3ZhdGEuJyk7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSByYW5kb21pemVTcXVhcmU7XG4vLyBGdW56aW9uZSBwZXIgcmFuZG9taXp6YXJlIHVuIHF1YWRyYXRvIGNvbiBhbm5vdGF6aW9uaSBkaSB0aXBvXG5mdW5jdGlvbiByYW5kb21pemVTcXVhcmUoKSB7XG4gICAgLy8gU2VsZXppb25hIHR1dHRpIGdsaSBlbGVtZW50aSBjb24gbGEgY2xhc3NlICdncmlkLXNxdWFyZSdcbiAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlLmFjdGl2ZScpO1xuICAgIC8vIFZlcmlmaWNhIHNlIGNpIHNvbm8gcXVhZHJhdGkgbmVsbGEgZ3JpZ2xpYVxuICAgIGlmIChzcXVhcmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBhbGVydCgnUGVyIGZhdm9yZSwgY3JlYSBwcmltYSB1bmEgZ3JpZ2xpYSEnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBSaW11b3ZlIGxhIGNsYXNzZSAnc2VsZWN0ZWQnIGRhIHR1dHRpIGkgcXVhZHJhdGkgcGVyIGRlc2VsZXppb25hcmUgcXVlbGxvIHByZWNlZGVudGVtZW50ZSBldmlkZW56aWF0b1xuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4gc3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJykpO1xuICAgIC8vIENhbGNvbGEgdW4gaW5kaWNlIGNhc3VhbGUgYWxsJ2ludGVybm8gZGVsbCdhcnJheSBkaSBxdWFkcmF0aVxuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc3F1YXJlcy5sZW5ndGgpO1xuICAgIC8vIEFnZ2l1bmdlIGxhIGNsYXNzZSAnc2VsZWN0ZWQnIGFsIHF1YWRyYXRvIHNjZWx0byBjYXN1YWxtZW50ZVxuICAgIHNxdWFyZXNbcmFuZG9tSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHJhbmRvbWl6ZVNxdWFyZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9yYW5kb21pemVTcXVhcmVcIikpO1xuY29uc3QgR3JpZF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9HcmlkXCIpKTtcbmNvbnN0IFNhdmVfMSA9IHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9TYXZlXCIpO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAvLyBBY3RpdmUgZXZlcnkgc3F1YXJlIHNlbGVjdGVkLlxuICAgIGNvbnN0IGNyZWF0ZUdyaWRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JlYXRlLWdyaWQtYnRuJyk7XG4gICAgY3JlYXRlR3JpZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgLy8gY29uc3Qgcm93czogbnVtYmVyID0gcGFyc2VJbnQoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb3dzJykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpO1xuICAgICAgICAvLyBjb25zdCBjb2xzOiBudW1iZXIgPSBwYXJzZUludCgoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbHMnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSk7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtcmFuZ2UnKS52YWx1ZSk7XG4gICAgICAgIC8vIGlmIChyb3dzID4gMCAmJiBjb2xzID4gMCkgY3JlYXRlR3JpZChyb3dzLCBjb2xzLCAncG9pbnQnKTsgLy8gQ3JlYXRlIGdyaWQuXG4gICAgICAgIGlmIChyYW5nZSA+IDApXG4gICAgICAgICAgICAoMCwgR3JpZF8xLmRlZmF1bHQpKHJhbmdlLCByYW5nZSwgJ3BvaW50Jyk7IC8vIENyZWF0ZSBncmlkLlxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhbGVydCgnSW5zZXJpc2NpIHZhbG9yaSB2YWxpZGkgcGVyIHJpZ2hlIGUgY29sb25uZS4nKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1yYW5nZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGdyaWRSYW5nZSA9IHBhcnNlSW50KChlPy50YXJnZXQpLnZhbHVlKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtbGFiZWwnKS5pbm5lclRleHQgPSBncmlkUmFuZ2UgKyAneCcgKyBncmlkUmFuZ2U7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhbmRvbWl6ZS1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJhbmRvbWl6ZVNxdWFyZV8xLmRlZmF1bHQpO1xuICAgIC8vIENoaWFtYSBsYSBmdW56aW9uZSBkaSByYW5kb21penphemlvbmUgYWwgY2xpY2sgZGVsIHB1bHNhbnRlLlxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXZlLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtY29udGFpbmVyJyk7XG4gICAgICAgIGNvbnN0IG1hcE5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWUnKS52YWx1ZTtcbiAgICAgICAgKDAsIFNhdmVfMS5zYXZlTWFwVG9Mb2NhbFN0b3JhZ2UpKGdyaWRDb250YWluZXIsIG1hcE5hbWUpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtY29udGFpbmVyJyk7XG4gICAgICAgIGNvbnN0IG1hcE5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWVzJykudmFsdWU7XG4gICAgICAgICgwLCBTYXZlXzEubG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2UpKGdyaWRDb250YWluZXIsIG1hcE5hbWUpO1xuICAgIH0pO1xuICAgIC8vIENyZWEgdW5hIGdyaWdsaWEgZGkgZGltZW5zaW9uaSBwcmVkZWZpbml0ZSBhbGwnYXZ2aW8gZGVsbGEgcGFnaW5hXG4gICAgKDAsIEdyaWRfMS5kZWZhdWx0KSgxNSwgMTUsICdwb2ludCcpO1xufSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=