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
    gridContainer.style.backgroundImage = `url('../images/BackgroundTerrain${background}.jpg`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7O1VDakREO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL0JhY2tncm91bmQudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9CcnVzaC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL0dyaWQudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9TYXZlLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvcmFuZG9taXplU3F1YXJlLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5iYWNrID0gYmFjaztcbmZ1bmN0aW9uIGJhY2soZ3JpZENvbnRhaW5lciwgYmFja1R5cGUpIHtcbiAgICBsZXQgYmFja2dyb3VuZCA9IDE7XG4gICAgc3dpdGNoIChiYWNrVHlwZSkge1xuICAgICAgICBjYXNlIFwicm9ja1wiOlxuICAgICAgICAgICAgYmFja2dyb3VuZCA9IDI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIndvb2RcIjpcbiAgICAgICAgICAgIGJhY2tncm91bmQgPSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGdyaWRDb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnLi4vaW1hZ2VzL0JhY2tncm91bmRUZXJyYWluJHtiYWNrZ3JvdW5kfS5qcGdgO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJydXNoID0gYnJ1c2g7XG5mdW5jdGlvbiBicnVzaChicnVzaFR5cGUsIHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIHN3aXRjaCAoYnJ1c2hUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJjcm9zc1wiOlxuICAgICAgICAgICAgYnJ1c2hDcm9zcyhzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib3hcIjpcbiAgICAgICAgICAgIGJydXNoQm94KHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgY2FzZSBcInBvaW50XCI6XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5mdW5jdGlvbiBicnVzaENyb3NzKHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHNxdWFyZXNBcnJheS5pbmRleE9mKGUpO1xuICAgIC8vIFVwL0Rvd24uXG4gICAgY29uc3QgYWJvdmVJbmRleCA9IGN1cnJlbnRJbmRleCAtIGNvbHM7XG4gICAgaWYgKGFib3ZlSW5kZXggPj0gMClcbiAgICAgICAgc3F1YXJlc1thYm92ZUluZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICBjb25zdCBiZWxvd0luZGV4ID0gY3VycmVudEluZGV4ICsgY29scztcbiAgICBpZiAoYmVsb3dJbmRleCA8IHNxdWFyZXMubGVuZ3RoKVxuICAgICAgICBzcXVhcmVzW2JlbG93SW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIC8vIExlZnQvUmlnaHQuXG4gICAgY29uc3QgYmVmb3JlSW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuICAgIGlmIChiZWZvcmVJbmRleCA+PSAwICYmIGJlZm9yZUluZGV4ICUgY29scyAhPT0gKGNvbHMgLSAxKSlcbiAgICAgICAgc3F1YXJlc1tiZWZvcmVJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgY29uc3QgYWZ0ZXJJbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XG4gICAgaWYgKGFmdGVySW5kZXggPCBzcXVhcmVzLmxlbmd0aCAmJiBhZnRlckluZGV4ICUgY29scyAhPT0gMClcbiAgICAgICAgc3F1YXJlc1thZnRlckluZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAvLyBjb25zb2xlLmxvZygnYmVmb3JlSW5kZXg6ICcsIGJlZm9yZUluZGV4LCAnYWZ0ZXJJbmRleDonLCBhZnRlckluZGV4LCAnTW9kOiAnLCBiZWZvcmVJbmRleCAlIGNvbHMsIChjb2xzLTEpKTtcbn1cbmZ1bmN0aW9uIGJydXNoQm94KHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHNxdWFyZXNBcnJheS5pbmRleE9mKGUpO1xuICAgIC8vIFVwL0Rvd24uXG4gICAgY29uc3QgYWJvdmVJbmRleCA9IGN1cnJlbnRJbmRleCAtIGNvbHM7XG4gICAgaWYgKGFib3ZlSW5kZXggLSAxID49IDApIHtcbiAgICAgICAgc3F1YXJlc1thYm92ZUluZGV4IC0gMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIHNxdWFyZXNbYWJvdmVJbmRleCArIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBjb25zdCBiZWxvd0luZGV4ID0gY3VycmVudEluZGV4ICsgY29scztcbiAgICBpZiAoYmVsb3dJbmRleCArIDEgPCBzcXVhcmVzLmxlbmd0aCkge1xuICAgICAgICBzcXVhcmVzW2JlbG93SW5kZXggLSAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgc3F1YXJlc1tiZWxvd0luZGV4ICsgMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGJydXNoQ3Jvc3Moc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVHcmlkID0gY3JlYXRlR3JpZDtcbmV4cG9ydHMuYWRkU3F1YXJlTGlzdGVuZXJzID0gYWRkU3F1YXJlTGlzdGVuZXJzO1xuY29uc3QgQnJ1c2hfMSA9IHJlcXVpcmUoXCIuL0JydXNoXCIpO1xuY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLWNvbnRhaW5lcicpO1xubGV0IGlzTW91c2VEb3duID0gZmFsc2U7XG5sZXQgc3RhcnRTcXVhcmUgPSBudWxsO1xubGV0IHNlbGVjdGVkU3F1YXJlcyA9IG5ldyBTZXQoKTsgLy8gVXNpYW1vIHVuIFNldCBwZXIgZXZpdGFyZSBkdXBsaWNhdGlcbmxldCBpc0RyYWdnaW5nUmlnaHRDbGljayA9IGZhbHNlO1xuLy8gRnVuemlvbmUgcGVyIGNyZWFyZSBsYSBncmlnbGlhIGNvbiBhbm5vdGF6aW9uaSBkaSB0aXBvXG5mdW5jdGlvbiBjcmVhdGVHcmlkKHJvd3MsIGNvbHMsIGJydXNoVHlwZSkge1xuICAgIC8vIFB1bGlzY2UgaWwgY29udGVudXRvIHByZWNlZGVudGUgZGVsIGNvbnRlbml0b3JlXG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAvLyBJbXBvc3RhIGkgdGVtcGxhdGUgcGVyIGxlIHJpZ2hlIGUgbGUgY29sb25uZSBkZWxsYSBncmlnbGlhIENTU1xuICAgIGdyaWRDb250YWluZXIuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtyb3dzfSwgMWZyKWA7XG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke2NvbHN9LCAxZnIpYDtcbiAgICAvLyBDYWxjb2xhIGxhIGxhcmdoZXp6YSBkZWwgY29udGVuaXRvcmUgaW4gYmFzZSBhbCBudW1lcm8gZGkgY29sb25uZSBlIGFsbGEgZGltZW5zaW9uZSBkZWkgcXVhZHJhdGkgKyBib3JkaVxuICAgIGdyaWRDb250YWluZXIuc3R5bGUud2lkdGggPSBgJHtjb2xzICogNTIgLSAxfXB4YDsgLy8gQXNzdW1lbmRvIGNoZSBvZ25pIHF1YWRyYXRvIHNpYSA1MHB4ICsgMnB4IGRpIGJvcmRvIHRvdGFsZVxuICAgIC8vIENyZWEgaSBzaW5nb2xpIHF1YWRyYXRpIGRlbGxhIGdyaWdsaWFcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3MgKiBjb2xzOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdncmlkLXNxdWFyZScpO1xuICAgICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgfVxuICAgIC8vIEFjdGl2ZSBldmVyeSBzcXVhcmUgc2VsZWN0ZWQuXG4gICAgYWRkU3F1YXJlTGlzdGVuZXJzKGJydXNoVHlwZSwgY29scyk7XG4gICAgZ3JpZENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChlKSA9PiBlLnByZXZlbnREZWZhdWx0KCkpO1xuICAgIC8vIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4gc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSkpO1xufVxuLy8gRnVuemlvbmUgcGVyIGFnZ2l1bmdlcmUgbGlzdGVuZXIgYWkgcXVhZHJhdGlcbmZ1bmN0aW9uIGFkZFNxdWFyZUxpc3RlbmVycyhicnVzaFR5cGUsIGNvbHMpIHtcbiAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlJyk7XG4gICAgY29uc3Qgc3F1YXJlc0FycmF5ID0gQXJyYXkuZnJvbShzcXVhcmVzKTtcbiAgICBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHtcbiAgICAgICAgY29uc3Qgc3F1YXJlTGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaWYgKGUuYnV0dG9uID09PSAyKSB7IC8vIDAgw6ggc2luaXN0cm8sIDEgw6ggY2VudHJhbGUsIDIgw6ggZGVzdHJvXG4gICAgICAgICAgICAgICAgaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICgwLCBCcnVzaF8xLmJydXNoKShicnVzaFR5cGUsIHNxdWFyZXNBcnJheSwgZS50YXJnZXQsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgLy8gU2VsZXppb25hIGlsIHByaW1vIHF1YWRyYXRvXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydFNxdWFyZSA9IHNxdWFyZTtcbiAgICAgICAgICAgIGlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGVjdGVkU3F1YXJlcy5jbGVhcigpOyAvLyBQdWxpc2NlIGxlIHNlbGV6aW9uaSBwcmVjZWRlbnRpXG4gICAgICAgICAgICBzZWxlY3RlZFNxdWFyZXMuYWRkKHNxdWFyZSk7XG4gICAgICAgIH07XG4gICAgICAgIHNxdWFyZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzcXVhcmVMaXN0ZW5lcik7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzcXVhcmVMaXN0ZW5lcik7XG4gICAgICAgIGNvbnN0IHNxdWFyZU92ZXJMaXN0ZW5lciA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlzTW91c2VEb3duIHx8ICFzdGFydFNxdWFyZSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U3F1YXJlID0gZS50YXJnZXQ7XG4gICAgICAgICAgICBpZiAoY3VycmVudFNxdWFyZS5jbGFzc0xpc3QuY29udGFpbnMoJ2dyaWQtc3F1YXJlJykgJiYgIXNlbGVjdGVkU3F1YXJlcy5oYXMoY3VycmVudFNxdWFyZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNEcmFnZ2luZ1JpZ2h0Q2xpY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnLCAnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICgwLCBCcnVzaF8xLmJydXNoKShicnVzaFR5cGUsIHNxdWFyZXNBcnJheSwgZS50YXJnZXQsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxlY3RlZFNxdWFyZXMuYWRkKGN1cnJlbnRTcXVhcmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzcXVhcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgc3F1YXJlT3Zlckxpc3RlbmVyKTtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHNxdWFyZU92ZXJMaXN0ZW5lcik7XG4gICAgfSk7XG4gICAgLy8gTGlzdGVuZXIgZ2xvYmFsZSBwZXIgJ21vdXNldXAnIHBlciBmZXJtYXJlIGlsIHRyYWNjaWFtZW50b1xuICAgIGNvbnN0IHNxdWFyZVVwTGlzdGVuZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGlzRHJhZ2dpbmdSaWdodENsaWNrIHx8IGlzTW91c2VEb3duKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIGlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgICAgICBzdGFydFNxdWFyZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzcXVhcmVVcExpc3RlbmVyKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgc3F1YXJlVXBMaXN0ZW5lcik7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2F2ZU1hcFRvTG9jYWxTdG9yYWdlID0gc2F2ZU1hcFRvTG9jYWxTdG9yYWdlO1xuZXhwb3J0cy5sb2FkTWFwRnJvbUxvY2FsU3RvcmFnZSA9IGxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlO1xuLy8gRmlsdGVyIG1hcCBuYW1lIGZvciB0ZWNobmljYWwgSUQuXG5jb25zdCBtYXBOYW1lRm4gPSAobWFwTmFtZSkgPT4gbWFwTmFtZS5yZXBsYWNlQWxsKCcgJywgJycpO1xuLy8gQXNzdW1lbmRvIGNoZSAnZ3JpZENvbnRhaW5lcicgc2lhIGlsIGNvbnRlbml0b3JlIGRlbGxhIHR1YSBncmlnbGlhXG5mdW5jdGlvbiBzYXZlTWFwVG9Mb2NhbFN0b3JhZ2UoZ3JpZENvbnRhaW5lciwgbWFwTmFtZSkge1xuICAgIGNvbnN0IHNxdWFyZXMgPSBBcnJheS5mcm9tKGdyaWRDb250YWluZXIuY2hpbGRyZW4pO1xuICAgIGNvbnN0IG1hcERhdGEgPSBzcXVhcmVzLm1hcChzcXVhcmUgPT4gKHtcbiAgICAgICAgczogc3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcbiAgICB9KSk7XG4gICAgY29uc3QgbWFwTmFtZUZpbHRlcmVkID0gbWFwTmFtZUZuKG1hcE5hbWUpO1xuICAgIC8vIEFkZCBvcHRpb24gdG8gc2F2ZWQgbWFwcy5cbiAgICBjb25zdCBtYXBOYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtbmFtZXMnKTtcbiAgICBjb25zdCBuZXdPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBuZXdPcHRpb24udmFsdWUgPSBtYXBOYW1lRmlsdGVyZWQ7IC8vIElsIHZhbG9yZSBlZmZldHRpdm8gZGVsbCdvcHppb25lXG4gICAgbmV3T3B0aW9uLnRleHRDb250ZW50ID0gbWFwTmFtZTsgLy8gSWwgdGVzdG8gdmlzaWJpbGUgYWxsJ3V0ZW50ZVxuICAgIG1hcE5hbWVzLmFwcGVuZENoaWxkKG5ld09wdGlvbik7XG4gICAgLy8gU2VyaWFsaXp6YSBpIGRhdGkgaW4gdW5hIHN0cmluZ2EgSlNPTlxuICAgIGNvbnN0IHNlcmlhbGl6ZWRNYXAgPSBKU09OLnN0cmluZ2lmeShtYXBEYXRhKTtcbiAgICAvLyBTYWx2YSBsYSBzdHJpbmdhIG5lbCBMb2NhbFN0b3JhZ2UgY29uIHVuYSBjaGlhdmVcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRNYXBfJyArIG1hcE5hbWVGaWx0ZXJlZCwgc2VyaWFsaXplZE1hcCk7XG4gICAgY29uc29sZS5sb2coJ01hcHBhIHNhbHZhdGEgY29uIHN1Y2Nlc3NvLicpO1xufVxuZnVuY3Rpb24gbG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2UoZ3JpZENvbnRhaW5lciwgbWFwTmFtZSkge1xuICAgIC8vIFJlY3VwZXJhIGxhIHN0cmluZ2Egc2VyaWFsaXp6YXRhXG4gICAgY29uc3Qgc2VyaWFsaXplZE1hcCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlZE1hcF8nICsgbWFwTmFtZUZuKG1hcE5hbWUpKTtcbiAgICBpZiAoc2VyaWFsaXplZE1hcCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gRGVzZXJpYWxpenphIGxhIHN0cmluZ2EgaW4gdW4gYXJyYXkgZGkgb2dnZXR0aVxuICAgICAgICAgICAgY29uc3QgbWFwRGF0YSA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZE1hcCk7XG4gICAgICAgICAgICBjb25zdCBzcXVhcmVzID0gQXJyYXkuZnJvbShncmlkQ29udGFpbmVyLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIC8vIEFzc2ljdXJhdGkgY2hlIGxlIGRpbWVuc2lvbmkgZGVsbGEgZ3JpZ2xpYSBjb3JyaXNwb25kYW5vIGFpIGRhdGkgc2FsdmF0aVxuICAgICAgICAgICAgaWYgKG1hcERhdGEubGVuZ3RoID09PSBzcXVhcmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIEFwcGxpY2EgbG8gc3RhdG8gc2FsdmF0byBhIG9nbmkgcXVhZHJhdG8gZGVsbGEgZ3JpZ2xpYVxuICAgICAgICAgICAgICAgIG1hcERhdGEuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3F1YXJlc1tpbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcXVhcmVzW2luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNYXBwYSBjYXJpY2F0YSBjb24gc3VjY2Vzc28uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0xlIGRpbWVuc2lvbmkgZGVsbGEgZ3JpZ2xpYSBub24gY29ycmlzcG9uZG9ubyBhaSBkYXRpIHNhbHZhdGkuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yZSBkdXJhbnRlIGxhIGRlc2VyaWFsaXp6YXppb25lIGRlaSBkYXRpLicsIGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnTmVzc3VuYSBtYXBwYSBzYWx2YXRhIHRyb3ZhdGEuJyk7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSByYW5kb21pemVTcXVhcmU7XG4vLyBGdW56aW9uZSBwZXIgcmFuZG9taXp6YXJlIHVuIHF1YWRyYXRvIGNvbiBhbm5vdGF6aW9uaSBkaSB0aXBvXG5mdW5jdGlvbiByYW5kb21pemVTcXVhcmUoKSB7XG4gICAgLy8gU2VsZXppb25hIHR1dHRpIGdsaSBlbGVtZW50aSBjb24gbGEgY2xhc3NlICdncmlkLXNxdWFyZSdcbiAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlLmFjdGl2ZScpO1xuICAgIC8vIFZlcmlmaWNhIHNlIGNpIHNvbm8gcXVhZHJhdGkgbmVsbGEgZ3JpZ2xpYVxuICAgIGlmIChzcXVhcmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBhbGVydCgnUGVyIGZhdm9yZSwgY3JlYSBwcmltYSB1bmEgZ3JpZ2xpYSEnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBSaW11b3ZlIGxhIGNsYXNzZSAnc2VsZWN0ZWQnIGRhIHR1dHRpIGkgcXVhZHJhdGkgcGVyIGRlc2VsZXppb25hcmUgcXVlbGxvIHByZWNlZGVudGVtZW50ZSBldmlkZW56aWF0b1xuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4gc3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJykpO1xuICAgIC8vIENhbGNvbGEgdW4gaW5kaWNlIGNhc3VhbGUgYWxsJ2ludGVybm8gZGVsbCdhcnJheSBkaSBxdWFkcmF0aVxuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc3F1YXJlcy5sZW5ndGgpO1xuICAgIC8vIEFnZ2l1bmdlIGxhIGNsYXNzZSAnc2VsZWN0ZWQnIGFsIHF1YWRyYXRvIHNjZWx0byBjYXN1YWxtZW50ZVxuICAgIHNxdWFyZXNbcmFuZG9tSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHJhbmRvbWl6ZVNxdWFyZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9yYW5kb21pemVTcXVhcmVcIikpO1xuY29uc3QgR3JpZF8xID0gcmVxdWlyZShcIi4vZnVuY3Rpb25zL0dyaWRcIik7XG5jb25zdCBTYXZlXzEgPSByZXF1aXJlKFwiLi9mdW5jdGlvbnMvU2F2ZVwiKTtcbmNvbnN0IEJhY2tncm91bmRfMSA9IHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9CYWNrZ3JvdW5kXCIpO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICBsZXQgYnJ1c2hUeXBlID0gJ2Nyb3NzJztcbiAgICBsZXQgZ3JpZENvbHMgPSAxNTtcbiAgICBsZXQgZ3JpZFJvd3MgPSAxNTtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtY29udGFpbmVyJyk7XG4gICAgLy8gQWN0aXZlIGV2ZXJ5IHNxdWFyZSBzZWxlY3RlZC5cbiAgICBjb25zdCBjcmVhdGVHcmlkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZS1ncmlkLWJ0bicpO1xuICAgIGNyZWF0ZUdyaWRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGdyaWRSb3dzID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtcmFuZ2Utcm93cycpLnZhbHVlKTtcbiAgICAgICAgZ3JpZENvbHMgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1yYW5nZScpLnZhbHVlKTtcbiAgICAgICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsZWFyLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAoMCwgR3JpZF8xLmNyZWF0ZUdyaWQpKGdyaWRSb3dzLCBncmlkQ29scywgYnJ1c2hUeXBlKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1yYW5nZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIGdyaWRDb2xzID0gcGFyc2VJbnQoKGU/LnRhcmdldCkudmFsdWUpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1sYWJlbCcpLmlubmVyVGV4dCA9IGdyaWRDb2xzICsgJ3gnICsgZ3JpZFJvd3M7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhbmRvbWl6ZS1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJhbmRvbWl6ZVNxdWFyZV8xLmRlZmF1bHQpO1xuICAgIC8vIENoaWFtYSBsYSBmdW56aW9uZSBkaSByYW5kb21penphemlvbmUgYWwgY2xpY2sgZGVsIHB1bHNhbnRlLlxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXZlLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXBOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1uYW1lJykudmFsdWU7XG4gICAgICAgICgwLCBTYXZlXzEuc2F2ZU1hcFRvTG9jYWxTdG9yYWdlKShncmlkQ29udGFpbmVyLCBtYXBOYW1lKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZC1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFwTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtbmFtZXMnKS52YWx1ZTtcbiAgICAgICAgKDAsIFNhdmVfMS5sb2FkTWFwRnJvbUxvY2FsU3RvcmFnZSkoZ3JpZENvbnRhaW5lciwgbWFwTmFtZSk7XG4gICAgfSk7XG4gICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJicnVzaC1vcHRpb25zXCJdJykpLmZvckVhY2gocmFkaW8gPT4ge1xuICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBicnVzaFR5cGUgPSAoZT8udGFyZ2V0KS52YWx1ZTtcbiAgICAgICAgICAgICgwLCBHcmlkXzEuYWRkU3F1YXJlTGlzdGVuZXJzKShicnVzaFR5cGUsIGdyaWRDb2xzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJiYWNrLW9wdGlvbnNcIl0nKSkuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+ICgwLCBCYWNrZ3JvdW5kXzEuYmFjaykoZ3JpZENvbnRhaW5lciwgKGU/LnRhcmdldCkudmFsdWUpKTtcbiAgICB9KTtcbiAgICAvLyBDcmVhIHVuYSBncmlnbGlhIGRpIGRpbWVuc2lvbmkgcHJlZGVmaW5pdGUgYWxsJ2F2dmlvIGRlbGxhIHBhZ2luYVxuICAgICgwLCBHcmlkXzEuY3JlYXRlR3JpZCkoZ3JpZFJvd3MsIGdyaWRDb2xzLCBicnVzaFR5cGUpO1xufSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=