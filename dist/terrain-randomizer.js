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
exports.getSavedMapNames = getSavedMapNames;
exports.removeMapFromLocalStorage = removeMapFromLocalStorage;
// Filter map name for technical ID.
const mapNameFn = (mapName) => mapName.replaceAll(' ', '');
function saveMapToLocalStorage(gridContainer, mapName, gridRows, gridCols) {
    const squares = Array.from(gridContainer.children);
    const mapData = {
        rows: gridRows,
        cols: gridCols,
        squares: squares.map(square => ({
            s: square.classList.contains('active')
        }))
    };
    const mapNameFiltered = mapNameFn(mapName);
    // Add option to saved maps.
    const mapNames = document.getElementById('map-names');
    const newOption = document.createElement('option');
    newOption.value = mapNameFiltered; // Il valore effettivo dell'opzione
    newOption.textContent = mapName; // Il testo visibile all'utente
    mapNames.appendChild(newOption);
    // Save the map data under a unique key
    localStorage.setItem(`savedMap_${mapNameFiltered}`, JSON.stringify(mapData));
    // Get and update the list of saved map names
    let mapNamesArray = [];
    const savedNames = localStorage.getItem('mapNames');
    if (savedNames) {
        mapNamesArray = JSON.parse(savedNames);
    }
    // Add the new map name if it doesn't exist
    if (!mapNamesArray.includes(mapName)) {
        mapNamesArray.push(mapName);
        localStorage.setItem('mapNames', JSON.stringify(mapNamesArray));
    }
    console.log(`Map "${mapName}" saved successfully.`);
}
function loadMapFromLocalStorage(mapName) {
    const mapNameFiltered = mapNameFn(mapName);
    const serializedMap = localStorage.getItem(`savedMap_${mapNameFiltered}`);
    if (serializedMap) {
        try {
            const mapData = JSON.parse(serializedMap);
            console.log(`Map "${mapName}" loaded successfully.`);
            return mapData;
        }
        catch (e) {
            console.error('Error deserializing data.', e);
            return null;
        }
    }
    else {
        console.log('No saved map found with that name.');
        return null;
    }
}
// function loadMapFromLocalStorage(gridContainer: HTMLElement, mapName: string): void {
//   // Recupera la stringa serializzata
//   const serializedMap = localStorage.getItem('savedMap_' + mapNameFn(mapName));
//
//   if (serializedMap) {
//     try {
//       // Deserializza la stringa in un array di oggetti
//       const mapData: SquareState[] = JSON.parse(serializedMap);
//       const squares = Array.from(gridContainer.children) as HTMLElement[];
//
//       // Assicurati che le dimensioni della griglia corrispondano ai dati salvati
//       if (mapData.length === squares.length) {
//         // Applica lo stato salvato a ogni quadrato della griglia
//         mapData.forEach((data, index) => {
//           if (data.s) {
//             squares[index].classList.add('active');
//           } else {
//             squares[index].classList.remove('active');
//           }
//         });
//         console.log('Mappa caricata con successo.');
//       } else {
//         console.warn('Le dimensioni della griglia non corrispondono ai dati salvati.');
//       }
//     } catch (e) {
//       console.error('Errore durante la deserializzazione dei dati.', e);
//     }
//   } else {
//     console.log('Nessuna mappa salvata trovata.');
//   }
// }
function getSavedMapNames() {
    const savedNames = localStorage.getItem('mapNames');
    let savedNamesArray = [];
    if (savedNames) {
        try {
            savedNamesArray = JSON.parse(savedNames);
        }
        catch (e) {
            console.error('Error reading saved map names list.', e);
        }
        const mapNamesSelect = document.getElementById('map-names');
        savedNamesArray.forEach((mapName) => {
            const newOption = document.createElement('option');
            newOption.value = mapNameFn(mapName); // Il valore effettivo dell'opzione
            newOption.textContent = mapName; // Il testo visibile all'utente
            mapNamesSelect.appendChild(newOption);
        });
    }
}
function removeMapFromLocalStorage(mapName) {
    const mapNameFiltered = mapNameFn(mapName);
    // Remove the map data itself
    localStorage.removeItem(`savedMap_${mapNameFiltered}`);
    // Get and update the list of saved map names
    let mapNames = [];
    const savedNames = localStorage.getItem('mapNames');
    if (savedNames) {
        mapNames = JSON.parse(savedNames);
    }
    // Filter out the name to be removed
    const updatedMapNames = mapNames.filter(name => name !== mapName);
    localStorage.setItem('mapNames', JSON.stringify(updatedMapNames));
    // Get the select element
    const mapNamesSelect = document.getElementById('map-names');
    // Filter map name for technical ID (the option's value)
    if (mapNamesSelect) {
        // Iterate over all options in the select element
        for (let i = 0; i < mapNamesSelect.options.length; i++) {
            const option = mapNamesSelect.options[i];
            // Check if the option's value matches the filtered map name
            if (option.value === mapName) {
                // Remove the option at the found index
                mapNamesSelect.remove(i);
                console.log(`Option for map "${mapName}" removed from select.`);
                // Break the loop once the option is removed
                break;
            }
        }
    }
    else {
        console.warn('Select element with ID "map-names" not found.');
    }
    console.log(`Map "${mapName}" removed successfully.`);
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
    (0, Save_1.getSavedMapNames)();
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
        (0, Save_1.saveMapToLocalStorage)(gridContainer, mapName, gridRows, gridCols);
    });
    document.getElementById('load-btn').addEventListener('click', () => {
        const mapName = document.getElementById('map-names').value;
        const mapData = (0, Save_1.loadMapFromLocalStorage)(mapName);
        gridRows = mapData?.rows ?? gridRows;
        gridCols = mapData?.cols ?? gridCols;
        (0, Grid_1.createGrid)(gridRows, gridCols, brushType);
        // Applica lo stato salvato a ogni quadrato della griglia
        const squares = Array.from(gridContainer.children);
        mapData?.squares?.forEach((data, index) => {
            if (data.s) {
                squares[index].classList.add('active');
            }
            else {
                squares[index].classList.remove('active');
            }
        });
    });
    document.getElementById('delete-save-btn').addEventListener('click', () => {
        const mapName = document.getElementById('map-names').value;
        (0, Save_1.removeMapFromLocalStorage)(mapName);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7O1VDNUVEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL0JhY2tncm91bmQudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9CcnVzaC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL0dyaWQudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9TYXZlLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvcmFuZG9taXplU3F1YXJlLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5iYWNrID0gYmFjaztcbmZ1bmN0aW9uIGJhY2soZ3JpZENvbnRhaW5lciwgYmFja1R5cGUpIHtcbiAgICBsZXQgYmFja2dyb3VuZCA9IDE7XG4gICAgc3dpdGNoIChiYWNrVHlwZSkge1xuICAgICAgICBjYXNlIFwicm9ja1wiOlxuICAgICAgICAgICAgYmFja2dyb3VuZCA9IDI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIndvb2RcIjpcbiAgICAgICAgICAgIGJhY2tncm91bmQgPSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGdyaWRDb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnLi9pbWFnZXMvQmFja2dyb3VuZFRlcnJhaW4ke2JhY2tncm91bmR9LmpwZ2A7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnJ1c2ggPSBicnVzaDtcbmZ1bmN0aW9uIGJydXNoKGJydXNoVHlwZSwgc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgc3dpdGNoIChicnVzaFR5cGUpIHtcbiAgICAgICAgY2FzZSBcImNyb3NzXCI6XG4gICAgICAgICAgICBicnVzaENyb3NzKHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJveFwiOlxuICAgICAgICAgICAgYnJ1c2hCb3goc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICBjYXNlIFwicG9pbnRcIjpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGJydXNoQ3Jvc3Moc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gc3F1YXJlc0FycmF5LmluZGV4T2YoZSk7XG4gICAgLy8gVXAvRG93bi5cbiAgICBjb25zdCBhYm92ZUluZGV4ID0gY3VycmVudEluZGV4IC0gY29scztcbiAgICBpZiAoYWJvdmVJbmRleCA+PSAwKVxuICAgICAgICBzcXVhcmVzW2Fib3ZlSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIGNvbnN0IGJlbG93SW5kZXggPSBjdXJyZW50SW5kZXggKyBjb2xzO1xuICAgIGlmIChiZWxvd0luZGV4IDwgc3F1YXJlcy5sZW5ndGgpXG4gICAgICAgIHNxdWFyZXNbYmVsb3dJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgLy8gTGVmdC9SaWdodC5cbiAgICBjb25zdCBiZWZvcmVJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XG4gICAgaWYgKGJlZm9yZUluZGV4ID49IDAgJiYgYmVmb3JlSW5kZXggJSBjb2xzICE9PSAoY29scyAtIDEpKVxuICAgICAgICBzcXVhcmVzW2JlZm9yZUluZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICBjb25zdCBhZnRlckluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcbiAgICBpZiAoYWZ0ZXJJbmRleCA8IHNxdWFyZXMubGVuZ3RoICYmIGFmdGVySW5kZXggJSBjb2xzICE9PSAwKVxuICAgICAgICBzcXVhcmVzW2FmdGVySW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdiZWZvcmVJbmRleDogJywgYmVmb3JlSW5kZXgsICdhZnRlckluZGV4OicsIGFmdGVySW5kZXgsICdNb2Q6ICcsIGJlZm9yZUluZGV4ICUgY29scywgKGNvbHMtMSkpO1xufVxuZnVuY3Rpb24gYnJ1c2hCb3goc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKSB7XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gc3F1YXJlc0FycmF5LmluZGV4T2YoZSk7XG4gICAgLy8gVXAvRG93bi5cbiAgICBjb25zdCBhYm92ZUluZGV4ID0gY3VycmVudEluZGV4IC0gY29scztcbiAgICBpZiAoYWJvdmVJbmRleCAtIDEgPj0gMCkge1xuICAgICAgICBzcXVhcmVzW2Fib3ZlSW5kZXggLSAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgc3F1YXJlc1thYm92ZUluZGV4ICsgMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGNvbnN0IGJlbG93SW5kZXggPSBjdXJyZW50SW5kZXggKyBjb2xzO1xuICAgIGlmIChiZWxvd0luZGV4ICsgMSA8IHNxdWFyZXMubGVuZ3RoKSB7XG4gICAgICAgIHNxdWFyZXNbYmVsb3dJbmRleCAtIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICBzcXVhcmVzW2JlbG93SW5kZXggKyAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgYnJ1c2hDcm9zcyhzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZUdyaWQgPSBjcmVhdGVHcmlkO1xuZXhwb3J0cy5hZGRTcXVhcmVMaXN0ZW5lcnMgPSBhZGRTcXVhcmVMaXN0ZW5lcnM7XG5jb25zdCBCcnVzaF8xID0gcmVxdWlyZShcIi4vQnJ1c2hcIik7XG5jb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtY29udGFpbmVyJyk7XG4vLyBsZXQgaXNNb3VzZURvd24gPSBmYWxzZTtcbi8vIGxldCBzdGFydFNxdWFyZTogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbi8vIGxldCBzZWxlY3RlZFNxdWFyZXM6IFNldDxIVE1MRWxlbWVudD4gPSBuZXcgU2V0KCk7IC8vIFVzaWFtbyB1biBTZXQgcGVyIGV2aXRhcmUgZHVwbGljYXRpXG4vLyBsZXQgaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgPSBmYWxzZTtcbi8vIEZ1bnppb25lIHBlciBjcmVhcmUgbGEgZ3JpZ2xpYSBjb24gYW5ub3RhemlvbmkgZGkgdGlwb1xuZnVuY3Rpb24gY3JlYXRlR3JpZChyb3dzLCBjb2xzLCBicnVzaFR5cGUpIHtcbiAgICAvLyBQdWxpc2NlIGlsIGNvbnRlbnV0byBwcmVjZWRlbnRlIGRlbCBjb250ZW5pdG9yZVxuICAgIGdyaWRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgLy8gSW1wb3N0YSBpIHRlbXBsYXRlIHBlciBsZSByaWdoZSBlIGxlIGNvbG9ubmUgZGVsbGEgZ3JpZ2xpYSBDU1NcbiAgICBncmlkQ29udGFpbmVyLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KCR7cm93c30sIDFmcilgO1xuICAgIGdyaWRDb250YWluZXIuc3R5bGUuZ3JpZFRlbXBsYXRlQ29sdW1ucyA9IGByZXBlYXQoJHtjb2xzfSwgMWZyKWA7XG4gICAgLy8gQ2FsY29sYSBsYSBsYXJnaGV6emEgZGVsIGNvbnRlbml0b3JlIGluIGJhc2UgYWwgbnVtZXJvIGRpIGNvbG9ubmUgZSBhbGxhIGRpbWVuc2lvbmUgZGVpIHF1YWRyYXRpICsgYm9yZGlcbiAgICBncmlkQ29udGFpbmVyLnN0eWxlLndpZHRoID0gYCR7Y29scyAqIDUyIC0gMX1weGA7IC8vIEFzc3VtZW5kbyBjaGUgb2duaSBxdWFkcmF0byBzaWEgNTBweCArIDJweCBkaSBib3JkbyB0b3RhbGVcbiAgICAvLyBDcmVhIGkgc2luZ29saSBxdWFkcmF0aSBkZWxsYSBncmlnbGlhXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzICogY29sczsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgIH1cbiAgICAvLyBBY3RpdmUgZXZlcnkgc3F1YXJlIHNlbGVjdGVkLlxuICAgIGFkZFNxdWFyZUxpc3RlbmVycyhicnVzaFR5cGUsIGNvbHMpO1xuICAgIC8vIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4gc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSkpO1xufVxubGV0IGlzTW91c2VEb3duID0gZmFsc2U7XG5sZXQgc3RhcnRTcXVhcmUgPSBudWxsO1xubGV0IHNlbGVjdGVkU3F1YXJlcyA9IG5ldyBTZXQoKTtcbmxldCBpc0RyYWdnaW5nUmlnaHRDbGljayA9IGZhbHNlO1xuLy8gVmFyaWFiaWxpIGdsb2JhbGkgcGVyIG1lbW9yaXp6YXJlIGkgcmlmZXJpbWVudGkgYWkgbGlzdGVuZXJcbmxldCBzcXVhcmVMaXN0ZW5lclJlZiA9IG51bGw7XG5sZXQgc3F1YXJlT3Zlckxpc3RlbmVyUmVmID0gbnVsbDtcbmxldCBzcXVhcmVVcExpc3RlbmVyUmVmID0gbnVsbDtcbi8vIEZ1bnppb25lIHBlciByaW11b3ZlcmUgdHV0dGkgaSB2ZWNjaGkgbGlzdGVuZXJcbmZ1bmN0aW9uIHJlbW92ZU9sZExpc3RlbmVycygpIHtcbiAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlJyk7XG4gICAgc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiB7XG4gICAgICAgIGlmIChzcXVhcmVMaXN0ZW5lclJlZikge1xuICAgICAgICAgICAgc3F1YXJlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNxdWFyZUxpc3RlbmVyUmVmKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3F1YXJlT3Zlckxpc3RlbmVyUmVmKSB7XG4gICAgICAgICAgICBzcXVhcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgc3F1YXJlT3Zlckxpc3RlbmVyUmVmKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChzcXVhcmVVcExpc3RlbmVyUmVmKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzcXVhcmVVcExpc3RlbmVyUmVmKTtcbiAgICB9XG59XG4vLyBGdW56aW9uZSBwcmluY2lwYWxlIHBlciBhZ2dpdW5nZXJlIG51b3ZpIGxpc3RlbmVyXG5mdW5jdGlvbiBhZGRTcXVhcmVMaXN0ZW5lcnMoYnJ1c2hUeXBlLCBjb2xzKSB7XG4gICAgLy8gUmltdW92ZSBpIHZlY2NoaSBsaXN0ZW5lciBwcmltYSBkaSBhcHBsaWNhcmUgaSBudW92aVxuICAgIHJlbW92ZU9sZExpc3RlbmVycygpO1xuICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcbiAgICBjb25zdCBzcXVhcmVzQXJyYXkgPSBBcnJheS5mcm9tKHNxdWFyZXMpO1xuICAgIC8vIERpY2hpYXJhemlvbmUgZGVpIGxpc3RlbmVyIGNvbiB1biBub21lLCBpbiBtb2RvIGNoZSBwb3NzYW5vIGVzc2VyZSByaW1vc3NpXG4gICAgc3F1YXJlTGlzdGVuZXJSZWYgPSAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChlLmJ1dHRvbiA9PT0gMikge1xuICAgICAgICAgICAgaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgPSB0cnVlO1xuICAgICAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAoMCwgQnJ1c2hfMS5icnVzaCkoYnJ1c2hUeXBlLCBzcXVhcmVzQXJyYXksIGUudGFyZ2V0LCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgIHN0YXJ0U3F1YXJlID0gZS50YXJnZXQ7XG4gICAgICAgIGlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgc2VsZWN0ZWRTcXVhcmVzLmNsZWFyKCk7XG4gICAgICAgIHNlbGVjdGVkU3F1YXJlcy5hZGQoZS50YXJnZXQpO1xuICAgIH07XG4gICAgc3F1YXJlT3Zlckxpc3RlbmVyUmVmID0gKGUpID0+IHtcbiAgICAgICAgaWYgKCFpc01vdXNlRG93biB8fCAhc3RhcnRTcXVhcmUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTcXVhcmUgPSBlLnRhcmdldDtcbiAgICAgICAgaWYgKGN1cnJlbnRTcXVhcmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdncmlkLXNxdWFyZScpICYmICFzZWxlY3RlZFNxdWFyZXMuaGFzKGN1cnJlbnRTcXVhcmUpKSB7XG4gICAgICAgICAgICBpZiAoaXNEcmFnZ2luZ1JpZ2h0Q2xpY2spIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50U3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScsICdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgKDAsIEJydXNoXzEuYnJ1c2gpKGJydXNoVHlwZSwgc3F1YXJlc0FycmF5LCBjdXJyZW50U3F1YXJlLCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50U3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZWN0ZWRTcXVhcmVzLmFkZChjdXJyZW50U3F1YXJlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdicnVzaFR5cGUgbGlzdGVuZXI6ICcsIGJydXNoVHlwZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHNxdWFyZVVwTGlzdGVuZXJSZWYgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGlzRHJhZ2dpbmdSaWdodENsaWNrIHx8IGlzTW91c2VEb3duKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIGlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgICAgICBzdGFydFNxdWFyZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8vIEFwcGxpY2F6aW9uZSBkZWkgbnVvdmkgbGlzdGVuZXJcbiAgICBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNxdWFyZUxpc3RlbmVyUmVmKTtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHNxdWFyZU92ZXJMaXN0ZW5lclJlZik7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHNxdWFyZVVwTGlzdGVuZXJSZWYpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNhdmVNYXBUb0xvY2FsU3RvcmFnZSA9IHNhdmVNYXBUb0xvY2FsU3RvcmFnZTtcbmV4cG9ydHMubG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2UgPSBsb2FkTWFwRnJvbUxvY2FsU3RvcmFnZTtcbmV4cG9ydHMuZ2V0U2F2ZWRNYXBOYW1lcyA9IGdldFNhdmVkTWFwTmFtZXM7XG5leHBvcnRzLnJlbW92ZU1hcEZyb21Mb2NhbFN0b3JhZ2UgPSByZW1vdmVNYXBGcm9tTG9jYWxTdG9yYWdlO1xuLy8gRmlsdGVyIG1hcCBuYW1lIGZvciB0ZWNobmljYWwgSUQuXG5jb25zdCBtYXBOYW1lRm4gPSAobWFwTmFtZSkgPT4gbWFwTmFtZS5yZXBsYWNlQWxsKCcgJywgJycpO1xuZnVuY3Rpb24gc2F2ZU1hcFRvTG9jYWxTdG9yYWdlKGdyaWRDb250YWluZXIsIG1hcE5hbWUsIGdyaWRSb3dzLCBncmlkQ29scykge1xuICAgIGNvbnN0IHNxdWFyZXMgPSBBcnJheS5mcm9tKGdyaWRDb250YWluZXIuY2hpbGRyZW4pO1xuICAgIGNvbnN0IG1hcERhdGEgPSB7XG4gICAgICAgIHJvd3M6IGdyaWRSb3dzLFxuICAgICAgICBjb2xzOiBncmlkQ29scyxcbiAgICAgICAgc3F1YXJlczogc3F1YXJlcy5tYXAoc3F1YXJlID0+ICh7XG4gICAgICAgICAgICBzOiBzcXVhcmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKVxuICAgICAgICB9KSlcbiAgICB9O1xuICAgIGNvbnN0IG1hcE5hbWVGaWx0ZXJlZCA9IG1hcE5hbWVGbihtYXBOYW1lKTtcbiAgICAvLyBBZGQgb3B0aW9uIHRvIHNhdmVkIG1hcHMuXG4gICAgY29uc3QgbWFwTmFtZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWVzJyk7XG4gICAgY29uc3QgbmV3T3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgbmV3T3B0aW9uLnZhbHVlID0gbWFwTmFtZUZpbHRlcmVkOyAvLyBJbCB2YWxvcmUgZWZmZXR0aXZvIGRlbGwnb3B6aW9uZVxuICAgIG5ld09wdGlvbi50ZXh0Q29udGVudCA9IG1hcE5hbWU7IC8vIElsIHRlc3RvIHZpc2liaWxlIGFsbCd1dGVudGVcbiAgICBtYXBOYW1lcy5hcHBlbmRDaGlsZChuZXdPcHRpb24pO1xuICAgIC8vIFNhdmUgdGhlIG1hcCBkYXRhIHVuZGVyIGEgdW5pcXVlIGtleVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGBzYXZlZE1hcF8ke21hcE5hbWVGaWx0ZXJlZH1gLCBKU09OLnN0cmluZ2lmeShtYXBEYXRhKSk7XG4gICAgLy8gR2V0IGFuZCB1cGRhdGUgdGhlIGxpc3Qgb2Ygc2F2ZWQgbWFwIG5hbWVzXG4gICAgbGV0IG1hcE5hbWVzQXJyYXkgPSBbXTtcbiAgICBjb25zdCBzYXZlZE5hbWVzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21hcE5hbWVzJyk7XG4gICAgaWYgKHNhdmVkTmFtZXMpIHtcbiAgICAgICAgbWFwTmFtZXNBcnJheSA9IEpTT04ucGFyc2Uoc2F2ZWROYW1lcyk7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgbmV3IG1hcCBuYW1lIGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICBpZiAoIW1hcE5hbWVzQXJyYXkuaW5jbHVkZXMobWFwTmFtZSkpIHtcbiAgICAgICAgbWFwTmFtZXNBcnJheS5wdXNoKG1hcE5hbWUpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbWFwTmFtZXMnLCBKU09OLnN0cmluZ2lmeShtYXBOYW1lc0FycmF5KSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBNYXAgXCIke21hcE5hbWV9XCIgc2F2ZWQgc3VjY2Vzc2Z1bGx5LmApO1xufVxuZnVuY3Rpb24gbG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2UobWFwTmFtZSkge1xuICAgIGNvbnN0IG1hcE5hbWVGaWx0ZXJlZCA9IG1hcE5hbWVGbihtYXBOYW1lKTtcbiAgICBjb25zdCBzZXJpYWxpemVkTWFwID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oYHNhdmVkTWFwXyR7bWFwTmFtZUZpbHRlcmVkfWApO1xuICAgIGlmIChzZXJpYWxpemVkTWFwKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBtYXBEYXRhID0gSlNPTi5wYXJzZShzZXJpYWxpemVkTWFwKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBNYXAgXCIke21hcE5hbWV9XCIgbG9hZGVkIHN1Y2Nlc3NmdWxseS5gKTtcbiAgICAgICAgICAgIHJldHVybiBtYXBEYXRhO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkZXNlcmlhbGl6aW5nIGRhdGEuJywgZSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ05vIHNhdmVkIG1hcCBmb3VuZCB3aXRoIHRoYXQgbmFtZS4nKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuLy8gZnVuY3Rpb24gbG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2UoZ3JpZENvbnRhaW5lcjogSFRNTEVsZW1lbnQsIG1hcE5hbWU6IHN0cmluZyk6IHZvaWQge1xuLy8gICAvLyBSZWN1cGVyYSBsYSBzdHJpbmdhIHNlcmlhbGl6emF0YVxuLy8gICBjb25zdCBzZXJpYWxpemVkTWFwID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NhdmVkTWFwXycgKyBtYXBOYW1lRm4obWFwTmFtZSkpO1xuLy9cbi8vICAgaWYgKHNlcmlhbGl6ZWRNYXApIHtcbi8vICAgICB0cnkge1xuLy8gICAgICAgLy8gRGVzZXJpYWxpenphIGxhIHN0cmluZ2EgaW4gdW4gYXJyYXkgZGkgb2dnZXR0aVxuLy8gICAgICAgY29uc3QgbWFwRGF0YTogU3F1YXJlU3RhdGVbXSA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZE1hcCk7XG4vLyAgICAgICBjb25zdCBzcXVhcmVzID0gQXJyYXkuZnJvbShncmlkQ29udGFpbmVyLmNoaWxkcmVuKSBhcyBIVE1MRWxlbWVudFtdO1xuLy9cbi8vICAgICAgIC8vIEFzc2ljdXJhdGkgY2hlIGxlIGRpbWVuc2lvbmkgZGVsbGEgZ3JpZ2xpYSBjb3JyaXNwb25kYW5vIGFpIGRhdGkgc2FsdmF0aVxuLy8gICAgICAgaWYgKG1hcERhdGEubGVuZ3RoID09PSBzcXVhcmVzLmxlbmd0aCkge1xuLy8gICAgICAgICAvLyBBcHBsaWNhIGxvIHN0YXRvIHNhbHZhdG8gYSBvZ25pIHF1YWRyYXRvIGRlbGxhIGdyaWdsaWFcbi8vICAgICAgICAgbWFwRGF0YS5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuLy8gICAgICAgICAgIGlmIChkYXRhLnMpIHtcbi8vICAgICAgICAgICAgIHNxdWFyZXNbaW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuLy8gICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICBzcXVhcmVzW2luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgIH0pO1xuLy8gICAgICAgICBjb25zb2xlLmxvZygnTWFwcGEgY2FyaWNhdGEgY29uIHN1Y2Nlc3NvLicpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgY29uc29sZS53YXJuKCdMZSBkaW1lbnNpb25pIGRlbGxhIGdyaWdsaWEgbm9uIGNvcnJpc3BvbmRvbm8gYWkgZGF0aSBzYWx2YXRpLicpO1xuLy8gICAgICAgfVxuLy8gICAgIH0gY2F0Y2ggKGUpIHtcbi8vICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yZSBkdXJhbnRlIGxhIGRlc2VyaWFsaXp6YXppb25lIGRlaSBkYXRpLicsIGUpO1xuLy8gICAgIH1cbi8vICAgfSBlbHNlIHtcbi8vICAgICBjb25zb2xlLmxvZygnTmVzc3VuYSBtYXBwYSBzYWx2YXRhIHRyb3ZhdGEuJyk7XG4vLyAgIH1cbi8vIH1cbmZ1bmN0aW9uIGdldFNhdmVkTWFwTmFtZXMoKSB7XG4gICAgY29uc3Qgc2F2ZWROYW1lcyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtYXBOYW1lcycpO1xuICAgIGxldCBzYXZlZE5hbWVzQXJyYXkgPSBbXTtcbiAgICBpZiAoc2F2ZWROYW1lcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2F2ZWROYW1lc0FycmF5ID0gSlNPTi5wYXJzZShzYXZlZE5hbWVzKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcmVhZGluZyBzYXZlZCBtYXAgbmFtZXMgbGlzdC4nLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYXBOYW1lc1NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtbmFtZXMnKTtcbiAgICAgICAgc2F2ZWROYW1lc0FycmF5LmZvckVhY2goKG1hcE5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld09wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgbmV3T3B0aW9uLnZhbHVlID0gbWFwTmFtZUZuKG1hcE5hbWUpOyAvLyBJbCB2YWxvcmUgZWZmZXR0aXZvIGRlbGwnb3B6aW9uZVxuICAgICAgICAgICAgbmV3T3B0aW9uLnRleHRDb250ZW50ID0gbWFwTmFtZTsgLy8gSWwgdGVzdG8gdmlzaWJpbGUgYWxsJ3V0ZW50ZVxuICAgICAgICAgICAgbWFwTmFtZXNTZWxlY3QuYXBwZW5kQ2hpbGQobmV3T3B0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gcmVtb3ZlTWFwRnJvbUxvY2FsU3RvcmFnZShtYXBOYW1lKSB7XG4gICAgY29uc3QgbWFwTmFtZUZpbHRlcmVkID0gbWFwTmFtZUZuKG1hcE5hbWUpO1xuICAgIC8vIFJlbW92ZSB0aGUgbWFwIGRhdGEgaXRzZWxmXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oYHNhdmVkTWFwXyR7bWFwTmFtZUZpbHRlcmVkfWApO1xuICAgIC8vIEdldCBhbmQgdXBkYXRlIHRoZSBsaXN0IG9mIHNhdmVkIG1hcCBuYW1lc1xuICAgIGxldCBtYXBOYW1lcyA9IFtdO1xuICAgIGNvbnN0IHNhdmVkTmFtZXMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbWFwTmFtZXMnKTtcbiAgICBpZiAoc2F2ZWROYW1lcykge1xuICAgICAgICBtYXBOYW1lcyA9IEpTT04ucGFyc2Uoc2F2ZWROYW1lcyk7XG4gICAgfVxuICAgIC8vIEZpbHRlciBvdXQgdGhlIG5hbWUgdG8gYmUgcmVtb3ZlZFxuICAgIGNvbnN0IHVwZGF0ZWRNYXBOYW1lcyA9IG1hcE5hbWVzLmZpbHRlcihuYW1lID0+IG5hbWUgIT09IG1hcE5hbWUpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtYXBOYW1lcycsIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRNYXBOYW1lcykpO1xuICAgIC8vIEdldCB0aGUgc2VsZWN0IGVsZW1lbnRcbiAgICBjb25zdCBtYXBOYW1lc1NlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtbmFtZXMnKTtcbiAgICAvLyBGaWx0ZXIgbWFwIG5hbWUgZm9yIHRlY2huaWNhbCBJRCAodGhlIG9wdGlvbidzIHZhbHVlKVxuICAgIGlmIChtYXBOYW1lc1NlbGVjdCkge1xuICAgICAgICAvLyBJdGVyYXRlIG92ZXIgYWxsIG9wdGlvbnMgaW4gdGhlIHNlbGVjdCBlbGVtZW50XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFwTmFtZXNTZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9uID0gbWFwTmFtZXNTZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBvcHRpb24ncyB2YWx1ZSBtYXRjaGVzIHRoZSBmaWx0ZXJlZCBtYXAgbmFtZVxuICAgICAgICAgICAgaWYgKG9wdGlvbi52YWx1ZSA9PT0gbWFwTmFtZSkge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgb3B0aW9uIGF0IHRoZSBmb3VuZCBpbmRleFxuICAgICAgICAgICAgICAgIG1hcE5hbWVzU2VsZWN0LnJlbW92ZShpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgT3B0aW9uIGZvciBtYXAgXCIke21hcE5hbWV9XCIgcmVtb3ZlZCBmcm9tIHNlbGVjdC5gKTtcbiAgICAgICAgICAgICAgICAvLyBCcmVhayB0aGUgbG9vcCBvbmNlIHRoZSBvcHRpb24gaXMgcmVtb3ZlZFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1NlbGVjdCBlbGVtZW50IHdpdGggSUQgXCJtYXAtbmFtZXNcIiBub3QgZm91bmQuJyk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBNYXAgXCIke21hcE5hbWV9XCIgcmVtb3ZlZCBzdWNjZXNzZnVsbHkuYCk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHJhbmRvbWl6ZVNxdWFyZTtcbi8vIEZ1bnppb25lIHBlciByYW5kb21penphcmUgdW4gcXVhZHJhdG8gY29uIGFubm90YXppb25pIGRpIHRpcG9cbmZ1bmN0aW9uIHJhbmRvbWl6ZVNxdWFyZSgpIHtcbiAgICAvLyBTZWxlemlvbmEgdHV0dGkgZ2xpIGVsZW1lbnRpIGNvbiBsYSBjbGFzc2UgJ2dyaWQtc3F1YXJlJ1xuICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUuYWN0aXZlJyk7XG4gICAgLy8gVmVyaWZpY2Egc2UgY2kgc29ubyBxdWFkcmF0aSBuZWxsYSBncmlnbGlhXG4gICAgaWYgKHNxdWFyZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGFsZXJ0KCdQZXIgZmF2b3JlLCBjcmVhIHByaW1hIHVuYSBncmlnbGlhIScpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFJpbXVvdmUgbGEgY2xhc3NlICdzZWxlY3RlZCcgZGEgdHV0dGkgaSBxdWFkcmF0aSBwZXIgZGVzZWxlemlvbmFyZSBxdWVsbG8gcHJlY2VkZW50ZW1lbnRlIGV2aWRlbnppYXRvXG4gICAgc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKSk7XG4gICAgLy8gQ2FsY29sYSB1biBpbmRpY2UgY2FzdWFsZSBhbGwnaW50ZXJubyBkZWxsJ2FycmF5IGRpIHF1YWRyYXRpXG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzcXVhcmVzLmxlbmd0aCk7XG4gICAgLy8gQWdnaXVuZ2UgbGEgY2xhc3NlICdzZWxlY3RlZCcgYWwgcXVhZHJhdG8gc2NlbHRvIGNhc3VhbG1lbnRlXG4gICAgc3F1YXJlc1tyYW5kb21JbmRleF0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcmFuZG9taXplU3F1YXJlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZnVuY3Rpb25zL3JhbmRvbWl6ZVNxdWFyZVwiKSk7XG5jb25zdCBHcmlkXzEgPSByZXF1aXJlKFwiLi9mdW5jdGlvbnMvR3JpZFwiKTtcbmNvbnN0IFNhdmVfMSA9IHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9TYXZlXCIpO1xuY29uc3QgQmFja2dyb3VuZF8xID0gcmVxdWlyZShcIi4vZnVuY3Rpb25zL0JhY2tncm91bmRcIik7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGxldCBicnVzaFR5cGUgPSAnY3Jvc3MnO1xuICAgIGxldCBncmlkQ29scyA9IDE1O1xuICAgIGxldCBncmlkUm93cyA9IDE1O1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1jb250YWluZXInKTtcbiAgICAoMCwgU2F2ZV8xLmdldFNhdmVkTWFwTmFtZXMpKCk7XG4gICAgLy8gQWN0aXZlIGV2ZXJ5IHNxdWFyZSBzZWxlY3RlZC5cbiAgICBjb25zdCBjcmVhdGVHcmlkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZS1ncmlkLWJ0bicpO1xuICAgIGNyZWF0ZUdyaWRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGdyaWRSb3dzID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtcmFuZ2Utcm93cycpLnZhbHVlKTtcbiAgICAgICAgZ3JpZENvbHMgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1yYW5nZScpLnZhbHVlKTtcbiAgICAgICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG4gICAgICAgIGNyZWF0ZUdyaWRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhci1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtcmFuZ2Utcm93cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIGdyaWRSb3dzID0gcGFyc2VJbnQoKGU/LnRhcmdldCkudmFsdWUpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1sYWJlbCcpLmlubmVyVGV4dCA9IGdyaWRDb2xzICsgJ3gnICsgZ3JpZFJvd3M7XG4gICAgICAgIGNyZWF0ZUdyaWRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1yYW5nZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIGdyaWRDb2xzID0gcGFyc2VJbnQoKGU/LnRhcmdldCkudmFsdWUpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1sYWJlbCcpLmlubmVyVGV4dCA9IGdyaWRDb2xzICsgJ3gnICsgZ3JpZFJvd3M7XG4gICAgICAgIGNyZWF0ZUdyaWRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmFuZG9taXplLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmFuZG9taXplU3F1YXJlXzEuZGVmYXVsdCk7XG4gICAgLy8gQ2hpYW1hIGxhIGZ1bnppb25lIGRpIHJhbmRvbWl6emF6aW9uZSBhbCBjbGljayBkZWwgcHVsc2FudGUuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmUtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcE5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWUnKS52YWx1ZTtcbiAgICAgICAgKDAsIFNhdmVfMS5zYXZlTWFwVG9Mb2NhbFN0b3JhZ2UpKGdyaWRDb250YWluZXIsIG1hcE5hbWUsIGdyaWRSb3dzLCBncmlkQ29scyk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWQtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcE5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWVzJykudmFsdWU7XG4gICAgICAgIGNvbnN0IG1hcERhdGEgPSAoMCwgU2F2ZV8xLmxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlKShtYXBOYW1lKTtcbiAgICAgICAgZ3JpZFJvd3MgPSBtYXBEYXRhPy5yb3dzID8/IGdyaWRSb3dzO1xuICAgICAgICBncmlkQ29scyA9IG1hcERhdGE/LmNvbHMgPz8gZ3JpZENvbHM7XG4gICAgICAgICgwLCBHcmlkXzEuY3JlYXRlR3JpZCkoZ3JpZFJvd3MsIGdyaWRDb2xzLCBicnVzaFR5cGUpO1xuICAgICAgICAvLyBBcHBsaWNhIGxvIHN0YXRvIHNhbHZhdG8gYSBvZ25pIHF1YWRyYXRvIGRlbGxhIGdyaWdsaWFcbiAgICAgICAgY29uc3Qgc3F1YXJlcyA9IEFycmF5LmZyb20oZ3JpZENvbnRhaW5lci5jaGlsZHJlbik7XG4gICAgICAgIG1hcERhdGE/LnNxdWFyZXM/LmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YS5zKSB7XG4gICAgICAgICAgICAgICAgc3F1YXJlc1tpbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzcXVhcmVzW2luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbGV0ZS1zYXZlLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXBOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1uYW1lcycpLnZhbHVlO1xuICAgICAgICAoMCwgU2F2ZV8xLnJlbW92ZU1hcEZyb21Mb2NhbFN0b3JhZ2UpKG1hcE5hbWUpO1xuICAgIH0pO1xuICAgIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwiYnJ1c2gtb3B0aW9uc1wiXScpKS5mb3JFYWNoKHJhZGlvID0+IHtcbiAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgYnJ1c2hUeXBlID0gKGU/LnRhcmdldCkudmFsdWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYnJ1c2hUeXBlOiAnLCBicnVzaFR5cGUpO1xuICAgICAgICAgICAgKDAsIEdyaWRfMS5hZGRTcXVhcmVMaXN0ZW5lcnMpKGJydXNoVHlwZSwgZ3JpZENvbHMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cImJhY2stb3B0aW9uc1wiXScpKS5mb3JFYWNoKHJhZGlvID0+IHtcbiAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gKDAsIEJhY2tncm91bmRfMS5iYWNrKShncmlkQ29udGFpbmVyLCAoZT8udGFyZ2V0KS52YWx1ZSkpO1xuICAgIH0pO1xuICAgIGdyaWRDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCAoZSkgPT4gZS5wcmV2ZW50RGVmYXVsdCgpKTtcbiAgICAvLyBDcmVhIHVuYSBncmlnbGlhIGRpIGRpbWVuc2lvbmkgcHJlZGVmaW5pdGUgYWxsJ2F2dmlvIGRlbGxhIHBhZ2luYVxuICAgICgwLCBHcmlkXzEuY3JlYXRlR3JpZCkoZ3JpZFJvd3MsIGdyaWRDb2xzLCBicnVzaFR5cGUpO1xufSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=