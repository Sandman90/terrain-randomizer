/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/functions/Background.ts":
/*!*************************************!*\
  !*** ./src/functions/Background.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.back = back;
function back(gridContainer, backType) {
    let background = 1;
    switch (backType) {
        case "rock":
            background = 2;
            break;
        case "wood":
            background = 3;
            break;
    }
    gridContainer.style.backgroundImage = `url('./images/BackgroundTerrain${background}.jpg`;
}


/***/ }),

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
exports.createGrid = createGrid;
exports.addSquareListeners = addSquareListeners;
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
    addSquareListeners(brushType, cols);
    gridContainer.addEventListener('contextmenu', (e) => e.preventDefault());
    // squares.forEach(square => square.addEventListener('mousedown', () => square.classList.add('active')));
}
// Funzione per aggiungere listener ai quadrati
function addSquareListeners(brushType, cols) {
    const squares = document.querySelectorAll('.grid-square');
    const squaresArray = Array.from(squares);
    squares.forEach(square => {
        const squareListener = (e) => {
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
        };
        square.removeEventListener('mousedown', squareListener);
        square.addEventListener('mousedown', squareListener);
        const squareOverListener = (e) => {
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
        };
        square.removeEventListener('mouseover', squareOverListener);
        square.addEventListener('mouseover', squareOverListener);
    });
    // Listener globale per 'mouseup' per fermare il tracciamento
    const squareUpListener = (event) => {
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
const Grid_1 = __webpack_require__(/*! ./functions/Grid */ "./src/functions/Grid.ts");
const Save_1 = __webpack_require__(/*! ./functions/Save */ "./src/functions/Save.ts");
const Background_1 = __webpack_require__(/*! ./functions/Background */ "./src/functions/Background.ts");
document.addEventListener('DOMContentLoaded', () => {
    let brushType = 'cross';
    let gridCols = 15;
    let gridRows = 15;
    const gridContainer = document.getElementById('grid-container');
    // Active every square selected.
    const createGridBtn = document.getElementById('create-grid-btn');
    createGridBtn.addEventListener('click', () => {
        gridRows = parseInt(document.getElementById('grid-range-rows').value);
        gridCols = parseInt(document.getElementById('grid-range').value);
        (0, Grid_1.createGrid)(gridRows, gridCols, brushType);
    });
    document.getElementById('clear-btn').addEventListener('click', () => {
        (0, Grid_1.createGrid)(gridRows, gridCols, brushType);
    });
    document.getElementById('grid-range').addEventListener('change', (e) => {
        gridCols = parseInt((e?.target).value);
        document.getElementById('grid-label').innerText = gridCols + 'x' + gridRows;
    });
    document.getElementById('randomize-btn').addEventListener('click', randomizeSquare_1.default);
    // Chiama la funzione di randomizzazione al click del pulsante.
    document.getElementById('save-btn').addEventListener('click', () => {
        const mapName = document.getElementById('map-name').value;
        (0, Save_1.saveMapToLocalStorage)(gridContainer, mapName);
    });
    document.getElementById('load-btn').addEventListener('click', () => {
        const mapName = document.getElementById('map-names').value;
        (0, Save_1.loadMapFromLocalStorage)(gridContainer, mapName);
    });
    (document.querySelectorAll('input[name="brush-options"]')).forEach(radio => {
        radio.addEventListener('click', (e) => {
            brushType = (e?.target).value;
            (0, Grid_1.addSquareListeners)(brushType, gridCols);
        });
    });
    (document.querySelectorAll('input[name="back-options"]')).forEach(radio => {
        radio.addEventListener('click', (e) => (0, Background_1.back)(gridContainer, (e?.target).value));
    });
    // Crea una griglia di dimensioni predefinite all'avvio della pagina
    (0, Grid_1.createGrid)(gridRows, gridCols, brushType);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7O1VDakREO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL0JhY2tncm91bmQudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9CcnVzaC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL0dyaWQudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9TYXZlLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvcmFuZG9taXplU3F1YXJlLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5iYWNrID0gYmFjaztcbmZ1bmN0aW9uIGJhY2soZ3JpZENvbnRhaW5lciwgYmFja1R5cGUpIHtcbiAgICBsZXQgYmFja2dyb3VuZCA9IDE7XG4gICAgc3dpdGNoIChiYWNrVHlwZSkge1xuICAgICAgICBjYXNlIFwicm9ja1wiOlxuICAgICAgICAgICAgYmFja2dyb3VuZCA9IDI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIndvb2RcIjpcbiAgICAgICAgICAgIGJhY2tncm91bmQgPSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGdyaWRDb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnLi9pbWFnZXMvQmFja2dyb3VuZFRlcnJhaW4ke2JhY2tncm91bmR9LmpwZ2A7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnJ1c2ggPSBicnVzaDtcbmZ1bmN0aW9uIGJydXNoKGJydXNoVHlwZSwgc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgc3dpdGNoIChicnVzaFR5cGUpIHtcbiAgICAgICAgY2FzZSBcImNyb3NzXCI6XG4gICAgICAgICAgICBicnVzaENyb3NzKHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJveFwiOlxuICAgICAgICAgICAgYnJ1c2hCb3goc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICBjYXNlIFwicG9pbnRcIjpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGJydXNoQ3Jvc3Moc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gc3F1YXJlc0FycmF5LmluZGV4T2YoZSk7XG4gICAgLy8gVXAvRG93bi5cbiAgICBjb25zdCBhYm92ZUluZGV4ID0gY3VycmVudEluZGV4IC0gY29scztcbiAgICBpZiAoYWJvdmVJbmRleCA+PSAwKVxuICAgICAgICBzcXVhcmVzW2Fib3ZlSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIGNvbnN0IGJlbG93SW5kZXggPSBjdXJyZW50SW5kZXggKyBjb2xzO1xuICAgIGlmIChiZWxvd0luZGV4IDwgc3F1YXJlcy5sZW5ndGgpXG4gICAgICAgIHNxdWFyZXNbYmVsb3dJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgLy8gTGVmdC9SaWdodC5cbiAgICBjb25zdCBiZWZvcmVJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XG4gICAgaWYgKGJlZm9yZUluZGV4ID49IDAgJiYgYmVmb3JlSW5kZXggJSBjb2xzICE9PSAoY29scyAtIDEpKVxuICAgICAgICBzcXVhcmVzW2JlZm9yZUluZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICBjb25zdCBhZnRlckluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcbiAgICBpZiAoYWZ0ZXJJbmRleCA8IHNxdWFyZXMubGVuZ3RoICYmIGFmdGVySW5kZXggJSBjb2xzICE9PSAwKVxuICAgICAgICBzcXVhcmVzW2FmdGVySW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdiZWZvcmVJbmRleDogJywgYmVmb3JlSW5kZXgsICdhZnRlckluZGV4OicsIGFmdGVySW5kZXgsICdNb2Q6ICcsIGJlZm9yZUluZGV4ICUgY29scywgKGNvbHMtMSkpO1xufVxuZnVuY3Rpb24gYnJ1c2hCb3goc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gc3F1YXJlc0FycmF5LmluZGV4T2YoZSk7XG4gICAgLy8gVXAvRG93bi5cbiAgICBjb25zdCBhYm92ZUluZGV4ID0gY3VycmVudEluZGV4IC0gY29scztcbiAgICBpZiAoYWJvdmVJbmRleCAtIDEgPj0gMCkge1xuICAgICAgICBzcXVhcmVzW2Fib3ZlSW5kZXggLSAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgc3F1YXJlc1thYm92ZUluZGV4ICsgMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGNvbnN0IGJlbG93SW5kZXggPSBjdXJyZW50SW5kZXggKyBjb2xzO1xuICAgIGlmIChiZWxvd0luZGV4ICsgMSA8IHNxdWFyZXMubGVuZ3RoKSB7XG4gICAgICAgIHNxdWFyZXNbYmVsb3dJbmRleCAtIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICBzcXVhcmVzW2JlbG93SW5kZXggKyAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgYnJ1c2hDcm9zcyhzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZUdyaWQgPSBjcmVhdGVHcmlkO1xuZXhwb3J0cy5hZGRTcXVhcmVMaXN0ZW5lcnMgPSBhZGRTcXVhcmVMaXN0ZW5lcnM7XG5jb25zdCBCcnVzaF8xID0gcmVxdWlyZShcIi4vQnJ1c2hcIik7XG5jb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtY29udGFpbmVyJyk7XG5sZXQgaXNNb3VzZURvd24gPSBmYWxzZTtcbmxldCBzdGFydFNxdWFyZSA9IG51bGw7XG5sZXQgc2VsZWN0ZWRTcXVhcmVzID0gbmV3IFNldCgpOyAvLyBVc2lhbW8gdW4gU2V0IHBlciBldml0YXJlIGR1cGxpY2F0aVxubGV0IGlzRHJhZ2dpbmdSaWdodENsaWNrID0gZmFsc2U7XG4vLyBGdW56aW9uZSBwZXIgY3JlYXJlIGxhIGdyaWdsaWEgY29uIGFubm90YXppb25pIGRpIHRpcG9cbmZ1bmN0aW9uIGNyZWF0ZUdyaWQocm93cywgY29scywgYnJ1c2hUeXBlKSB7XG4gICAgLy8gUHVsaXNjZSBpbCBjb250ZW51dG8gcHJlY2VkZW50ZSBkZWwgY29udGVuaXRvcmVcbiAgICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIC8vIEltcG9zdGEgaSB0ZW1wbGF0ZSBwZXIgbGUgcmlnaGUgZSBsZSBjb2xvbm5lIGRlbGxhIGdyaWdsaWEgQ1NTXG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS5ncmlkVGVtcGxhdGVSb3dzID0gYHJlcGVhdCgke3Jvd3N9LCAxZnIpYDtcbiAgICBncmlkQ29udGFpbmVyLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7Y29sc30sIDFmcilgO1xuICAgIC8vIENhbGNvbGEgbGEgbGFyZ2hlenphIGRlbCBjb250ZW5pdG9yZSBpbiBiYXNlIGFsIG51bWVybyBkaSBjb2xvbm5lIGUgYWxsYSBkaW1lbnNpb25lIGRlaSBxdWFkcmF0aSArIGJvcmRpXG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke2NvbHMgKiA1MiAtIDF9cHhgOyAvLyBBc3N1bWVuZG8gY2hlIG9nbmkgcXVhZHJhdG8gc2lhIDUwcHggKyAycHggZGkgYm9yZG8gdG90YWxlXG4gICAgLy8gQ3JlYSBpIHNpbmdvbGkgcXVhZHJhdGkgZGVsbGEgZ3JpZ2xpYVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93cyAqIGNvbHM7IGkrKykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICB9XG4gICAgLy8gQWN0aXZlIGV2ZXJ5IHNxdWFyZSBzZWxlY3RlZC5cbiAgICBhZGRTcXVhcmVMaXN0ZW5lcnMoYnJ1c2hUeXBlLCBjb2xzKTtcbiAgICBncmlkQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgKGUpID0+IGUucHJldmVudERlZmF1bHQoKSk7XG4gICAgLy8gc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4gc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpKSk7XG59XG4vLyBGdW56aW9uZSBwZXIgYWdnaXVuZ2VyZSBsaXN0ZW5lciBhaSBxdWFkcmF0aVxuZnVuY3Rpb24gYWRkU3F1YXJlTGlzdGVuZXJzKGJydXNoVHlwZSwgY29scykge1xuICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcbiAgICBjb25zdCBzcXVhcmVzQXJyYXkgPSBBcnJheS5mcm9tKHNxdWFyZXMpO1xuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xuICAgICAgICBjb25zdCBzcXVhcmVMaXN0ZW5lciA9IChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoZS5idXR0b24gPT09IDIpIHsgLy8gMCDDqCBzaW5pc3RybywgMSDDqCBjZW50cmFsZSwgMiDDqCBkZXN0cm9cbiAgICAgICAgICAgICAgICBpc0RyYWdnaW5nUmlnaHRDbGljayA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgKDAsIEJydXNoXzEuYnJ1c2gpKGJydXNoVHlwZSwgc3F1YXJlc0FycmF5LCBlLnRhcmdldCwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpOyAvLyBTZWxlemlvbmEgaWwgcHJpbW8gcXVhZHJhdG9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXJ0U3F1YXJlID0gc3F1YXJlO1xuICAgICAgICAgICAgaXNNb3VzZURvd24gPSB0cnVlO1xuICAgICAgICAgICAgc2VsZWN0ZWRTcXVhcmVzLmNsZWFyKCk7IC8vIFB1bGlzY2UgbGUgc2VsZXppb25pIHByZWNlZGVudGlcbiAgICAgICAgICAgIHNlbGVjdGVkU3F1YXJlcy5hZGQoc3F1YXJlKTtcbiAgICAgICAgfTtcbiAgICAgICAgc3F1YXJlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNxdWFyZUxpc3RlbmVyKTtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNxdWFyZUxpc3RlbmVyKTtcbiAgICAgICAgY29uc3Qgc3F1YXJlT3Zlckxpc3RlbmVyID0gKGUpID0+IHtcbiAgICAgICAgICAgIGlmICghaXNNb3VzZURvd24gfHwgIXN0YXJ0U3F1YXJlKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTcXVhcmUgPSBlLnRhcmdldDtcbiAgICAgICAgICAgIGlmIChjdXJyZW50U3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygnZ3JpZC1zcXVhcmUnKSAmJiAhc2VsZWN0ZWRTcXVhcmVzLmhhcyhjdXJyZW50U3F1YXJlKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0RyYWdnaW5nUmlnaHRDbGljaykge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScsICdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgKDAsIEJydXNoXzEuYnJ1c2gpKGJydXNoVHlwZSwgc3F1YXJlc0FycmF5LCBlLnRhcmdldCwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkU3F1YXJlcy5hZGQoY3VycmVudFNxdWFyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNxdWFyZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBzcXVhcmVPdmVyTGlzdGVuZXIpO1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgc3F1YXJlT3Zlckxpc3RlbmVyKTtcbiAgICB9KTtcbiAgICAvLyBMaXN0ZW5lciBnbG9iYWxlIHBlciAnbW91c2V1cCcgcGVyIGZlcm1hcmUgaWwgdHJhY2NpYW1lbnRvXG4gICAgY29uc3Qgc3F1YXJlVXBMaXN0ZW5lciA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAoaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgfHwgaXNNb3VzZURvd24pIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpc0RyYWdnaW5nUmlnaHRDbGljayA9IGZhbHNlO1xuICAgICAgICAgICAgaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIHN0YXJ0U3F1YXJlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHNxdWFyZVVwTGlzdGVuZXIpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzcXVhcmVVcExpc3RlbmVyKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zYXZlTWFwVG9Mb2NhbFN0b3JhZ2UgPSBzYXZlTWFwVG9Mb2NhbFN0b3JhZ2U7XG5leHBvcnRzLmxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlID0gbG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2U7XG4vLyBGaWx0ZXIgbWFwIG5hbWUgZm9yIHRlY2huaWNhbCBJRC5cbmNvbnN0IG1hcE5hbWVGbiA9IChtYXBOYW1lKSA9PiBtYXBOYW1lLnJlcGxhY2VBbGwoJyAnLCAnJyk7XG4vLyBBc3N1bWVuZG8gY2hlICdncmlkQ29udGFpbmVyJyBzaWEgaWwgY29udGVuaXRvcmUgZGVsbGEgdHVhIGdyaWdsaWFcbmZ1bmN0aW9uIHNhdmVNYXBUb0xvY2FsU3RvcmFnZShncmlkQ29udGFpbmVyLCBtYXBOYW1lKSB7XG4gICAgY29uc3Qgc3F1YXJlcyA9IEFycmF5LmZyb20oZ3JpZENvbnRhaW5lci5jaGlsZHJlbik7XG4gICAgY29uc3QgbWFwRGF0YSA9IHNxdWFyZXMubWFwKHNxdWFyZSA9PiAoe1xuICAgICAgICBzOiBzcXVhcmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKVxuICAgIH0pKTtcbiAgICBjb25zdCBtYXBOYW1lRmlsdGVyZWQgPSBtYXBOYW1lRm4obWFwTmFtZSk7XG4gICAgLy8gQWRkIG9wdGlvbiB0byBzYXZlZCBtYXBzLlxuICAgIGNvbnN0IG1hcE5hbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1uYW1lcycpO1xuICAgIGNvbnN0IG5ld09wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG5ld09wdGlvbi52YWx1ZSA9IG1hcE5hbWVGaWx0ZXJlZDsgLy8gSWwgdmFsb3JlIGVmZmV0dGl2byBkZWxsJ29wemlvbmVcbiAgICBuZXdPcHRpb24udGV4dENvbnRlbnQgPSBtYXBOYW1lOyAvLyBJbCB0ZXN0byB2aXNpYmlsZSBhbGwndXRlbnRlXG4gICAgbWFwTmFtZXMuYXBwZW5kQ2hpbGQobmV3T3B0aW9uKTtcbiAgICAvLyBTZXJpYWxpenphIGkgZGF0aSBpbiB1bmEgc3RyaW5nYSBKU09OXG4gICAgY29uc3Qgc2VyaWFsaXplZE1hcCA9IEpTT04uc3RyaW5naWZ5KG1hcERhdGEpO1xuICAgIC8vIFNhbHZhIGxhIHN0cmluZ2EgbmVsIExvY2FsU3RvcmFnZSBjb24gdW5hIGNoaWF2ZVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZE1hcF8nICsgbWFwTmFtZUZpbHRlcmVkLCBzZXJpYWxpemVkTWFwKTtcbiAgICBjb25zb2xlLmxvZygnTWFwcGEgc2FsdmF0YSBjb24gc3VjY2Vzc28uJyk7XG59XG5mdW5jdGlvbiBsb2FkTWFwRnJvbUxvY2FsU3RvcmFnZShncmlkQ29udGFpbmVyLCBtYXBOYW1lKSB7XG4gICAgLy8gUmVjdXBlcmEgbGEgc3RyaW5nYSBzZXJpYWxpenphdGFcbiAgICBjb25zdCBzZXJpYWxpemVkTWFwID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NhdmVkTWFwXycgKyBtYXBOYW1lRm4obWFwTmFtZSkpO1xuICAgIGlmIChzZXJpYWxpemVkTWFwKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBEZXNlcmlhbGl6emEgbGEgc3RyaW5nYSBpbiB1biBhcnJheSBkaSBvZ2dldHRpXG4gICAgICAgICAgICBjb25zdCBtYXBEYXRhID0gSlNPTi5wYXJzZShzZXJpYWxpemVkTWFwKTtcbiAgICAgICAgICAgIGNvbnN0IHNxdWFyZXMgPSBBcnJheS5mcm9tKGdyaWRDb250YWluZXIuY2hpbGRyZW4pO1xuICAgICAgICAgICAgLy8gQXNzaWN1cmF0aSBjaGUgbGUgZGltZW5zaW9uaSBkZWxsYSBncmlnbGlhIGNvcnJpc3BvbmRhbm8gYWkgZGF0aSBzYWx2YXRpXG4gICAgICAgICAgICBpZiAobWFwRGF0YS5sZW5ndGggPT09IHNxdWFyZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gQXBwbGljYSBsbyBzdGF0byBzYWx2YXRvIGEgb2duaSBxdWFkcmF0byBkZWxsYSBncmlnbGlhXG4gICAgICAgICAgICAgICAgbWFwRGF0YS5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcXVhcmVzW2luZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNxdWFyZXNbaW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ01hcHBhIGNhcmljYXRhIGNvbiBzdWNjZXNzby4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignTGUgZGltZW5zaW9uaSBkZWxsYSBncmlnbGlhIG5vbiBjb3JyaXNwb25kb25vIGFpIGRhdGkgc2FsdmF0aS4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3JlIGR1cmFudGUgbGEgZGVzZXJpYWxpenphemlvbmUgZGVpIGRhdGkuJywgZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdOZXNzdW5hIG1hcHBhIHNhbHZhdGEgdHJvdmF0YS4nKTtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHJhbmRvbWl6ZVNxdWFyZTtcbi8vIEZ1bnppb25lIHBlciByYW5kb21penphcmUgdW4gcXVhZHJhdG8gY29uIGFubm90YXppb25pIGRpIHRpcG9cbmZ1bmN0aW9uIHJhbmRvbWl6ZVNxdWFyZSgpIHtcbiAgICAvLyBTZWxlemlvbmEgdHV0dGkgZ2xpIGVsZW1lbnRpIGNvbiBsYSBjbGFzc2UgJ2dyaWQtc3F1YXJlJ1xuICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUuYWN0aXZlJyk7XG4gICAgLy8gVmVyaWZpY2Egc2UgY2kgc29ubyBxdWFkcmF0aSBuZWxsYSBncmlnbGlhXG4gICAgaWYgKHNxdWFyZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGFsZXJ0KCdQZXIgZmF2b3JlLCBjcmVhIHByaW1hIHVuYSBncmlnbGlhIScpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFJpbXVvdmUgbGEgY2xhc3NlICdzZWxlY3RlZCcgZGEgdHV0dGkgaSBxdWFkcmF0aSBwZXIgZGVzZWxlemlvbmFyZSBxdWVsbG8gcHJlY2VkZW50ZW1lbnRlIGV2aWRlbnppYXRvXG4gICAgc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKSk7XG4gICAgLy8gQ2FsY29sYSB1biBpbmRpY2UgY2FzdWFsZSBhbGwnaW50ZXJubyBkZWxsJ2FycmF5IGRpIHF1YWRyYXRpXG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzcXVhcmVzLmxlbmd0aCk7XG4gICAgLy8gQWdnaXVuZ2UgbGEgY2xhc3NlICdzZWxlY3RlZCcgYWwgcXVhZHJhdG8gc2NlbHRvIGNhc3VhbG1lbnRlXG4gICAgc3F1YXJlc1tyYW5kb21JbmRleF0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcmFuZG9taXplU3F1YXJlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZnVuY3Rpb25zL3JhbmRvbWl6ZVNxdWFyZVwiKSk7XG5jb25zdCBHcmlkXzEgPSByZXF1aXJlKFwiLi9mdW5jdGlvbnMvR3JpZFwiKTtcbmNvbnN0IFNhdmVfMSA9IHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9TYXZlXCIpO1xuY29uc3QgQmFja2dyb3VuZF8xID0gcmVxdWlyZShcIi4vZnVuY3Rpb25zL0JhY2tncm91bmRcIik7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGxldCBicnVzaFR5cGUgPSAnY3Jvc3MnO1xuICAgIGxldCBncmlkQ29scyA9IDE1O1xuICAgIGxldCBncmlkUm93cyA9IDE1O1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1jb250YWluZXInKTtcbiAgICAvLyBBY3RpdmUgZXZlcnkgc3F1YXJlIHNlbGVjdGVkLlxuICAgIGNvbnN0IGNyZWF0ZUdyaWRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JlYXRlLWdyaWQtYnRuJyk7XG4gICAgY3JlYXRlR3JpZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgZ3JpZFJvd3MgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1yYW5nZS1yb3dzJykudmFsdWUpO1xuICAgICAgICBncmlkQ29scyA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLXJhbmdlJykudmFsdWUpO1xuICAgICAgICAoMCwgR3JpZF8xLmNyZWF0ZUdyaWQpKGdyaWRSb3dzLCBncmlkQ29scywgYnJ1c2hUeXBlKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYXItYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICgwLCBHcmlkXzEuY3JlYXRlR3JpZCkoZ3JpZFJvd3MsIGdyaWRDb2xzLCBicnVzaFR5cGUpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLXJhbmdlJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgZ3JpZENvbHMgPSBwYXJzZUludCgoZT8udGFyZ2V0KS52YWx1ZSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLWxhYmVsJykuaW5uZXJUZXh0ID0gZ3JpZENvbHMgKyAneCcgKyBncmlkUm93cztcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmFuZG9taXplLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmFuZG9taXplU3F1YXJlXzEuZGVmYXVsdCk7XG4gICAgLy8gQ2hpYW1hIGxhIGZ1bnppb25lIGRpIHJhbmRvbWl6emF6aW9uZSBhbCBjbGljayBkZWwgcHVsc2FudGUuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmUtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcE5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWUnKS52YWx1ZTtcbiAgICAgICAgKDAsIFNhdmVfMS5zYXZlTWFwVG9Mb2NhbFN0b3JhZ2UpKGdyaWRDb250YWluZXIsIG1hcE5hbWUpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXBOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1uYW1lcycpLnZhbHVlO1xuICAgICAgICAoMCwgU2F2ZV8xLmxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlKShncmlkQ29udGFpbmVyLCBtYXBOYW1lKTtcbiAgICB9KTtcbiAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cImJydXNoLW9wdGlvbnNcIl0nKSkuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGJydXNoVHlwZSA9IChlPy50YXJnZXQpLnZhbHVlO1xuICAgICAgICAgICAgKDAsIEdyaWRfMS5hZGRTcXVhcmVMaXN0ZW5lcnMpKGJydXNoVHlwZSwgZ3JpZENvbHMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cImJhY2stb3B0aW9uc1wiXScpKS5mb3JFYWNoKHJhZGlvID0+IHtcbiAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gKDAsIEJhY2tncm91bmRfMS5iYWNrKShncmlkQ29udGFpbmVyLCAoZT8udGFyZ2V0KS52YWx1ZSkpO1xuICAgIH0pO1xuICAgIC8vIENyZWEgdW5hIGdyaWdsaWEgZGkgZGltZW5zaW9uaSBwcmVkZWZpbml0ZSBhbGwnYXZ2aW8gZGVsbGEgcGFnaW5hXG4gICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG59KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==