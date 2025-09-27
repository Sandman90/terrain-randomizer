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
    // Up (left/right).
    if (aboveIndex - 1 >= 0) {
        if ((currentIndex % cols) !== 0)
            squares[aboveIndex - 1].classList.add('active');
        if (((currentIndex + 1) % cols) !== 0)
            squares[aboveIndex + 1].classList.add('active');
    }
    const belowIndex = currentIndex + cols;
    // Down (left/right).
    if ((belowIndex + 1) < squares.length) {
        if ((currentIndex % cols) !== 0)
            squares[belowIndex - 1].classList.add('active');
        if (((currentIndex + 1) % cols) !== 0)
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
            // console.log('brushType listener: ', brushType);
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
function saveMapToLocalStorage(gridContainer, mapName, gridRows, gridCols, backType = 'earth') {
    const squares = Array.from(gridContainer.children);
    const mapData = {
        rows: gridRows,
        cols: gridCols,
        back: backType,
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
    let backType = 'earth';
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
        (0, Save_1.saveMapToLocalStorage)(gridContainer, mapName, gridRows, gridCols, backType);
    });
    document.getElementById('load-btn').addEventListener('click', () => {
        const mapName = document.getElementById('map-names').value;
        const mapData = (0, Save_1.loadMapFromLocalStorage)(mapName);
        gridRows = mapData?.rows ?? gridRows;
        gridCols = mapData?.cols ?? gridCols;
        (0, Grid_1.createGrid)(gridRows, gridCols, brushType);
        backType = (mapData?.back ?? backType);
        (0, Background_1.back)(gridContainer, backType);
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
    document.getElementById('delete-btn').addEventListener('click', () => {
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
        radio.addEventListener('click', (e) => {
            backType = (e?.target).value;
            (0, Background_1.back)(gridContainer, backType);
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7OztVQ2xGRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9CYWNrZ3JvdW5kLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvQnJ1c2gudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9HcmlkLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvU2F2ZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL3JhbmRvbWl6ZVNxdWFyZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYmFjayA9IGJhY2s7XG5mdW5jdGlvbiBiYWNrKGdyaWRDb250YWluZXIsIGJhY2tUeXBlKSB7XG4gICAgbGV0IGJhY2tncm91bmQgPSAxO1xuICAgIHN3aXRjaCAoYmFja1R5cGUpIHtcbiAgICAgICAgY2FzZSBcInJvY2tcIjpcbiAgICAgICAgICAgIGJhY2tncm91bmQgPSAyO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ3b29kXCI6XG4gICAgICAgICAgICBiYWNrZ3JvdW5kID0gMztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBncmlkQ29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJy4vaW1hZ2VzL0JhY2tncm91bmRUZXJyYWluJHtiYWNrZ3JvdW5kfS5qcGdgO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJydXNoID0gYnJ1c2g7XG5mdW5jdGlvbiBicnVzaChicnVzaFR5cGUsIHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIHN3aXRjaCAoYnJ1c2hUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJjcm9zc1wiOlxuICAgICAgICAgICAgYnJ1c2hDcm9zcyhzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib3hcIjpcbiAgICAgICAgICAgIGJydXNoQm94KHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgY2FzZSBcInBvaW50XCI6XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5mdW5jdGlvbiBicnVzaENyb3NzKHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHNxdWFyZXNBcnJheS5pbmRleE9mKGUpO1xuICAgIC8vIFVwL0Rvd24uXG4gICAgY29uc3QgYWJvdmVJbmRleCA9IGN1cnJlbnRJbmRleCAtIGNvbHM7XG4gICAgaWYgKGFib3ZlSW5kZXggPj0gMClcbiAgICAgICAgc3F1YXJlc1thYm92ZUluZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICBjb25zdCBiZWxvd0luZGV4ID0gY3VycmVudEluZGV4ICsgY29scztcbiAgICBpZiAoYmVsb3dJbmRleCA8IHNxdWFyZXMubGVuZ3RoKVxuICAgICAgICBzcXVhcmVzW2JlbG93SW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIC8vIExlZnQvUmlnaHQuXG4gICAgY29uc3QgYmVmb3JlSW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuICAgIGlmIChiZWZvcmVJbmRleCA+PSAwICYmIGJlZm9yZUluZGV4ICUgY29scyAhPT0gKGNvbHMgLSAxKSlcbiAgICAgICAgc3F1YXJlc1tiZWZvcmVJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgY29uc3QgYWZ0ZXJJbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XG4gICAgaWYgKGFmdGVySW5kZXggPCBzcXVhcmVzLmxlbmd0aCAmJiBhZnRlckluZGV4ICUgY29scyAhPT0gMClcbiAgICAgICAgc3F1YXJlc1thZnRlckluZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAvLyBjb25zb2xlLmxvZygnYmVmb3JlSW5kZXg6ICcsIGJlZm9yZUluZGV4LCAnYWZ0ZXJJbmRleDonLCBhZnRlckluZGV4LCAnTW9kOiAnLCBiZWZvcmVJbmRleCAlIGNvbHMsIChjb2xzLTEpKTtcbn1cbmZ1bmN0aW9uIGJydXNoQm94KHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHNxdWFyZXNBcnJheS5pbmRleE9mKGUpO1xuICAgIC8vIFVwL0Rvd24uXG4gICAgY29uc3QgYWJvdmVJbmRleCA9IGN1cnJlbnRJbmRleCAtIGNvbHM7XG4gICAgLy8gVXAgKGxlZnQvcmlnaHQpLlxuICAgIGlmIChhYm92ZUluZGV4IC0gMSA+PSAwKSB7XG4gICAgICAgIGlmICgoY3VycmVudEluZGV4ICUgY29scykgIT09IDApXG4gICAgICAgICAgICBzcXVhcmVzW2Fib3ZlSW5kZXggLSAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKCgoY3VycmVudEluZGV4ICsgMSkgJSBjb2xzKSAhPT0gMClcbiAgICAgICAgICAgIHNxdWFyZXNbYWJvdmVJbmRleCArIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBjb25zdCBiZWxvd0luZGV4ID0gY3VycmVudEluZGV4ICsgY29scztcbiAgICAvLyBEb3duIChsZWZ0L3JpZ2h0KS5cbiAgICBpZiAoKGJlbG93SW5kZXggKyAxKSA8IHNxdWFyZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICgoY3VycmVudEluZGV4ICUgY29scykgIT09IDApXG4gICAgICAgICAgICBzcXVhcmVzW2JlbG93SW5kZXggLSAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKCgoY3VycmVudEluZGV4ICsgMSkgJSBjb2xzKSAhPT0gMClcbiAgICAgICAgICAgIHNxdWFyZXNbYmVsb3dJbmRleCArIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBicnVzaENyb3NzKHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scyk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlR3JpZCA9IGNyZWF0ZUdyaWQ7XG5leHBvcnRzLmFkZFNxdWFyZUxpc3RlbmVycyA9IGFkZFNxdWFyZUxpc3RlbmVycztcbmNvbnN0IEJydXNoXzEgPSByZXF1aXJlKFwiLi9CcnVzaFwiKTtcbmNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1jb250YWluZXInKTtcbi8vIGxldCBpc01vdXNlRG93biA9IGZhbHNlO1xuLy8gbGV0IHN0YXJ0U3F1YXJlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuLy8gbGV0IHNlbGVjdGVkU3F1YXJlczogU2V0PEhUTUxFbGVtZW50PiA9IG5ldyBTZXQoKTsgLy8gVXNpYW1vIHVuIFNldCBwZXIgZXZpdGFyZSBkdXBsaWNhdGlcbi8vIGxldCBpc0RyYWdnaW5nUmlnaHRDbGljayA9IGZhbHNlO1xuLy8gRnVuemlvbmUgcGVyIGNyZWFyZSBsYSBncmlnbGlhIGNvbiBhbm5vdGF6aW9uaSBkaSB0aXBvXG5mdW5jdGlvbiBjcmVhdGVHcmlkKHJvd3MsIGNvbHMsIGJydXNoVHlwZSkge1xuICAgIC8vIFB1bGlzY2UgaWwgY29udGVudXRvIHByZWNlZGVudGUgZGVsIGNvbnRlbml0b3JlXG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAvLyBJbXBvc3RhIGkgdGVtcGxhdGUgcGVyIGxlIHJpZ2hlIGUgbGUgY29sb25uZSBkZWxsYSBncmlnbGlhIENTU1xuICAgIGdyaWRDb250YWluZXIuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtyb3dzfSwgMWZyKWA7XG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke2NvbHN9LCAxZnIpYDtcbiAgICAvLyBDYWxjb2xhIGxhIGxhcmdoZXp6YSBkZWwgY29udGVuaXRvcmUgaW4gYmFzZSBhbCBudW1lcm8gZGkgY29sb25uZSBlIGFsbGEgZGltZW5zaW9uZSBkZWkgcXVhZHJhdGkgKyBib3JkaVxuICAgIGdyaWRDb250YWluZXIuc3R5bGUud2lkdGggPSBgJHtjb2xzICogNTIgLSAxfXB4YDsgLy8gQXNzdW1lbmRvIGNoZSBvZ25pIHF1YWRyYXRvIHNpYSA1MHB4ICsgMnB4IGRpIGJvcmRvIHRvdGFsZVxuICAgIC8vIENyZWEgaSBzaW5nb2xpIHF1YWRyYXRpIGRlbGxhIGdyaWdsaWFcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3MgKiBjb2xzOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdncmlkLXNxdWFyZScpO1xuICAgICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgfVxuICAgIC8vIEFjdGl2ZSBldmVyeSBzcXVhcmUgc2VsZWN0ZWQuXG4gICAgYWRkU3F1YXJlTGlzdGVuZXJzKGJydXNoVHlwZSwgY29scyk7XG4gICAgLy8gc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4gc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpKSk7XG59XG5sZXQgaXNNb3VzZURvd24gPSBmYWxzZTtcbmxldCBzdGFydFNxdWFyZSA9IG51bGw7XG5sZXQgc2VsZWN0ZWRTcXVhcmVzID0gbmV3IFNldCgpO1xubGV0IGlzRHJhZ2dpbmdSaWdodENsaWNrID0gZmFsc2U7XG4vLyBWYXJpYWJpbGkgZ2xvYmFsaSBwZXIgbWVtb3JpenphcmUgaSByaWZlcmltZW50aSBhaSBsaXN0ZW5lclxubGV0IHNxdWFyZUxpc3RlbmVyUmVmID0gbnVsbDtcbmxldCBzcXVhcmVPdmVyTGlzdGVuZXJSZWYgPSBudWxsO1xubGV0IHNxdWFyZVVwTGlzdGVuZXJSZWYgPSBudWxsO1xuLy8gRnVuemlvbmUgcGVyIHJpbXVvdmVyZSB0dXR0aSBpIHZlY2NoaSBsaXN0ZW5lclxuZnVuY3Rpb24gcmVtb3ZlT2xkTGlzdGVuZXJzKCkge1xuICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcbiAgICBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHtcbiAgICAgICAgaWYgKHNxdWFyZUxpc3RlbmVyUmVmKSB7XG4gICAgICAgICAgICBzcXVhcmUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc3F1YXJlTGlzdGVuZXJSZWYpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzcXVhcmVPdmVyTGlzdGVuZXJSZWYpIHtcbiAgICAgICAgICAgIHNxdWFyZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBzcXVhcmVPdmVyTGlzdGVuZXJSZWYpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHNxdWFyZVVwTGlzdGVuZXJSZWYpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHNxdWFyZVVwTGlzdGVuZXJSZWYpO1xuICAgIH1cbn1cbi8vIEZ1bnppb25lIHByaW5jaXBhbGUgcGVyIGFnZ2l1bmdlcmUgbnVvdmkgbGlzdGVuZXJcbmZ1bmN0aW9uIGFkZFNxdWFyZUxpc3RlbmVycyhicnVzaFR5cGUsIGNvbHMpIHtcbiAgICAvLyBSaW11b3ZlIGkgdmVjY2hpIGxpc3RlbmVyIHByaW1hIGRpIGFwcGxpY2FyZSBpIG51b3ZpXG4gICAgcmVtb3ZlT2xkTGlzdGVuZXJzKCk7XG4gICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZScpO1xuICAgIGNvbnN0IHNxdWFyZXNBcnJheSA9IEFycmF5LmZyb20oc3F1YXJlcyk7XG4gICAgLy8gRGljaGlhcmF6aW9uZSBkZWkgbGlzdGVuZXIgY29uIHVuIG5vbWUsIGluIG1vZG8gY2hlIHBvc3Nhbm8gZXNzZXJlIHJpbW9zc2lcbiAgICBzcXVhcmVMaXN0ZW5lclJlZiA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKGUuYnV0dG9uID09PSAyKSB7XG4gICAgICAgICAgICBpc0RyYWdnaW5nUmlnaHRDbGljayA9IHRydWU7XG4gICAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICgwLCBCcnVzaF8xLmJydXNoKShicnVzaFR5cGUsIHNxdWFyZXNBcnJheSwgZS50YXJnZXQsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhcnRTcXVhcmUgPSBlLnRhcmdldDtcbiAgICAgICAgaXNNb3VzZURvd24gPSB0cnVlO1xuICAgICAgICBzZWxlY3RlZFNxdWFyZXMuY2xlYXIoKTtcbiAgICAgICAgc2VsZWN0ZWRTcXVhcmVzLmFkZChlLnRhcmdldCk7XG4gICAgfTtcbiAgICBzcXVhcmVPdmVyTGlzdGVuZXJSZWYgPSAoZSkgPT4ge1xuICAgICAgICBpZiAoIWlzTW91c2VEb3duIHx8ICFzdGFydFNxdWFyZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgY3VycmVudFNxdWFyZSA9IGUudGFyZ2V0O1xuICAgICAgICBpZiAoY3VycmVudFNxdWFyZS5jbGFzc0xpc3QuY29udGFpbnMoJ2dyaWQtc3F1YXJlJykgJiYgIXNlbGVjdGVkU3F1YXJlcy5oYXMoY3VycmVudFNxdWFyZSkpIHtcbiAgICAgICAgICAgIGlmIChpc0RyYWdnaW5nUmlnaHRDbGljaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJywgJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAoMCwgQnJ1c2hfMS5icnVzaCkoYnJ1c2hUeXBlLCBzcXVhcmVzQXJyYXksIGN1cnJlbnRTcXVhcmUsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxlY3RlZFNxdWFyZXMuYWRkKGN1cnJlbnRTcXVhcmUpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2JydXNoVHlwZSBsaXN0ZW5lcjogJywgYnJ1c2hUeXBlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgc3F1YXJlVXBMaXN0ZW5lclJlZiA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAoaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgfHwgaXNNb3VzZURvd24pIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpc0RyYWdnaW5nUmlnaHRDbGljayA9IGZhbHNlO1xuICAgICAgICAgICAgaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIHN0YXJ0U3F1YXJlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gQXBwbGljYXppb25lIGRlaSBudW92aSBsaXN0ZW5lclxuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc3F1YXJlTGlzdGVuZXJSZWYpO1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgc3F1YXJlT3Zlckxpc3RlbmVyUmVmKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgc3F1YXJlVXBMaXN0ZW5lclJlZik7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2F2ZU1hcFRvTG9jYWxTdG9yYWdlID0gc2F2ZU1hcFRvTG9jYWxTdG9yYWdlO1xuZXhwb3J0cy5sb2FkTWFwRnJvbUxvY2FsU3RvcmFnZSA9IGxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlO1xuZXhwb3J0cy5nZXRTYXZlZE1hcE5hbWVzID0gZ2V0U2F2ZWRNYXBOYW1lcztcbmV4cG9ydHMucmVtb3ZlTWFwRnJvbUxvY2FsU3RvcmFnZSA9IHJlbW92ZU1hcEZyb21Mb2NhbFN0b3JhZ2U7XG4vLyBGaWx0ZXIgbWFwIG5hbWUgZm9yIHRlY2huaWNhbCBJRC5cbmNvbnN0IG1hcE5hbWVGbiA9IChtYXBOYW1lKSA9PiBtYXBOYW1lLnJlcGxhY2VBbGwoJyAnLCAnJyk7XG5mdW5jdGlvbiBzYXZlTWFwVG9Mb2NhbFN0b3JhZ2UoZ3JpZENvbnRhaW5lciwgbWFwTmFtZSwgZ3JpZFJvd3MsIGdyaWRDb2xzLCBiYWNrVHlwZSA9ICdlYXJ0aCcpIHtcbiAgICBjb25zdCBzcXVhcmVzID0gQXJyYXkuZnJvbShncmlkQ29udGFpbmVyLmNoaWxkcmVuKTtcbiAgICBjb25zdCBtYXBEYXRhID0ge1xuICAgICAgICByb3dzOiBncmlkUm93cyxcbiAgICAgICAgY29sczogZ3JpZENvbHMsXG4gICAgICAgIGJhY2s6IGJhY2tUeXBlLFxuICAgICAgICBzcXVhcmVzOiBzcXVhcmVzLm1hcChzcXVhcmUgPT4gKHtcbiAgICAgICAgICAgIHM6IHNxdWFyZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpXG4gICAgICAgIH0pKVxuICAgIH07XG4gICAgY29uc3QgbWFwTmFtZUZpbHRlcmVkID0gbWFwTmFtZUZuKG1hcE5hbWUpO1xuICAgIC8vIEFkZCBvcHRpb24gdG8gc2F2ZWQgbWFwcy5cbiAgICBjb25zdCBtYXBOYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtbmFtZXMnKTtcbiAgICBjb25zdCBuZXdPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICBuZXdPcHRpb24udmFsdWUgPSBtYXBOYW1lRmlsdGVyZWQ7IC8vIElsIHZhbG9yZSBlZmZldHRpdm8gZGVsbCdvcHppb25lXG4gICAgbmV3T3B0aW9uLnRleHRDb250ZW50ID0gbWFwTmFtZTsgLy8gSWwgdGVzdG8gdmlzaWJpbGUgYWxsJ3V0ZW50ZVxuICAgIG1hcE5hbWVzLmFwcGVuZENoaWxkKG5ld09wdGlvbik7XG4gICAgLy8gU2F2ZSB0aGUgbWFwIGRhdGEgdW5kZXIgYSB1bmlxdWUga2V5XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYHNhdmVkTWFwXyR7bWFwTmFtZUZpbHRlcmVkfWAsIEpTT04uc3RyaW5naWZ5KG1hcERhdGEpKTtcbiAgICAvLyBHZXQgYW5kIHVwZGF0ZSB0aGUgbGlzdCBvZiBzYXZlZCBtYXAgbmFtZXNcbiAgICBsZXQgbWFwTmFtZXNBcnJheSA9IFtdO1xuICAgIGNvbnN0IHNhdmVkTmFtZXMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbWFwTmFtZXMnKTtcbiAgICBpZiAoc2F2ZWROYW1lcykge1xuICAgICAgICBtYXBOYW1lc0FycmF5ID0gSlNPTi5wYXJzZShzYXZlZE5hbWVzKTtcbiAgICB9XG4gICAgLy8gQWRkIHRoZSBuZXcgbWFwIG5hbWUgaWYgaXQgZG9lc24ndCBleGlzdFxuICAgIGlmICghbWFwTmFtZXNBcnJheS5pbmNsdWRlcyhtYXBOYW1lKSkge1xuICAgICAgICBtYXBOYW1lc0FycmF5LnB1c2gobWFwTmFtZSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtYXBOYW1lcycsIEpTT04uc3RyaW5naWZ5KG1hcE5hbWVzQXJyYXkpKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coYE1hcCBcIiR7bWFwTmFtZX1cIiBzYXZlZCBzdWNjZXNzZnVsbHkuYCk7XG59XG5mdW5jdGlvbiBsb2FkTWFwRnJvbUxvY2FsU3RvcmFnZShtYXBOYW1lKSB7XG4gICAgY29uc3QgbWFwTmFtZUZpbHRlcmVkID0gbWFwTmFtZUZuKG1hcE5hbWUpO1xuICAgIGNvbnN0IHNlcmlhbGl6ZWRNYXAgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgc2F2ZWRNYXBfJHttYXBOYW1lRmlsdGVyZWR9YCk7XG4gICAgaWYgKHNlcmlhbGl6ZWRNYXApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG1hcERhdGEgPSBKU09OLnBhcnNlKHNlcmlhbGl6ZWRNYXApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYE1hcCBcIiR7bWFwTmFtZX1cIiBsb2FkZWQgc3VjY2Vzc2Z1bGx5LmApO1xuICAgICAgICAgICAgcmV0dXJuIG1hcERhdGE7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGRlc2VyaWFsaXppbmcgZGF0YS4nLCBlKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnTm8gc2F2ZWQgbWFwIGZvdW5kIHdpdGggdGhhdCBuYW1lLicpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG4vLyBmdW5jdGlvbiBsb2FkTWFwRnJvbUxvY2FsU3RvcmFnZShncmlkQ29udGFpbmVyOiBIVE1MRWxlbWVudCwgbWFwTmFtZTogc3RyaW5nKTogdm9pZCB7XG4vLyAgIC8vIFJlY3VwZXJhIGxhIHN0cmluZ2Egc2VyaWFsaXp6YXRhXG4vLyAgIGNvbnN0IHNlcmlhbGl6ZWRNYXAgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2F2ZWRNYXBfJyArIG1hcE5hbWVGbihtYXBOYW1lKSk7XG4vL1xuLy8gICBpZiAoc2VyaWFsaXplZE1hcCkge1xuLy8gICAgIHRyeSB7XG4vLyAgICAgICAvLyBEZXNlcmlhbGl6emEgbGEgc3RyaW5nYSBpbiB1biBhcnJheSBkaSBvZ2dldHRpXG4vLyAgICAgICBjb25zdCBtYXBEYXRhOiBTcXVhcmVTdGF0ZVtdID0gSlNPTi5wYXJzZShzZXJpYWxpemVkTWFwKTtcbi8vICAgICAgIGNvbnN0IHNxdWFyZXMgPSBBcnJheS5mcm9tKGdyaWRDb250YWluZXIuY2hpbGRyZW4pIGFzIEhUTUxFbGVtZW50W107XG4vL1xuLy8gICAgICAgLy8gQXNzaWN1cmF0aSBjaGUgbGUgZGltZW5zaW9uaSBkZWxsYSBncmlnbGlhIGNvcnJpc3BvbmRhbm8gYWkgZGF0aSBzYWx2YXRpXG4vLyAgICAgICBpZiAobWFwRGF0YS5sZW5ndGggPT09IHNxdWFyZXMubGVuZ3RoKSB7XG4vLyAgICAgICAgIC8vIEFwcGxpY2EgbG8gc3RhdG8gc2FsdmF0byBhIG9nbmkgcXVhZHJhdG8gZGVsbGEgZ3JpZ2xpYVxuLy8gICAgICAgICBtYXBEYXRhLmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4vLyAgICAgICAgICAgaWYgKGRhdGEucykge1xuLy8gICAgICAgICAgICAgc3F1YXJlc1tpbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4vLyAgICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgIHNxdWFyZXNbaW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgfSk7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKCdNYXBwYSBjYXJpY2F0YSBjb24gc3VjY2Vzc28uJyk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICBjb25zb2xlLndhcm4oJ0xlIGRpbWVuc2lvbmkgZGVsbGEgZ3JpZ2xpYSBub24gY29ycmlzcG9uZG9ubyBhaSBkYXRpIHNhbHZhdGkuJyk7XG4vLyAgICAgICB9XG4vLyAgICAgfSBjYXRjaCAoZSkge1xuLy8gICAgICAgY29uc29sZS5lcnJvcignRXJyb3JlIGR1cmFudGUgbGEgZGVzZXJpYWxpenphemlvbmUgZGVpIGRhdGkuJywgZSk7XG4vLyAgICAgfVxuLy8gICB9IGVsc2Uge1xuLy8gICAgIGNvbnNvbGUubG9nKCdOZXNzdW5hIG1hcHBhIHNhbHZhdGEgdHJvdmF0YS4nKTtcbi8vICAgfVxuLy8gfVxuZnVuY3Rpb24gZ2V0U2F2ZWRNYXBOYW1lcygpIHtcbiAgICBjb25zdCBzYXZlZE5hbWVzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21hcE5hbWVzJyk7XG4gICAgbGV0IHNhdmVkTmFtZXNBcnJheSA9IFtdO1xuICAgIGlmIChzYXZlZE5hbWVzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzYXZlZE5hbWVzQXJyYXkgPSBKU09OLnBhcnNlKHNhdmVkTmFtZXMpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZWFkaW5nIHNhdmVkIG1hcCBuYW1lcyBsaXN0LicsIGUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1hcE5hbWVzU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1uYW1lcycpO1xuICAgICAgICBzYXZlZE5hbWVzQXJyYXkuZm9yRWFjaCgobWFwTmFtZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3T3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBuZXdPcHRpb24udmFsdWUgPSBtYXBOYW1lRm4obWFwTmFtZSk7IC8vIElsIHZhbG9yZSBlZmZldHRpdm8gZGVsbCdvcHppb25lXG4gICAgICAgICAgICBuZXdPcHRpb24udGV4dENvbnRlbnQgPSBtYXBOYW1lOyAvLyBJbCB0ZXN0byB2aXNpYmlsZSBhbGwndXRlbnRlXG4gICAgICAgICAgICBtYXBOYW1lc1NlbGVjdC5hcHBlbmRDaGlsZChuZXdPcHRpb24pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiByZW1vdmVNYXBGcm9tTG9jYWxTdG9yYWdlKG1hcE5hbWUpIHtcbiAgICBjb25zdCBtYXBOYW1lRmlsdGVyZWQgPSBtYXBOYW1lRm4obWFwTmFtZSk7XG4gICAgLy8gUmVtb3ZlIHRoZSBtYXAgZGF0YSBpdHNlbGZcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShgc2F2ZWRNYXBfJHttYXBOYW1lRmlsdGVyZWR9YCk7XG4gICAgLy8gR2V0IGFuZCB1cGRhdGUgdGhlIGxpc3Qgb2Ygc2F2ZWQgbWFwIG5hbWVzXG4gICAgbGV0IG1hcE5hbWVzID0gW107XG4gICAgY29uc3Qgc2F2ZWROYW1lcyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtYXBOYW1lcycpO1xuICAgIGlmIChzYXZlZE5hbWVzKSB7XG4gICAgICAgIG1hcE5hbWVzID0gSlNPTi5wYXJzZShzYXZlZE5hbWVzKTtcbiAgICB9XG4gICAgLy8gRmlsdGVyIG91dCB0aGUgbmFtZSB0byBiZSByZW1vdmVkXG4gICAgY29uc3QgdXBkYXRlZE1hcE5hbWVzID0gbWFwTmFtZXMuZmlsdGVyKG5hbWUgPT4gbmFtZSAhPT0gbWFwTmFtZSk7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ21hcE5hbWVzJywgSlNPTi5zdHJpbmdpZnkodXBkYXRlZE1hcE5hbWVzKSk7XG4gICAgLy8gR2V0IHRoZSBzZWxlY3QgZWxlbWVudFxuICAgIGNvbnN0IG1hcE5hbWVzU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1uYW1lcycpO1xuICAgIC8vIEZpbHRlciBtYXAgbmFtZSBmb3IgdGVjaG5pY2FsIElEICh0aGUgb3B0aW9uJ3MgdmFsdWUpXG4gICAgaWYgKG1hcE5hbWVzU2VsZWN0KSB7XG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBhbGwgb3B0aW9ucyBpbiB0aGUgc2VsZWN0IGVsZW1lbnRcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXBOYW1lc1NlbGVjdC5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBvcHRpb24gPSBtYXBOYW1lc1NlbGVjdC5vcHRpb25zW2ldO1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIG9wdGlvbidzIHZhbHVlIG1hdGNoZXMgdGhlIGZpbHRlcmVkIG1hcCBuYW1lXG4gICAgICAgICAgICBpZiAob3B0aW9uLnZhbHVlID09PSBtYXBOYW1lKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBvcHRpb24gYXQgdGhlIGZvdW5kIGluZGV4XG4gICAgICAgICAgICAgICAgbWFwTmFtZXNTZWxlY3QucmVtb3ZlKGkpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBPcHRpb24gZm9yIG1hcCBcIiR7bWFwTmFtZX1cIiByZW1vdmVkIGZyb20gc2VsZWN0LmApO1xuICAgICAgICAgICAgICAgIC8vIEJyZWFrIHRoZSBsb29wIG9uY2UgdGhlIG9wdGlvbiBpcyByZW1vdmVkXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybignU2VsZWN0IGVsZW1lbnQgd2l0aCBJRCBcIm1hcC1uYW1lc1wiIG5vdCBmb3VuZC4nKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coYE1hcCBcIiR7bWFwTmFtZX1cIiByZW1vdmVkIHN1Y2Nlc3NmdWxseS5gKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gcmFuZG9taXplU3F1YXJlO1xuLy8gRnVuemlvbmUgcGVyIHJhbmRvbWl6emFyZSB1biBxdWFkcmF0byBjb24gYW5ub3RhemlvbmkgZGkgdGlwb1xuZnVuY3Rpb24gcmFuZG9taXplU3F1YXJlKCkge1xuICAgIC8vIFNlbGV6aW9uYSB0dXR0aSBnbGkgZWxlbWVudGkgY29uIGxhIGNsYXNzZSAnZ3JpZC1zcXVhcmUnXG4gICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZS5hY3RpdmUnKTtcbiAgICAvLyBWZXJpZmljYSBzZSBjaSBzb25vIHF1YWRyYXRpIG5lbGxhIGdyaWdsaWFcbiAgICBpZiAoc3F1YXJlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYWxlcnQoJ1BlciBmYXZvcmUsIGNyZWEgcHJpbWEgdW5hIGdyaWdsaWEhJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gUmltdW92ZSBsYSBjbGFzc2UgJ3NlbGVjdGVkJyBkYSB0dXR0aSBpIHF1YWRyYXRpIHBlciBkZXNlbGV6aW9uYXJlIHF1ZWxsbyBwcmVjZWRlbnRlbWVudGUgZXZpZGVuemlhdG9cbiAgICBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpKTtcbiAgICAvLyBDYWxjb2xhIHVuIGluZGljZSBjYXN1YWxlIGFsbCdpbnRlcm5vIGRlbGwnYXJyYXkgZGkgcXVhZHJhdGlcbiAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNxdWFyZXMubGVuZ3RoKTtcbiAgICAvLyBBZ2dpdW5nZSBsYSBjbGFzc2UgJ3NlbGVjdGVkJyBhbCBxdWFkcmF0byBzY2VsdG8gY2FzdWFsbWVudGVcbiAgICBzcXVhcmVzW3JhbmRvbUluZGV4XS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCByYW5kb21pemVTcXVhcmVfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9mdW5jdGlvbnMvcmFuZG9taXplU3F1YXJlXCIpKTtcbmNvbnN0IEdyaWRfMSA9IHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9HcmlkXCIpO1xuY29uc3QgU2F2ZV8xID0gcmVxdWlyZShcIi4vZnVuY3Rpb25zL1NhdmVcIik7XG5jb25zdCBCYWNrZ3JvdW5kXzEgPSByZXF1aXJlKFwiLi9mdW5jdGlvbnMvQmFja2dyb3VuZFwiKTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgbGV0IGJydXNoVHlwZSA9ICdjcm9zcyc7XG4gICAgbGV0IGJhY2tUeXBlID0gJ2VhcnRoJztcbiAgICBsZXQgZ3JpZENvbHMgPSAxNTtcbiAgICBsZXQgZ3JpZFJvd3MgPSAxNTtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtY29udGFpbmVyJyk7XG4gICAgKDAsIFNhdmVfMS5nZXRTYXZlZE1hcE5hbWVzKSgpO1xuICAgIC8vIEFjdGl2ZSBldmVyeSBzcXVhcmUgc2VsZWN0ZWQuXG4gICAgY29uc3QgY3JlYXRlR3JpZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjcmVhdGUtZ3JpZC1idG4nKTtcbiAgICBjcmVhdGVHcmlkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBncmlkUm93cyA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLXJhbmdlLXJvd3MnKS52YWx1ZSk7XG4gICAgICAgIGdyaWRDb2xzID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtcmFuZ2UnKS52YWx1ZSk7XG4gICAgICAgICgwLCBHcmlkXzEuY3JlYXRlR3JpZCkoZ3JpZFJvd3MsIGdyaWRDb2xzLCBicnVzaFR5cGUpO1xuICAgICAgICBjcmVhdGVHcmlkQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xlYXItYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICgwLCBHcmlkXzEuY3JlYXRlR3JpZCkoZ3JpZFJvd3MsIGdyaWRDb2xzLCBicnVzaFR5cGUpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLXJhbmdlLXJvd3MnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICBncmlkUm93cyA9IHBhcnNlSW50KChlPy50YXJnZXQpLnZhbHVlKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtbGFiZWwnKS5pbm5lclRleHQgPSBncmlkQ29scyArICd4JyArIGdyaWRSb3dzO1xuICAgICAgICBjcmVhdGVHcmlkQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtcmFuZ2UnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICBncmlkQ29scyA9IHBhcnNlSW50KChlPy50YXJnZXQpLnZhbHVlKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtbGFiZWwnKS5pbm5lclRleHQgPSBncmlkQ29scyArICd4JyArIGdyaWRSb3dzO1xuICAgICAgICBjcmVhdGVHcmlkQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhbmRvbWl6ZS1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJhbmRvbWl6ZVNxdWFyZV8xLmRlZmF1bHQpO1xuICAgIC8vIENoaWFtYSBsYSBmdW56aW9uZSBkaSByYW5kb21penphemlvbmUgYWwgY2xpY2sgZGVsIHB1bHNhbnRlLlxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXZlLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXBOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1uYW1lJykudmFsdWU7XG4gICAgICAgICgwLCBTYXZlXzEuc2F2ZU1hcFRvTG9jYWxTdG9yYWdlKShncmlkQ29udGFpbmVyLCBtYXBOYW1lLCBncmlkUm93cywgZ3JpZENvbHMsIGJhY2tUeXBlKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZC1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFwTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtbmFtZXMnKS52YWx1ZTtcbiAgICAgICAgY29uc3QgbWFwRGF0YSA9ICgwLCBTYXZlXzEubG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2UpKG1hcE5hbWUpO1xuICAgICAgICBncmlkUm93cyA9IG1hcERhdGE/LnJvd3MgPz8gZ3JpZFJvd3M7XG4gICAgICAgIGdyaWRDb2xzID0gbWFwRGF0YT8uY29scyA/PyBncmlkQ29scztcbiAgICAgICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG4gICAgICAgIGJhY2tUeXBlID0gKG1hcERhdGE/LmJhY2sgPz8gYmFja1R5cGUpO1xuICAgICAgICAoMCwgQmFja2dyb3VuZF8xLmJhY2spKGdyaWRDb250YWluZXIsIGJhY2tUeXBlKTtcbiAgICAgICAgLy8gQXBwbGljYSBsbyBzdGF0byBzYWx2YXRvIGEgb2duaSBxdWFkcmF0byBkZWxsYSBncmlnbGlhXG4gICAgICAgIGNvbnN0IHNxdWFyZXMgPSBBcnJheS5mcm9tKGdyaWRDb250YWluZXIuY2hpbGRyZW4pO1xuICAgICAgICBtYXBEYXRhPy5zcXVhcmVzPy5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEucykge1xuICAgICAgICAgICAgICAgIHNxdWFyZXNbaW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3F1YXJlc1tpbmRleF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWxldGUtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcE5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWVzJykudmFsdWU7XG4gICAgICAgICgwLCBTYXZlXzEucmVtb3ZlTWFwRnJvbUxvY2FsU3RvcmFnZSkobWFwTmFtZSk7XG4gICAgfSk7XG4gICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJicnVzaC1vcHRpb25zXCJdJykpLmZvckVhY2gocmFkaW8gPT4ge1xuICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBicnVzaFR5cGUgPSAoZT8udGFyZ2V0KS52YWx1ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdicnVzaFR5cGU6ICcsIGJydXNoVHlwZSk7XG4gICAgICAgICAgICAoMCwgR3JpZF8xLmFkZFNxdWFyZUxpc3RlbmVycykoYnJ1c2hUeXBlLCBncmlkQ29scyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwiYmFjay1vcHRpb25zXCJdJykpLmZvckVhY2gocmFkaW8gPT4ge1xuICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBiYWNrVHlwZSA9IChlPy50YXJnZXQpLnZhbHVlO1xuICAgICAgICAgICAgKDAsIEJhY2tncm91bmRfMS5iYWNrKShncmlkQ29udGFpbmVyLCBiYWNrVHlwZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIGdyaWRDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCAoZSkgPT4gZS5wcmV2ZW50RGVmYXVsdCgpKTtcbiAgICAvLyBDcmVhIHVuYSBncmlnbGlhIGRpIGRpbWVuc2lvbmkgcHJlZGVmaW5pdGUgYWxsJ2F2dmlvIGRlbGxhIHBhZ2luYVxuICAgICgwLCBHcmlkXzEuY3JlYXRlR3JpZCkoZ3JpZFJvd3MsIGdyaWRDb2xzLCBicnVzaFR5cGUpO1xufSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=