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
    gridContainer.addEventListener('contextmenu', (e) => e.preventDefault());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7O1VDbEREO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL0JhY2tncm91bmQudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9CcnVzaC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL0dyaWQudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9TYXZlLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvcmFuZG9taXplU3F1YXJlLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5iYWNrID0gYmFjaztcbmZ1bmN0aW9uIGJhY2soZ3JpZENvbnRhaW5lciwgYmFja1R5cGUpIHtcbiAgICBsZXQgYmFja2dyb3VuZCA9IDE7XG4gICAgc3dpdGNoIChiYWNrVHlwZSkge1xuICAgICAgICBjYXNlIFwicm9ja1wiOlxuICAgICAgICAgICAgYmFja2dyb3VuZCA9IDI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIndvb2RcIjpcbiAgICAgICAgICAgIGJhY2tncm91bmQgPSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGdyaWRDb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnLi9pbWFnZXMvQmFja2dyb3VuZFRlcnJhaW4ke2JhY2tncm91bmR9LmpwZ2A7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnJ1c2ggPSBicnVzaDtcbmZ1bmN0aW9uIGJydXNoKGJydXNoVHlwZSwgc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgc3dpdGNoIChicnVzaFR5cGUpIHtcbiAgICAgICAgY2FzZSBcImNyb3NzXCI6XG4gICAgICAgICAgICBicnVzaENyb3NzKHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJveFwiOlxuICAgICAgICAgICAgYnJ1c2hCb3goc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICBjYXNlIFwicG9pbnRcIjpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGJydXNoQ3Jvc3Moc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gc3F1YXJlc0FycmF5LmluZGV4T2YoZSk7XG4gICAgLy8gVXAvRG93bi5cbiAgICBjb25zdCBhYm92ZUluZGV4ID0gY3VycmVudEluZGV4IC0gY29scztcbiAgICBpZiAoYWJvdmVJbmRleCA+PSAwKVxuICAgICAgICBzcXVhcmVzW2Fib3ZlSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIGNvbnN0IGJlbG93SW5kZXggPSBjdXJyZW50SW5kZXggKyBjb2xzO1xuICAgIGlmIChiZWxvd0luZGV4IDwgc3F1YXJlcy5sZW5ndGgpXG4gICAgICAgIHNxdWFyZXNbYmVsb3dJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgLy8gTGVmdC9SaWdodC5cbiAgICBjb25zdCBiZWZvcmVJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XG4gICAgaWYgKGJlZm9yZUluZGV4ID49IDAgJiYgYmVmb3JlSW5kZXggJSBjb2xzICE9PSAoY29scyAtIDEpKVxuICAgICAgICBzcXVhcmVzW2JlZm9yZUluZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICBjb25zdCBhZnRlckluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcbiAgICBpZiAoYWZ0ZXJJbmRleCA8IHNxdWFyZXMubGVuZ3RoICYmIGFmdGVySW5kZXggJSBjb2xzICE9PSAwKVxuICAgICAgICBzcXVhcmVzW2FmdGVySW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdiZWZvcmVJbmRleDogJywgYmVmb3JlSW5kZXgsICdhZnRlckluZGV4OicsIGFmdGVySW5kZXgsICdNb2Q6ICcsIGJlZm9yZUluZGV4ICUgY29scywgKGNvbHMtMSkpO1xufVxuZnVuY3Rpb24gYnJ1c2hCb3goc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gc3F1YXJlc0FycmF5LmluZGV4T2YoZSk7XG4gICAgLy8gVXAvRG93bi5cbiAgICBjb25zdCBhYm92ZUluZGV4ID0gY3VycmVudEluZGV4IC0gY29scztcbiAgICBpZiAoYWJvdmVJbmRleCAtIDEgPj0gMCkge1xuICAgICAgICBzcXVhcmVzW2Fib3ZlSW5kZXggLSAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgc3F1YXJlc1thYm92ZUluZGV4ICsgMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGNvbnN0IGJlbG93SW5kZXggPSBjdXJyZW50SW5kZXggKyBjb2xzO1xuICAgIGlmIChiZWxvd0luZGV4ICsgMSA8IHNxdWFyZXMubGVuZ3RoKSB7XG4gICAgICAgIHNxdWFyZXNbYmVsb3dJbmRleCAtIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICBzcXVhcmVzW2JlbG93SW5kZXggKyAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgYnJ1c2hDcm9zcyhzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZUdyaWQgPSBjcmVhdGVHcmlkO1xuZXhwb3J0cy5hZGRTcXVhcmVMaXN0ZW5lcnMgPSBhZGRTcXVhcmVMaXN0ZW5lcnM7XG5jb25zdCBCcnVzaF8xID0gcmVxdWlyZShcIi4vQnJ1c2hcIik7XG5jb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtY29udGFpbmVyJyk7XG5sZXQgaXNNb3VzZURvd24gPSBmYWxzZTtcbmxldCBzdGFydFNxdWFyZSA9IG51bGw7XG5sZXQgc2VsZWN0ZWRTcXVhcmVzID0gbmV3IFNldCgpOyAvLyBVc2lhbW8gdW4gU2V0IHBlciBldml0YXJlIGR1cGxpY2F0aVxubGV0IGlzRHJhZ2dpbmdSaWdodENsaWNrID0gZmFsc2U7XG4vLyBGdW56aW9uZSBwZXIgY3JlYXJlIGxhIGdyaWdsaWEgY29uIGFubm90YXppb25pIGRpIHRpcG9cbmZ1bmN0aW9uIGNyZWF0ZUdyaWQocm93cywgY29scywgYnJ1c2hUeXBlKSB7XG4gICAgLy8gUHVsaXNjZSBpbCBjb250ZW51dG8gcHJlY2VkZW50ZSBkZWwgY29udGVuaXRvcmVcbiAgICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIC8vIEltcG9zdGEgaSB0ZW1wbGF0ZSBwZXIgbGUgcmlnaGUgZSBsZSBjb2xvbm5lIGRlbGxhIGdyaWdsaWEgQ1NTXG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS5ncmlkVGVtcGxhdGVSb3dzID0gYHJlcGVhdCgke3Jvd3N9LCAxZnIpYDtcbiAgICBncmlkQ29udGFpbmVyLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7Y29sc30sIDFmcilgO1xuICAgIC8vIENhbGNvbGEgbGEgbGFyZ2hlenphIGRlbCBjb250ZW5pdG9yZSBpbiBiYXNlIGFsIG51bWVybyBkaSBjb2xvbm5lIGUgYWxsYSBkaW1lbnNpb25lIGRlaSBxdWFkcmF0aSArIGJvcmRpXG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke2NvbHMgKiA1MiAtIDF9cHhgOyAvLyBBc3N1bWVuZG8gY2hlIG9nbmkgcXVhZHJhdG8gc2lhIDUwcHggKyAycHggZGkgYm9yZG8gdG90YWxlXG4gICAgLy8gQ3JlYSBpIHNpbmdvbGkgcXVhZHJhdGkgZGVsbGEgZ3JpZ2xpYVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93cyAqIGNvbHM7IGkrKykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICB9XG4gICAgLy8gQWN0aXZlIGV2ZXJ5IHNxdWFyZSBzZWxlY3RlZC5cbiAgICBhZGRTcXVhcmVMaXN0ZW5lcnMoYnJ1c2hUeXBlLCBjb2xzKTtcbiAgICAvLyBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJykpKTtcbn1cbi8vIEZ1bnppb25lIHBlciBhZ2dpdW5nZXJlIGxpc3RlbmVyIGFpIHF1YWRyYXRpXG5mdW5jdGlvbiBhZGRTcXVhcmVMaXN0ZW5lcnMoYnJ1c2hUeXBlLCBjb2xzKSB7XG4gICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZScpO1xuICAgIGNvbnN0IHNxdWFyZXNBcnJheSA9IEFycmF5LmZyb20oc3F1YXJlcyk7XG4gICAgc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiB7XG4gICAgICAgIGNvbnN0IHNxdWFyZUxpc3RlbmVyID0gKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChlLmJ1dHRvbiA9PT0gMikgeyAvLyAwIMOoIHNpbmlzdHJvLCAxIMOoIGNlbnRyYWxlLCAyIMOoIGRlc3Ryb1xuICAgICAgICAgICAgICAgIGlzRHJhZ2dpbmdSaWdodENsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAoMCwgQnJ1c2hfMS5icnVzaCkoYnJ1c2hUeXBlLCBzcXVhcmVzQXJyYXksIGUudGFyZ2V0LCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IC8vIFNlbGV6aW9uYSBpbCBwcmltbyBxdWFkcmF0b1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhcnRTcXVhcmUgPSBzcXVhcmU7XG4gICAgICAgICAgICBpc01vdXNlRG93biA9IHRydWU7XG4gICAgICAgICAgICBzZWxlY3RlZFNxdWFyZXMuY2xlYXIoKTsgLy8gUHVsaXNjZSBsZSBzZWxlemlvbmkgcHJlY2VkZW50aVxuICAgICAgICAgICAgc2VsZWN0ZWRTcXVhcmVzLmFkZChzcXVhcmUpO1xuICAgICAgICB9O1xuICAgICAgICBzcXVhcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc3F1YXJlTGlzdGVuZXIpO1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc3F1YXJlTGlzdGVuZXIpO1xuICAgICAgICBjb25zdCBzcXVhcmVPdmVyTGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFpc01vdXNlRG93biB8fCAhc3RhcnRTcXVhcmUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFNxdWFyZSA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRTcXVhcmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdncmlkLXNxdWFyZScpICYmICFzZWxlY3RlZFNxdWFyZXMuaGFzKGN1cnJlbnRTcXVhcmUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRHJhZ2dpbmdSaWdodENsaWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJywgJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAoMCwgQnJ1c2hfMS5icnVzaCkoYnJ1c2hUeXBlLCBzcXVhcmVzQXJyYXksIGUudGFyZ2V0LCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRTcXVhcmVzLmFkZChjdXJyZW50U3F1YXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc3F1YXJlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHNxdWFyZU92ZXJMaXN0ZW5lcik7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBzcXVhcmVPdmVyTGlzdGVuZXIpO1xuICAgIH0pO1xuICAgIC8vIExpc3RlbmVyIGdsb2JhbGUgcGVyICdtb3VzZXVwJyBwZXIgZmVybWFyZSBpbCB0cmFjY2lhbWVudG9cbiAgICBjb25zdCBzcXVhcmVVcExpc3RlbmVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChpc0RyYWdnaW5nUmlnaHRDbGljayB8fCBpc01vdXNlRG93bikge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlzRHJhZ2dpbmdSaWdodENsaWNrID0gZmFsc2U7XG4gICAgICAgICAgICBpc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICAgICAgc3RhcnRTcXVhcmUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgc3F1YXJlVXBMaXN0ZW5lcik7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHNxdWFyZVVwTGlzdGVuZXIpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNhdmVNYXBUb0xvY2FsU3RvcmFnZSA9IHNhdmVNYXBUb0xvY2FsU3RvcmFnZTtcbmV4cG9ydHMubG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2UgPSBsb2FkTWFwRnJvbUxvY2FsU3RvcmFnZTtcbi8vIEZpbHRlciBtYXAgbmFtZSBmb3IgdGVjaG5pY2FsIElELlxuY29uc3QgbWFwTmFtZUZuID0gKG1hcE5hbWUpID0+IG1hcE5hbWUucmVwbGFjZUFsbCgnICcsICcnKTtcbi8vIEFzc3VtZW5kbyBjaGUgJ2dyaWRDb250YWluZXInIHNpYSBpbCBjb250ZW5pdG9yZSBkZWxsYSB0dWEgZ3JpZ2xpYVxuZnVuY3Rpb24gc2F2ZU1hcFRvTG9jYWxTdG9yYWdlKGdyaWRDb250YWluZXIsIG1hcE5hbWUpIHtcbiAgICBjb25zdCBzcXVhcmVzID0gQXJyYXkuZnJvbShncmlkQ29udGFpbmVyLmNoaWxkcmVuKTtcbiAgICBjb25zdCBtYXBEYXRhID0gc3F1YXJlcy5tYXAoc3F1YXJlID0+ICh7XG4gICAgICAgIHM6IHNxdWFyZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpXG4gICAgfSkpO1xuICAgIGNvbnN0IG1hcE5hbWVGaWx0ZXJlZCA9IG1hcE5hbWVGbihtYXBOYW1lKTtcbiAgICAvLyBBZGQgb3B0aW9uIHRvIHNhdmVkIG1hcHMuXG4gICAgY29uc3QgbWFwTmFtZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWVzJyk7XG4gICAgY29uc3QgbmV3T3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgbmV3T3B0aW9uLnZhbHVlID0gbWFwTmFtZUZpbHRlcmVkOyAvLyBJbCB2YWxvcmUgZWZmZXR0aXZvIGRlbGwnb3B6aW9uZVxuICAgIG5ld09wdGlvbi50ZXh0Q29udGVudCA9IG1hcE5hbWU7IC8vIElsIHRlc3RvIHZpc2liaWxlIGFsbCd1dGVudGVcbiAgICBtYXBOYW1lcy5hcHBlbmRDaGlsZChuZXdPcHRpb24pO1xuICAgIC8vIFNlcmlhbGl6emEgaSBkYXRpIGluIHVuYSBzdHJpbmdhIEpTT05cbiAgICBjb25zdCBzZXJpYWxpemVkTWFwID0gSlNPTi5zdHJpbmdpZnkobWFwRGF0YSk7XG4gICAgLy8gU2FsdmEgbGEgc3RyaW5nYSBuZWwgTG9jYWxTdG9yYWdlIGNvbiB1bmEgY2hpYXZlXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NhdmVkTWFwXycgKyBtYXBOYW1lRmlsdGVyZWQsIHNlcmlhbGl6ZWRNYXApO1xuICAgIGNvbnNvbGUubG9nKCdNYXBwYSBzYWx2YXRhIGNvbiBzdWNjZXNzby4nKTtcbn1cbmZ1bmN0aW9uIGxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlKGdyaWRDb250YWluZXIsIG1hcE5hbWUpIHtcbiAgICAvLyBSZWN1cGVyYSBsYSBzdHJpbmdhIHNlcmlhbGl6emF0YVxuICAgIGNvbnN0IHNlcmlhbGl6ZWRNYXAgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2F2ZWRNYXBfJyArIG1hcE5hbWVGbihtYXBOYW1lKSk7XG4gICAgaWYgKHNlcmlhbGl6ZWRNYXApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIERlc2VyaWFsaXp6YSBsYSBzdHJpbmdhIGluIHVuIGFycmF5IGRpIG9nZ2V0dGlcbiAgICAgICAgICAgIGNvbnN0IG1hcERhdGEgPSBKU09OLnBhcnNlKHNlcmlhbGl6ZWRNYXApO1xuICAgICAgICAgICAgY29uc3Qgc3F1YXJlcyA9IEFycmF5LmZyb20oZ3JpZENvbnRhaW5lci5jaGlsZHJlbik7XG4gICAgICAgICAgICAvLyBBc3NpY3VyYXRpIGNoZSBsZSBkaW1lbnNpb25pIGRlbGxhIGdyaWdsaWEgY29ycmlzcG9uZGFubyBhaSBkYXRpIHNhbHZhdGlcbiAgICAgICAgICAgIGlmIChtYXBEYXRhLmxlbmd0aCA9PT0gc3F1YXJlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBBcHBsaWNhIGxvIHN0YXRvIHNhbHZhdG8gYSBvZ25pIHF1YWRyYXRvIGRlbGxhIGdyaWdsaWFcbiAgICAgICAgICAgICAgICBtYXBEYXRhLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNxdWFyZXNbaW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3F1YXJlc1tpbmRleF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTWFwcGEgY2FyaWNhdGEgY29uIHN1Y2Nlc3NvLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdMZSBkaW1lbnNpb25pIGRlbGxhIGdyaWdsaWEgbm9uIGNvcnJpc3BvbmRvbm8gYWkgZGF0aSBzYWx2YXRpLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcmUgZHVyYW50ZSBsYSBkZXNlcmlhbGl6emF6aW9uZSBkZWkgZGF0aS4nLCBlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ05lc3N1bmEgbWFwcGEgc2FsdmF0YSB0cm92YXRhLicpO1xuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gcmFuZG9taXplU3F1YXJlO1xuLy8gRnVuemlvbmUgcGVyIHJhbmRvbWl6emFyZSB1biBxdWFkcmF0byBjb24gYW5ub3RhemlvbmkgZGkgdGlwb1xuZnVuY3Rpb24gcmFuZG9taXplU3F1YXJlKCkge1xuICAgIC8vIFNlbGV6aW9uYSB0dXR0aSBnbGkgZWxlbWVudGkgY29uIGxhIGNsYXNzZSAnZ3JpZC1zcXVhcmUnXG4gICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZS5hY3RpdmUnKTtcbiAgICAvLyBWZXJpZmljYSBzZSBjaSBzb25vIHF1YWRyYXRpIG5lbGxhIGdyaWdsaWFcbiAgICBpZiAoc3F1YXJlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYWxlcnQoJ1BlciBmYXZvcmUsIGNyZWEgcHJpbWEgdW5hIGdyaWdsaWEhJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gUmltdW92ZSBsYSBjbGFzc2UgJ3NlbGVjdGVkJyBkYSB0dXR0aSBpIHF1YWRyYXRpIHBlciBkZXNlbGV6aW9uYXJlIHF1ZWxsbyBwcmVjZWRlbnRlbWVudGUgZXZpZGVuemlhdG9cbiAgICBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpKTtcbiAgICAvLyBDYWxjb2xhIHVuIGluZGljZSBjYXN1YWxlIGFsbCdpbnRlcm5vIGRlbGwnYXJyYXkgZGkgcXVhZHJhdGlcbiAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNxdWFyZXMubGVuZ3RoKTtcbiAgICAvLyBBZ2dpdW5nZSBsYSBjbGFzc2UgJ3NlbGVjdGVkJyBhbCBxdWFkcmF0byBzY2VsdG8gY2FzdWFsbWVudGVcbiAgICBzcXVhcmVzW3JhbmRvbUluZGV4XS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCByYW5kb21pemVTcXVhcmVfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9mdW5jdGlvbnMvcmFuZG9taXplU3F1YXJlXCIpKTtcbmNvbnN0IEdyaWRfMSA9IHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9HcmlkXCIpO1xuY29uc3QgU2F2ZV8xID0gcmVxdWlyZShcIi4vZnVuY3Rpb25zL1NhdmVcIik7XG5jb25zdCBCYWNrZ3JvdW5kXzEgPSByZXF1aXJlKFwiLi9mdW5jdGlvbnMvQmFja2dyb3VuZFwiKTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgbGV0IGJydXNoVHlwZSA9ICdjcm9zcyc7XG4gICAgbGV0IGdyaWRDb2xzID0gMTU7XG4gICAgbGV0IGdyaWRSb3dzID0gMTU7XG4gICAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLWNvbnRhaW5lcicpO1xuICAgIC8vIEFjdGl2ZSBldmVyeSBzcXVhcmUgc2VsZWN0ZWQuXG4gICAgY29uc3QgY3JlYXRlR3JpZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjcmVhdGUtZ3JpZC1idG4nKTtcbiAgICBjcmVhdGVHcmlkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBncmlkUm93cyA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLXJhbmdlLXJvd3MnKS52YWx1ZSk7XG4gICAgICAgIGdyaWRDb2xzID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtcmFuZ2UnKS52YWx1ZSk7XG4gICAgICAgICgwLCBHcmlkXzEuY3JlYXRlR3JpZCkoZ3JpZFJvd3MsIGdyaWRDb2xzLCBicnVzaFR5cGUpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhci1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtcmFuZ2UnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICBncmlkQ29scyA9IHBhcnNlSW50KChlPy50YXJnZXQpLnZhbHVlKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtbGFiZWwnKS5pbm5lclRleHQgPSBncmlkQ29scyArICd4JyArIGdyaWRSb3dzO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYW5kb21pemUtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByYW5kb21pemVTcXVhcmVfMS5kZWZhdWx0KTtcbiAgICAvLyBDaGlhbWEgbGEgZnVuemlvbmUgZGkgcmFuZG9taXp6YXppb25lIGFsIGNsaWNrIGRlbCBwdWxzYW50ZS5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F2ZS1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFwTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtbmFtZScpLnZhbHVlO1xuICAgICAgICAoMCwgU2F2ZV8xLnNhdmVNYXBUb0xvY2FsU3RvcmFnZSkoZ3JpZENvbnRhaW5lciwgbWFwTmFtZSk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWQtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcE5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWVzJykudmFsdWU7XG4gICAgICAgICgwLCBTYXZlXzEubG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2UpKGdyaWRDb250YWluZXIsIG1hcE5hbWUpO1xuICAgIH0pO1xuICAgIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwiYnJ1c2gtb3B0aW9uc1wiXScpKS5mb3JFYWNoKHJhZGlvID0+IHtcbiAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgYnJ1c2hUeXBlID0gKGU/LnRhcmdldCkudmFsdWU7XG4gICAgICAgICAgICAoMCwgR3JpZF8xLmFkZFNxdWFyZUxpc3RlbmVycykoYnJ1c2hUeXBlLCBncmlkQ29scyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwiYmFjay1vcHRpb25zXCJdJykpLmZvckVhY2gocmFkaW8gPT4ge1xuICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiAoMCwgQmFja2dyb3VuZF8xLmJhY2spKGdyaWRDb250YWluZXIsIChlPy50YXJnZXQpLnZhbHVlKSk7XG4gICAgfSk7XG4gICAgZ3JpZENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChlKSA9PiBlLnByZXZlbnREZWZhdWx0KCkpO1xuICAgIC8vIENyZWEgdW5hIGdyaWdsaWEgZGkgZGltZW5zaW9uaSBwcmVkZWZpbml0ZSBhbGwnYXZ2aW8gZGVsbGEgcGFnaW5hXG4gICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG59KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==