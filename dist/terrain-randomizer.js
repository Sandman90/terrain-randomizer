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
// let isMouseDown = false;
// let startSquare: HTMLElement | null = null;
// let selectedSquares: Set<HTMLElement> = new Set(); // Usiamo un Set per evitare duplicati
// let isDraggingRightClick = false;
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
let isMouseDown = false;
let startSquare = null;
let selectedSquares = new Set();
let isDraggingRightClick = false;
// Variabili globali per memorizzare i riferimenti ai listener
let squareListenerRef = null;
let squareOverListenerRef = null;
let squareUpListenerRef = null;
// Funzione per rimuovere tutti i vecchi listener
function removeOldListeners() {
    const squares = document.querySelectorAll('.grid-square');
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
function addSquareListeners(brushType, cols) {
    // Rimuove i vecchi listener prima di applicare i nuovi
    removeOldListeners();
    const squares = document.querySelectorAll('.grid-square');
    const squaresArray = Array.from(squares);
    // Dichiarazione dei listener con un nome, in modo che possano essere rimossi
    squareListenerRef = (e) => {
        e.preventDefault();
        if (e.button === 2) {
            isDraggingRightClick = true;
            e.target.classList.remove('active');
        }
        else {
            (0, Brush_1.brush)(brushType, squaresArray, e.target, squares, cols);
            e.target.classList.add('active');
        }
        startSquare = e.target;
        isMouseDown = true;
        selectedSquares.clear();
        selectedSquares.add(e.target);
    };
    squareOverListenerRef = (e) => {
        if (!isMouseDown || !startSquare)
            return;
        const currentSquare = e.target;
        if (currentSquare.classList.contains('grid-square') && !selectedSquares.has(currentSquare)) {
            if (isDraggingRightClick) {
                currentSquare.classList.remove('active', 'selected');
            }
            else {
                (0, Brush_1.brush)(brushType, squaresArray, currentSquare, squares, cols);
                currentSquare.classList.add('active');
            }
            selectedSquares.add(currentSquare);
            console.log('brushType listener: ', brushType);
        }
    };
    squareUpListenerRef = (event) => {
        if (isDraggingRightClick || isMouseDown) {
            event.preventDefault();
            isDraggingRightClick = false;
            isMouseDown = false;
            startSquare = null;
        }
    };
    // Applicazione dei nuovi listener
    squares.forEach(square => {
        square.addEventListener('mousedown', squareListenerRef);
        square.addEventListener('mouseover', squareOverListenerRef);
    });
    document.addEventListener('mouseup', squareUpListenerRef);
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
        createGridBtn.disabled = true;
    });
    document.getElementById('clear-btn').addEventListener('click', () => {
        (0, Grid_1.createGrid)(gridRows, gridCols, brushType);
    });
    document.getElementById('grid-range-rows').addEventListener('change', (e) => {
        gridRows = parseInt((e?.target).value);
        document.getElementById('grid-label').innerText = gridCols + 'x' + gridRows;
        createGridBtn.disabled = false;
    });
    document.getElementById('grid-range').addEventListener('change', (e) => {
        gridCols = parseInt((e?.target).value);
        document.getElementById('grid-label').innerText = gridCols + 'x' + gridRows;
        createGridBtn.disabled = false;
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
            console.log('brushType: ', brushType);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ3pDLHFCQUFxQixtQkFBTyxDQUFDLDZEQUF3QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7VUMxREQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvQmFja2dyb3VuZC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL0JydXNoLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvR3JpZC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL1NhdmUudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9yYW5kb21pemVTcXVhcmUudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJhY2sgPSBiYWNrO1xuZnVuY3Rpb24gYmFjayhncmlkQ29udGFpbmVyLCBiYWNrVHlwZSkge1xuICAgIGxldCBiYWNrZ3JvdW5kID0gMTtcbiAgICBzd2l0Y2ggKGJhY2tUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJyb2NrXCI6XG4gICAgICAgICAgICBiYWNrZ3JvdW5kID0gMjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwid29vZFwiOlxuICAgICAgICAgICAgYmFja2dyb3VuZCA9IDM7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcuL2ltYWdlcy9CYWNrZ3JvdW5kVGVycmFpbiR7YmFja2dyb3VuZH0uanBnYDtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5icnVzaCA9IGJydXNoO1xuZnVuY3Rpb24gYnJ1c2goYnJ1c2hUeXBlLCBzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpIHtcbiAgICBzd2l0Y2ggKGJydXNoVHlwZSkge1xuICAgICAgICBjYXNlIFwiY3Jvc3NcIjpcbiAgICAgICAgICAgIGJydXNoQ3Jvc3Moc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm94XCI6XG4gICAgICAgICAgICBicnVzaEJveChzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNhc2UgXCJwb2ludFwiOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuZnVuY3Rpb24gYnJ1c2hDcm9zcyhzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpIHtcbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSBzcXVhcmVzQXJyYXkuaW5kZXhPZihlKTtcbiAgICAvLyBVcC9Eb3duLlxuICAgIGNvbnN0IGFib3ZlSW5kZXggPSBjdXJyZW50SW5kZXggLSBjb2xzO1xuICAgIGlmIChhYm92ZUluZGV4ID49IDApXG4gICAgICAgIHNxdWFyZXNbYWJvdmVJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgY29uc3QgYmVsb3dJbmRleCA9IGN1cnJlbnRJbmRleCArIGNvbHM7XG4gICAgaWYgKGJlbG93SW5kZXggPCBzcXVhcmVzLmxlbmd0aClcbiAgICAgICAgc3F1YXJlc1tiZWxvd0luZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAvLyBMZWZ0L1JpZ2h0LlxuICAgIGNvbnN0IGJlZm9yZUluZGV4ID0gY3VycmVudEluZGV4IC0gMTtcbiAgICBpZiAoYmVmb3JlSW5kZXggPj0gMCAmJiBiZWZvcmVJbmRleCAlIGNvbHMgIT09IChjb2xzIC0gMSkpXG4gICAgICAgIHNxdWFyZXNbYmVmb3JlSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIGNvbnN0IGFmdGVySW5kZXggPSBjdXJyZW50SW5kZXggKyAxO1xuICAgIGlmIChhZnRlckluZGV4IDwgc3F1YXJlcy5sZW5ndGggJiYgYWZ0ZXJJbmRleCAlIGNvbHMgIT09IDApXG4gICAgICAgIHNxdWFyZXNbYWZ0ZXJJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgLy8gY29uc29sZS5sb2coJ2JlZm9yZUluZGV4OiAnLCBiZWZvcmVJbmRleCwgJ2FmdGVySW5kZXg6JywgYWZ0ZXJJbmRleCwgJ01vZDogJywgYmVmb3JlSW5kZXggJSBjb2xzLCAoY29scy0xKSk7XG59XG5mdW5jdGlvbiBicnVzaEJveChzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpIHtcbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSBzcXVhcmVzQXJyYXkuaW5kZXhPZihlKTtcbiAgICAvLyBVcC9Eb3duLlxuICAgIGNvbnN0IGFib3ZlSW5kZXggPSBjdXJyZW50SW5kZXggLSBjb2xzO1xuICAgIGlmIChhYm92ZUluZGV4IC0gMSA+PSAwKSB7XG4gICAgICAgIHNxdWFyZXNbYWJvdmVJbmRleCAtIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICBzcXVhcmVzW2Fib3ZlSW5kZXggKyAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgY29uc3QgYmVsb3dJbmRleCA9IGN1cnJlbnRJbmRleCArIGNvbHM7XG4gICAgaWYgKGJlbG93SW5kZXggKyAxIDwgc3F1YXJlcy5sZW5ndGgpIHtcbiAgICAgICAgc3F1YXJlc1tiZWxvd0luZGV4IC0gMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIHNxdWFyZXNbYmVsb3dJbmRleCArIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBicnVzaENyb3NzKHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scyk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlR3JpZCA9IGNyZWF0ZUdyaWQ7XG5leHBvcnRzLmFkZFNxdWFyZUxpc3RlbmVycyA9IGFkZFNxdWFyZUxpc3RlbmVycztcbmNvbnN0IEJydXNoXzEgPSByZXF1aXJlKFwiLi9CcnVzaFwiKTtcbmNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1jb250YWluZXInKTtcbi8vIGxldCBpc01vdXNlRG93biA9IGZhbHNlO1xuLy8gbGV0IHN0YXJ0U3F1YXJlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuLy8gbGV0IHNlbGVjdGVkU3F1YXJlczogU2V0PEhUTUxFbGVtZW50PiA9IG5ldyBTZXQoKTsgLy8gVXNpYW1vIHVuIFNldCBwZXIgZXZpdGFyZSBkdXBsaWNhdGlcbi8vIGxldCBpc0RyYWdnaW5nUmlnaHRDbGljayA9IGZhbHNlO1xuLy8gRnVuemlvbmUgcGVyIGNyZWFyZSBsYSBncmlnbGlhIGNvbiBhbm5vdGF6aW9uaSBkaSB0aXBvXG5mdW5jdGlvbiBjcmVhdGVHcmlkKHJvd3MsIGNvbHMsIGJydXNoVHlwZSkge1xuICAgIC8vIFB1bGlzY2UgaWwgY29udGVudXRvIHByZWNlZGVudGUgZGVsIGNvbnRlbml0b3JlXG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAvLyBJbXBvc3RhIGkgdGVtcGxhdGUgcGVyIGxlIHJpZ2hlIGUgbGUgY29sb25uZSBkZWxsYSBncmlnbGlhIENTU1xuICAgIGdyaWRDb250YWluZXIuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtyb3dzfSwgMWZyKWA7XG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke2NvbHN9LCAxZnIpYDtcbiAgICAvLyBDYWxjb2xhIGxhIGxhcmdoZXp6YSBkZWwgY29udGVuaXRvcmUgaW4gYmFzZSBhbCBudW1lcm8gZGkgY29sb25uZSBlIGFsbGEgZGltZW5zaW9uZSBkZWkgcXVhZHJhdGkgKyBib3JkaVxuICAgIGdyaWRDb250YWluZXIuc3R5bGUud2lkdGggPSBgJHtjb2xzICogNTIgLSAxfXB4YDsgLy8gQXNzdW1lbmRvIGNoZSBvZ25pIHF1YWRyYXRvIHNpYSA1MHB4ICsgMnB4IGRpIGJvcmRvIHRvdGFsZVxuICAgIC8vIENyZWEgaSBzaW5nb2xpIHF1YWRyYXRpIGRlbGxhIGdyaWdsaWFcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3MgKiBjb2xzOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdncmlkLXNxdWFyZScpO1xuICAgICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgfVxuICAgIC8vIEFjdGl2ZSBldmVyeSBzcXVhcmUgc2VsZWN0ZWQuXG4gICAgYWRkU3F1YXJlTGlzdGVuZXJzKGJydXNoVHlwZSwgY29scyk7XG4gICAgLy8gc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4gc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpKSk7XG59XG5sZXQgaXNNb3VzZURvd24gPSBmYWxzZTtcbmxldCBzdGFydFNxdWFyZSA9IG51bGw7XG5sZXQgc2VsZWN0ZWRTcXVhcmVzID0gbmV3IFNldCgpO1xubGV0IGlzRHJhZ2dpbmdSaWdodENsaWNrID0gZmFsc2U7XG4vLyBWYXJpYWJpbGkgZ2xvYmFsaSBwZXIgbWVtb3JpenphcmUgaSByaWZlcmltZW50aSBhaSBsaXN0ZW5lclxubGV0IHNxdWFyZUxpc3RlbmVyUmVmID0gbnVsbDtcbmxldCBzcXVhcmVPdmVyTGlzdGVuZXJSZWYgPSBudWxsO1xubGV0IHNxdWFyZVVwTGlzdGVuZXJSZWYgPSBudWxsO1xuLy8gRnVuemlvbmUgcGVyIHJpbXVvdmVyZSB0dXR0aSBpIHZlY2NoaSBsaXN0ZW5lclxuZnVuY3Rpb24gcmVtb3ZlT2xkTGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcbiAgICBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHtcbiAgICAgICAgaWYgKHNxdWFyZUxpc3RlbmVyUmVmKSB7XG4gICAgICAgICAgICBzcXVhcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc3F1YXJlTGlzdGVuZXJSZWYpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcXVhcmVPdmVyTGlzdGVuZXJSZWYpIHtcbiAgICAgICAgICAgIHNxdWFyZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBzcXVhcmVPdmVyTGlzdGVuZXJSZWYpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHNxdWFyZVVwTGlzdGVuZXJSZWYpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHNxdWFyZVVwTGlzdGVuZXJSZWYpO1xuICAgIH1cbn1cbi8vIEZ1bnppb25lIHByaW5jaXBhbGUgcGVyIGFnZ2l1bmdlcmUgbnVvdmkgbGlzdGVuZXJcbmZ1bmN0aW9uIGFkZFNxdWFyZUxpc3RlbmVycyhicnVzaFR5cGUsIGNvbHMpIHtcbiAgICAvLyBSaW11b3ZlIGkgdmVjY2hpIGxpc3RlbmVyIHByaW1hIGRpIGFwcGxpY2FyZSBpIG51b3ZpXG4gICAgcmVtb3ZlT2xkTGlzdGVuZXJzKCk7XG4gICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZScpO1xuICAgIGNvbnN0IHNxdWFyZXNBcnJheSA9IEFycmF5LmZyb20oc3F1YXJlcyk7XG4gICAgLy8gRGljaGlhcmF6aW9uZSBkZWkgbGlzdGVuZXIgY29uIHVuIG5vbWUsIGluIG1vZG8gY2hlIHBvc3Nhbm8gZXNzZXJlIHJpbW9zc2lcbiAgICBzcXVhcmVMaXN0ZW5lclJlZiA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKGUuYnV0dG9uID09PSAyKSB7XG4gICAgICAgICAgICBpc0RyYWdnaW5nUmlnaHRDbGljayA9IHRydWU7XG4gICAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICgwLCBCcnVzaF8xLmJydXNoKShicnVzaFR5cGUsIHNxdWFyZXNBcnJheSwgZS50YXJnZXQsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhcnRTcXVhcmUgPSBlLnRhcmdldDtcbiAgICAgICAgaXNNb3VzZURvd24gPSB0cnVlO1xuICAgICAgICBzZWxlY3RlZFNxdWFyZXMuY2xlYXIoKTtcbiAgICAgICAgc2VsZWN0ZWRTcXVhcmVzLmFkZChlLnRhcmdldCk7XG4gICAgfTtcbiAgICBzcXVhcmVPdmVyTGlzdGVuZXJSZWYgPSAoZSkgPT4ge1xuICAgICAgICBpZiAoIWlzTW91c2VEb3duIHx8ICFzdGFydFNxdWFyZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgY3VycmVudFNxdWFyZSA9IGUudGFyZ2V0O1xuICAgICAgICBpZiAoY3VycmVudFNxdWFyZS5jbGFzc0xpc3QuY29udGFpbnMoJ2dyaWQtc3F1YXJlJykgJiYgIXNlbGVjdGVkU3F1YXJlcy5oYXMoY3VycmVudFNxdWFyZSkpIHtcbiAgICAgICAgICAgIGlmIChpc0RyYWdnaW5nUmlnaHRDbGljaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJywgJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAoMCwgQnJ1c2hfMS5icnVzaCkoYnJ1c2hUeXBlLCBzcXVhcmVzQXJyYXksIGN1cnJlbnRTcXVhcmUsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxlY3RlZFNxdWFyZXMuYWRkKGN1cnJlbnRTcXVhcmUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2JydXNoVHlwZSBsaXN0ZW5lcjogJywgYnJ1c2hUeXBlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgc3F1YXJlVXBMaXN0ZW5lclJlZiA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAoaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgfHwgaXNNb3VzZURvd24pIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpc0RyYWdnaW5nUmlnaHRDbGljayA9IGZhbHNlO1xuICAgICAgICAgICAgaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIHN0YXJ0U3F1YXJlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gQXBwbGljYXppb25lIGRlaSBudW92aSBsaXN0ZW5lclxuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc3F1YXJlTGlzdGVuZXJSZWYpO1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgc3F1YXJlT3Zlckxpc3RlbmVyUmVmKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgc3F1YXJlVXBMaXN0ZW5lclJlZik7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2F2ZU1hcFRvTG9jYWxTdG9yYWdlID0gc2F2ZU1hcFRvTG9jYWxTdG9yYWdlO1xuZXhwb3J0cy5sb2FkTWFwRnJvbUxvY2FsU3RvcmFnZSA9IGxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlO1xuLy8gRmlsdGVyIG1hcCBuYW1lIGZvciB0ZWNobmljYWwgSUQuXG5jb25zdCBtYXBOYW1lRm4gPSAobWFwTmFtZSkgPT4gbWFwTmFtZS5yZXBsYWNlQWxsKCcgJywgJycpO1xuLy8gQXNzdW1lbmRvIGNoZSAnZ3JpZENvbnRhaW5lcicgc2lhIGlsIGNvbnRlbml0b3JlIGRlbGxhIHR1YSBncmlnbGlhXG5mdW5jdGlvbiBzYXZlTWFwVG9Mb2NhbFN0b3JhZ2UoZ3JpZENvbnRhaW5lciwgbWFwTmFtZSkge1xuICAgIGNvbnN0IHNxdWFyZXMgPSBBcnJheS5mcm9tKGdyaWRDb250YWluZXIuY2hpbGRyZW4pO1xuICAgIGNvbnN0IG1hcERhdGEgPSBzcXVhcmVzLm1hcChzcXVhcmUgPT4gKHtcbiAgICAgICAgczogc3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcbiAgICB9KSk7XG4gICAgY29uc3QgbWFwTmFtZUZpbHRlcmVkID0gbWFwTmFtZUZuKG1hcE5hbWUpO1xuICAgIC8vIEFkZCBvcHRpb24gdG8gc2F2ZWQgbWFwcy5cbiAgICBjb25zdCBtYXBOYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtbmFtZXMnKTtcbiAgICBjb25zdCBuZXdPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBuZXdPcHRpb24udmFsdWUgPSBtYXBOYW1lRmlsdGVyZWQ7IC8vIElsIHZhbG9yZSBlZmZldHRpdm8gZGVsbCdvcHppb25lXG4gICAgbmV3T3B0aW9uLnRleHRDb250ZW50ID0gbWFwTmFtZTsgLy8gSWwgdGVzdG8gdmlzaWJpbGUgYWxsJ3V0ZW50ZVxuICAgIG1hcE5hbWVzLmFwcGVuZENoaWxkKG5ld09wdGlvbik7XG4gICAgLy8gU2VyaWFsaXp6YSBpIGRhdGkgaW4gdW5hIHN0cmluZ2EgSlNPTlxuICAgIGNvbnN0IHNlcmlhbGl6ZWRNYXAgPSBKU09OLnN0cmluZ2lmeShtYXBEYXRhKTtcbiAgICAvLyBTYWx2YSBsYSBzdHJpbmdhIG5lbCBMb2NhbFN0b3JhZ2UgY29uIHVuYSBjaGlhdmVcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRNYXBfJyArIG1hcE5hbWVGaWx0ZXJlZCwgc2VyaWFsaXplZE1hcCk7XG4gICAgY29uc29sZS5sb2coJ01hcHBhIHNhbHZhdGEgY29uIHN1Y2Nlc3NvLicpO1xufVxuZnVuY3Rpb24gbG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2UoZ3JpZENvbnRhaW5lciwgbWFwTmFtZSkge1xuICAgIC8vIFJlY3VwZXJhIGxhIHN0cmluZ2Egc2VyaWFsaXp6YXRhXG4gICAgY29uc3Qgc2VyaWFsaXplZE1hcCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlZE1hcF8nICsgbWFwTmFtZUZuKG1hcE5hbWUpKTtcbiAgICBpZiAoc2VyaWFsaXplZE1hcCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gRGVzZXJpYWxpenphIGxhIHN0cmluZ2EgaW4gdW4gYXJyYXkgZGkgb2dnZXR0aVxuICAgICAgICAgICAgY29uc3QgbWFwRGF0YSA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZE1hcCk7XG4gICAgICAgICAgICBjb25zdCBzcXVhcmVzID0gQXJyYXkuZnJvbShncmlkQ29udGFpbmVyLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIC8vIEFzc2ljdXJhdGkgY2hlIGxlIGRpbWVuc2lvbmkgZGVsbGEgZ3JpZ2xpYSBjb3JyaXNwb25kYW5vIGFpIGRhdGkgc2FsdmF0aVxuICAgICAgICAgICAgaWYgKG1hcERhdGEubGVuZ3RoID09PSBzcXVhcmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIEFwcGxpY2EgbG8gc3RhdG8gc2FsdmF0byBhIG9nbmkgcXVhZHJhdG8gZGVsbGEgZ3JpZ2xpYVxuICAgICAgICAgICAgICAgIG1hcERhdGEuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3F1YXJlc1tpbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcXVhcmVzW2luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNYXBwYSBjYXJpY2F0YSBjb24gc3VjY2Vzc28uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0xlIGRpbWVuc2lvbmkgZGVsbGEgZ3JpZ2xpYSBub24gY29ycmlzcG9uZG9ubyBhaSBkYXRpIHNhbHZhdGkuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yZSBkdXJhbnRlIGxhIGRlc2VyaWFsaXp6YXppb25lIGRlaSBkYXRpLicsIGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnTmVzc3VuYSBtYXBwYSBzYWx2YXRhIHRyb3ZhdGEuJyk7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSByYW5kb21pemVTcXVhcmU7XG4vLyBGdW56aW9uZSBwZXIgcmFuZG9taXp6YXJlIHVuIHF1YWRyYXRvIGNvbiBhbm5vdGF6aW9uaSBkaSB0aXBvXG5mdW5jdGlvbiByYW5kb21pemVTcXVhcmUoKSB7XG4gICAgLy8gU2VsZXppb25hIHR1dHRpIGdsaSBlbGVtZW50aSBjb24gbGEgY2xhc3NlICdncmlkLXNxdWFyZSdcbiAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlLmFjdGl2ZScpO1xuICAgIC8vIFZlcmlmaWNhIHNlIGNpIHNvbm8gcXVhZHJhdGkgbmVsbGEgZ3JpZ2xpYVxuICAgIGlmIChzcXVhcmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBhbGVydCgnUGVyIGZhdm9yZSwgY3JlYSBwcmltYSB1bmEgZ3JpZ2xpYSEnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBSaW11b3ZlIGxhIGNsYXNzZSAnc2VsZWN0ZWQnIGRhIHR1dHRpIGkgcXVhZHJhdGkgcGVyIGRlc2VsZXppb25hcmUgcXVlbGxvIHByZWNlZGVudGVtZW50ZSBldmlkZW56aWF0b1xuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4gc3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJykpO1xuICAgIC8vIENhbGNvbGEgdW4gaW5kaWNlIGNhc3VhbGUgYWxsJ2ludGVybm8gZGVsbCdhcnJheSBkaSBxdWFkcmF0aVxuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc3F1YXJlcy5sZW5ndGgpO1xuICAgIC8vIEFnZ2l1bmdlIGxhIGNsYXNzZSAnc2VsZWN0ZWQnIGFsIHF1YWRyYXRvIHNjZWx0byBjYXN1YWxtZW50ZVxuICAgIHNxdWFyZXNbcmFuZG9tSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHJhbmRvbWl6ZVNxdWFyZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9yYW5kb21pemVTcXVhcmVcIikpO1xuY29uc3QgR3JpZF8xID0gcmVxdWlyZShcIi4vZnVuY3Rpb25zL0dyaWRcIik7XG5jb25zdCBTYXZlXzEgPSByZXF1aXJlKFwiLi9mdW5jdGlvbnMvU2F2ZVwiKTtcbmNvbnN0IEJhY2tncm91bmRfMSA9IHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9CYWNrZ3JvdW5kXCIpO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICBsZXQgYnJ1c2hUeXBlID0gJ2Nyb3NzJztcbiAgICBsZXQgZ3JpZENvbHMgPSAxNTtcbiAgICBsZXQgZ3JpZFJvd3MgPSAxNTtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtY29udGFpbmVyJyk7XG4gICAgLy8gQWN0aXZlIGV2ZXJ5IHNxdWFyZSBzZWxlY3RlZC5cbiAgICBjb25zdCBjcmVhdGVHcmlkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZS1ncmlkLWJ0bicpO1xuICAgIGNyZWF0ZUdyaWRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGdyaWRSb3dzID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtcmFuZ2Utcm93cycpLnZhbHVlKTtcbiAgICAgICAgZ3JpZENvbHMgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1yYW5nZScpLnZhbHVlKTtcbiAgICAgICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG4gICAgICAgIGNyZWF0ZUdyaWRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhci1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtcmFuZ2Utcm93cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIGdyaWRSb3dzID0gcGFyc2VJbnQoKGU/LnRhcmdldCkudmFsdWUpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1sYWJlbCcpLmlubmVyVGV4dCA9IGdyaWRDb2xzICsgJ3gnICsgZ3JpZFJvd3M7XG4gICAgICAgIGNyZWF0ZUdyaWRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1yYW5nZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIGdyaWRDb2xzID0gcGFyc2VJbnQoKGU/LnRhcmdldCkudmFsdWUpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1sYWJlbCcpLmlubmVyVGV4dCA9IGdyaWRDb2xzICsgJ3gnICsgZ3JpZFJvd3M7XG4gICAgICAgIGNyZWF0ZUdyaWRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmFuZG9taXplLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmFuZG9taXplU3F1YXJlXzEuZGVmYXVsdCk7XG4gICAgLy8gQ2hpYW1hIGxhIGZ1bnppb25lIGRpIHJhbmRvbWl6emF6aW9uZSBhbCBjbGljayBkZWwgcHVsc2FudGUuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmUtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcE5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWUnKS52YWx1ZTtcbiAgICAgICAgKDAsIFNhdmVfMS5zYXZlTWFwVG9Mb2NhbFN0b3JhZ2UpKGdyaWRDb250YWluZXIsIG1hcE5hbWUpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXBOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1uYW1lcycpLnZhbHVlO1xuICAgICAgICAoMCwgU2F2ZV8xLmxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlKShncmlkQ29udGFpbmVyLCBtYXBOYW1lKTtcbiAgICB9KTtcbiAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cImJydXNoLW9wdGlvbnNcIl0nKSkuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGJydXNoVHlwZSA9IChlPy50YXJnZXQpLnZhbHVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2JydXNoVHlwZTogJywgYnJ1c2hUeXBlKTtcbiAgICAgICAgICAgICgwLCBHcmlkXzEuYWRkU3F1YXJlTGlzdGVuZXJzKShicnVzaFR5cGUsIGdyaWRDb2xzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJiYWNrLW9wdGlvbnNcIl0nKSkuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+ICgwLCBCYWNrZ3JvdW5kXzEuYmFjaykoZ3JpZENvbnRhaW5lciwgKGU/LnRhcmdldCkudmFsdWUpKTtcbiAgICB9KTtcbiAgICBncmlkQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgKGUpID0+IGUucHJldmVudERlZmF1bHQoKSk7XG4gICAgLy8gQ3JlYSB1bmEgZ3JpZ2xpYSBkaSBkaW1lbnNpb25pIHByZWRlZmluaXRlIGFsbCdhdnZpbyBkZWxsYSBwYWdpbmFcbiAgICAoMCwgR3JpZF8xLmNyZWF0ZUdyaWQpKGdyaWRSb3dzLCBncmlkQ29scywgYnJ1c2hUeXBlKTtcbn0pO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9