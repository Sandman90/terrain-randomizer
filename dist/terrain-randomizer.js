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
    if (savedNames) {
        try {
            return JSON.parse(savedNames);
        }
        catch (e) {
            console.error('Error reading saved map names list.', e);
            return [];
        }
    }
    return [];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9CYWNrZ3JvdW5kLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvQnJ1c2gudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9HcmlkLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvU2F2ZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL3JhbmRvbWl6ZVNxdWFyZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYmFjayA9IGJhY2s7XG5mdW5jdGlvbiBiYWNrKGdyaWRDb250YWluZXIsIGJhY2tUeXBlKSB7XG4gICAgbGV0IGJhY2tncm91bmQgPSAxO1xuICAgIHN3aXRjaCAoYmFja1R5cGUpIHtcbiAgICAgICAgY2FzZSBcInJvY2tcIjpcbiAgICAgICAgICAgIGJhY2tncm91bmQgPSAyO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ3b29kXCI6XG4gICAgICAgICAgICBiYWNrZ3JvdW5kID0gMztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBncmlkQ29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJy4vaW1hZ2VzL0JhY2tncm91bmRUZXJyYWluJHtiYWNrZ3JvdW5kfS5qcGdgO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJydXNoID0gYnJ1c2g7XG5mdW5jdGlvbiBicnVzaChicnVzaFR5cGUsIHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIHN3aXRjaCAoYnJ1c2hUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJjcm9zc1wiOlxuICAgICAgICAgICAgYnJ1c2hDcm9zcyhzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib3hcIjpcbiAgICAgICAgICAgIGJydXNoQm94KHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgY2FzZSBcInBvaW50XCI6XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5mdW5jdGlvbiBicnVzaENyb3NzKHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHNxdWFyZXNBcnJheS5pbmRleE9mKGUpO1xuICAgIC8vIFVwL0Rvd24uXG4gICAgY29uc3QgYWJvdmVJbmRleCA9IGN1cnJlbnRJbmRleCAtIGNvbHM7XG4gICAgaWYgKGFib3ZlSW5kZXggPj0gMClcbiAgICAgICAgc3F1YXJlc1thYm92ZUluZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICBjb25zdCBiZWxvd0luZGV4ID0gY3VycmVudEluZGV4ICsgY29scztcbiAgICBpZiAoYmVsb3dJbmRleCA8IHNxdWFyZXMubGVuZ3RoKVxuICAgICAgICBzcXVhcmVzW2JlbG93SW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIC8vIExlZnQvUmlnaHQuXG4gICAgY29uc3QgYmVmb3JlSW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuICAgIGlmIChiZWZvcmVJbmRleCA+PSAwICYmIGJlZm9yZUluZGV4ICUgY29scyAhPT0gKGNvbHMgLSAxKSlcbiAgICAgICAgc3F1YXJlc1tiZWZvcmVJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgY29uc3QgYWZ0ZXJJbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XG4gICAgaWYgKGFmdGVySW5kZXggPCBzcXVhcmVzLmxlbmd0aCAmJiBhZnRlckluZGV4ICUgY29scyAhPT0gMClcbiAgICAgICAgc3F1YXJlc1thZnRlckluZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAvLyBjb25zb2xlLmxvZygnYmVmb3JlSW5kZXg6ICcsIGJlZm9yZUluZGV4LCAnYWZ0ZXJJbmRleDonLCBhZnRlckluZGV4LCAnTW9kOiAnLCBiZWZvcmVJbmRleCAlIGNvbHMsIChjb2xzLTEpKTtcbn1cbmZ1bmN0aW9uIGJydXNoQm94KHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHNxdWFyZXNBcnJheS5pbmRleE9mKGUpO1xuICAgIC8vIFVwL0Rvd24uXG4gICAgY29uc3QgYWJvdmVJbmRleCA9IGN1cnJlbnRJbmRleCAtIGNvbHM7XG4gICAgaWYgKGFib3ZlSW5kZXggLSAxID49IDApIHtcbiAgICAgICAgc3F1YXJlc1thYm92ZUluZGV4IC0gMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIHNxdWFyZXNbYWJvdmVJbmRleCArIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBjb25zdCBiZWxvd0luZGV4ID0gY3VycmVudEluZGV4ICsgY29scztcbiAgICBpZiAoYmVsb3dJbmRleCArIDEgPCBzcXVhcmVzLmxlbmd0aCkge1xuICAgICAgICBzcXVhcmVzW2JlbG93SW5kZXggLSAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgc3F1YXJlc1tiZWxvd0luZGV4ICsgMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGJydXNoQ3Jvc3Moc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVHcmlkID0gY3JlYXRlR3JpZDtcbmV4cG9ydHMuYWRkU3F1YXJlTGlzdGVuZXJzID0gYWRkU3F1YXJlTGlzdGVuZXJzO1xuY29uc3QgQnJ1c2hfMSA9IHJlcXVpcmUoXCIuL0JydXNoXCIpO1xuY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLWNvbnRhaW5lcicpO1xuLy8gbGV0IGlzTW91c2VEb3duID0gZmFsc2U7XG4vLyBsZXQgc3RhcnRTcXVhcmU6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4vLyBsZXQgc2VsZWN0ZWRTcXVhcmVzOiBTZXQ8SFRNTEVsZW1lbnQ+ID0gbmV3IFNldCgpOyAvLyBVc2lhbW8gdW4gU2V0IHBlciBldml0YXJlIGR1cGxpY2F0aVxuLy8gbGV0IGlzRHJhZ2dpbmdSaWdodENsaWNrID0gZmFsc2U7XG4vLyBGdW56aW9uZSBwZXIgY3JlYXJlIGxhIGdyaWdsaWEgY29uIGFubm90YXppb25pIGRpIHRpcG9cbmZ1bmN0aW9uIGNyZWF0ZUdyaWQocm93cywgY29scywgYnJ1c2hUeXBlKSB7XG4gICAgLy8gUHVsaXNjZSBpbCBjb250ZW51dG8gcHJlY2VkZW50ZSBkZWwgY29udGVuaXRvcmVcbiAgICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIC8vIEltcG9zdGEgaSB0ZW1wbGF0ZSBwZXIgbGUgcmlnaGUgZSBsZSBjb2xvbm5lIGRlbGxhIGdyaWdsaWEgQ1NTXG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS5ncmlkVGVtcGxhdGVSb3dzID0gYHJlcGVhdCgke3Jvd3N9LCAxZnIpYDtcbiAgICBncmlkQ29udGFpbmVyLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7Y29sc30sIDFmcilgO1xuICAgIC8vIENhbGNvbGEgbGEgbGFyZ2hlenphIGRlbCBjb250ZW5pdG9yZSBpbiBiYXNlIGFsIG51bWVybyBkaSBjb2xvbm5lIGUgYWxsYSBkaW1lbnNpb25lIGRlaSBxdWFkcmF0aSArIGJvcmRpXG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke2NvbHMgKiA1MiAtIDF9cHhgOyAvLyBBc3N1bWVuZG8gY2hlIG9nbmkgcXVhZHJhdG8gc2lhIDUwcHggKyAycHggZGkgYm9yZG8gdG90YWxlXG4gICAgLy8gQ3JlYSBpIHNpbmdvbGkgcXVhZHJhdGkgZGVsbGEgZ3JpZ2xpYVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93cyAqIGNvbHM7IGkrKykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICB9XG4gICAgLy8gQWN0aXZlIGV2ZXJ5IHNxdWFyZSBzZWxlY3RlZC5cbiAgICBhZGRTcXVhcmVMaXN0ZW5lcnMoYnJ1c2hUeXBlLCBjb2xzKTtcbiAgICAvLyBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJykpKTtcbn1cbmxldCBpc01vdXNlRG93biA9IGZhbHNlO1xubGV0IHN0YXJ0U3F1YXJlID0gbnVsbDtcbmxldCBzZWxlY3RlZFNxdWFyZXMgPSBuZXcgU2V0KCk7XG5sZXQgaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgPSBmYWxzZTtcbi8vIFZhcmlhYmlsaSBnbG9iYWxpIHBlciBtZW1vcml6emFyZSBpIHJpZmVyaW1lbnRpIGFpIGxpc3RlbmVyXG5sZXQgc3F1YXJlTGlzdGVuZXJSZWYgPSBudWxsO1xubGV0IHNxdWFyZU92ZXJMaXN0ZW5lclJlZiA9IG51bGw7XG5sZXQgc3F1YXJlVXBMaXN0ZW5lclJlZiA9IG51bGw7XG4vLyBGdW56aW9uZSBwZXIgcmltdW92ZXJlIHR1dHRpIGkgdmVjY2hpIGxpc3RlbmVyXG5mdW5jdGlvbiByZW1vdmVPbGRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZScpO1xuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xuICAgICAgICBpZiAoc3F1YXJlTGlzdGVuZXJSZWYpIHtcbiAgICAgICAgICAgIHNxdWFyZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzcXVhcmVMaXN0ZW5lclJlZik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNxdWFyZU92ZXJMaXN0ZW5lclJlZikge1xuICAgICAgICAgICAgc3F1YXJlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHNxdWFyZU92ZXJMaXN0ZW5lclJlZik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoc3F1YXJlVXBMaXN0ZW5lclJlZikge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgc3F1YXJlVXBMaXN0ZW5lclJlZik7XG4gICAgfVxufVxuLy8gRnVuemlvbmUgcHJpbmNpcGFsZSBwZXIgYWdnaXVuZ2VyZSBudW92aSBsaXN0ZW5lclxuZnVuY3Rpb24gYWRkU3F1YXJlTGlzdGVuZXJzKGJydXNoVHlwZSwgY29scykge1xuICAgIC8vIFJpbXVvdmUgaSB2ZWNjaGkgbGlzdGVuZXIgcHJpbWEgZGkgYXBwbGljYXJlIGkgbnVvdmlcbiAgICByZW1vdmVPbGRMaXN0ZW5lcnMoKTtcbiAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlJyk7XG4gICAgY29uc3Qgc3F1YXJlc0FycmF5ID0gQXJyYXkuZnJvbShzcXVhcmVzKTtcbiAgICAvLyBEaWNoaWFyYXppb25lIGRlaSBsaXN0ZW5lciBjb24gdW4gbm9tZSwgaW4gbW9kbyBjaGUgcG9zc2FubyBlc3NlcmUgcmltb3NzaVxuICAgIHNxdWFyZUxpc3RlbmVyUmVmID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoZS5idXR0b24gPT09IDIpIHtcbiAgICAgICAgICAgIGlzRHJhZ2dpbmdSaWdodENsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgKDAsIEJydXNoXzEuYnJ1c2gpKGJydXNoVHlwZSwgc3F1YXJlc0FycmF5LCBlLnRhcmdldCwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBzdGFydFNxdWFyZSA9IGUudGFyZ2V0O1xuICAgICAgICBpc01vdXNlRG93biA9IHRydWU7XG4gICAgICAgIHNlbGVjdGVkU3F1YXJlcy5jbGVhcigpO1xuICAgICAgICBzZWxlY3RlZFNxdWFyZXMuYWRkKGUudGFyZ2V0KTtcbiAgICB9O1xuICAgIHNxdWFyZU92ZXJMaXN0ZW5lclJlZiA9IChlKSA9PiB7XG4gICAgICAgIGlmICghaXNNb3VzZURvd24gfHwgIXN0YXJ0U3F1YXJlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBjdXJyZW50U3F1YXJlID0gZS50YXJnZXQ7XG4gICAgICAgIGlmIChjdXJyZW50U3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygnZ3JpZC1zcXVhcmUnKSAmJiAhc2VsZWN0ZWRTcXVhcmVzLmhhcyhjdXJyZW50U3F1YXJlKSkge1xuICAgICAgICAgICAgaWYgKGlzRHJhZ2dpbmdSaWdodENsaWNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnLCAnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICgwLCBCcnVzaF8xLmJydXNoKShicnVzaFR5cGUsIHNxdWFyZXNBcnJheSwgY3VycmVudFNxdWFyZSwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICAgICAgY3VycmVudFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGVjdGVkU3F1YXJlcy5hZGQoY3VycmVudFNxdWFyZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYnJ1c2hUeXBlIGxpc3RlbmVyOiAnLCBicnVzaFR5cGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBzcXVhcmVVcExpc3RlbmVyUmVmID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChpc0RyYWdnaW5nUmlnaHRDbGljayB8fCBpc01vdXNlRG93bikge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlzRHJhZ2dpbmdSaWdodENsaWNrID0gZmFsc2U7XG4gICAgICAgICAgICBpc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICAgICAgc3RhcnRTcXVhcmUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvLyBBcHBsaWNhemlvbmUgZGVpIG51b3ZpIGxpc3RlbmVyXG4gICAgc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiB7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzcXVhcmVMaXN0ZW5lclJlZik7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBzcXVhcmVPdmVyTGlzdGVuZXJSZWYpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzcXVhcmVVcExpc3RlbmVyUmVmKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zYXZlTWFwVG9Mb2NhbFN0b3JhZ2UgPSBzYXZlTWFwVG9Mb2NhbFN0b3JhZ2U7XG5leHBvcnRzLmxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlID0gbG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2U7XG5leHBvcnRzLmdldFNhdmVkTWFwTmFtZXMgPSBnZXRTYXZlZE1hcE5hbWVzO1xuZXhwb3J0cy5yZW1vdmVNYXBGcm9tTG9jYWxTdG9yYWdlID0gcmVtb3ZlTWFwRnJvbUxvY2FsU3RvcmFnZTtcbi8vIEZpbHRlciBtYXAgbmFtZSBmb3IgdGVjaG5pY2FsIElELlxuY29uc3QgbWFwTmFtZUZuID0gKG1hcE5hbWUpID0+IG1hcE5hbWUucmVwbGFjZUFsbCgnICcsICcnKTtcbmZ1bmN0aW9uIHNhdmVNYXBUb0xvY2FsU3RvcmFnZShncmlkQ29udGFpbmVyLCBtYXBOYW1lLCBncmlkUm93cywgZ3JpZENvbHMpIHtcbiAgICBjb25zdCBzcXVhcmVzID0gQXJyYXkuZnJvbShncmlkQ29udGFpbmVyLmNoaWxkcmVuKTtcbiAgICBjb25zdCBtYXBEYXRhID0ge1xuICAgICAgICByb3dzOiBncmlkUm93cyxcbiAgICAgICAgY29sczogZ3JpZENvbHMsXG4gICAgICAgIHNxdWFyZXM6IHNxdWFyZXMubWFwKHNxdWFyZSA9PiAoe1xuICAgICAgICAgICAgczogc3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcbiAgICAgICAgfSkpXG4gICAgfTtcbiAgICBjb25zdCBtYXBOYW1lRmlsdGVyZWQgPSBtYXBOYW1lRm4obWFwTmFtZSk7XG4gICAgLy8gQWRkIG9wdGlvbiB0byBzYXZlZCBtYXBzLlxuICAgIGNvbnN0IG1hcE5hbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1uYW1lcycpO1xuICAgIGNvbnN0IG5ld09wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG5ld09wdGlvbi52YWx1ZSA9IG1hcE5hbWVGaWx0ZXJlZDsgLy8gSWwgdmFsb3JlIGVmZmV0dGl2byBkZWxsJ29wemlvbmVcbiAgICBuZXdPcHRpb24udGV4dENvbnRlbnQgPSBtYXBOYW1lOyAvLyBJbCB0ZXN0byB2aXNpYmlsZSBhbGwndXRlbnRlXG4gICAgbWFwTmFtZXMuYXBwZW5kQ2hpbGQobmV3T3B0aW9uKTtcbiAgICAvLyBTYXZlIHRoZSBtYXAgZGF0YSB1bmRlciBhIHVuaXF1ZSBrZXlcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgc2F2ZWRNYXBfJHttYXBOYW1lRmlsdGVyZWR9YCwgSlNPTi5zdHJpbmdpZnkobWFwRGF0YSkpO1xuICAgIC8vIEdldCBhbmQgdXBkYXRlIHRoZSBsaXN0IG9mIHNhdmVkIG1hcCBuYW1lc1xuICAgIGxldCBtYXBOYW1lc0FycmF5ID0gW107XG4gICAgY29uc3Qgc2F2ZWROYW1lcyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtYXBOYW1lcycpO1xuICAgIGlmIChzYXZlZE5hbWVzKSB7XG4gICAgICAgIG1hcE5hbWVzQXJyYXkgPSBKU09OLnBhcnNlKHNhdmVkTmFtZXMpO1xuICAgIH1cbiAgICAvLyBBZGQgdGhlIG5ldyBtYXAgbmFtZSBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgaWYgKCFtYXBOYW1lc0FycmF5LmluY2x1ZGVzKG1hcE5hbWUpKSB7XG4gICAgICAgIG1hcE5hbWVzQXJyYXkucHVzaChtYXBOYW1lKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ21hcE5hbWVzJywgSlNPTi5zdHJpbmdpZnkobWFwTmFtZXNBcnJheSkpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgTWFwIFwiJHttYXBOYW1lfVwiIHNhdmVkIHN1Y2Nlc3NmdWxseS5gKTtcbn1cbmZ1bmN0aW9uIGxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlKG1hcE5hbWUpIHtcbiAgICBjb25zdCBtYXBOYW1lRmlsdGVyZWQgPSBtYXBOYW1lRm4obWFwTmFtZSk7XG4gICAgY29uc3Qgc2VyaWFsaXplZE1hcCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGBzYXZlZE1hcF8ke21hcE5hbWVGaWx0ZXJlZH1gKTtcbiAgICBpZiAoc2VyaWFsaXplZE1hcCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbWFwRGF0YSA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZE1hcCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgTWFwIFwiJHttYXBOYW1lfVwiIGxvYWRlZCBzdWNjZXNzZnVsbHkuYCk7XG4gICAgICAgICAgICByZXR1cm4gbWFwRGF0YTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZGVzZXJpYWxpemluZyBkYXRhLicsIGUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdObyBzYXZlZCBtYXAgZm91bmQgd2l0aCB0aGF0IG5hbWUuJyk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cbi8vIGZ1bmN0aW9uIGxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlKGdyaWRDb250YWluZXI6IEhUTUxFbGVtZW50LCBtYXBOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbi8vICAgLy8gUmVjdXBlcmEgbGEgc3RyaW5nYSBzZXJpYWxpenphdGFcbi8vICAgY29uc3Qgc2VyaWFsaXplZE1hcCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlZE1hcF8nICsgbWFwTmFtZUZuKG1hcE5hbWUpKTtcbi8vXG4vLyAgIGlmIChzZXJpYWxpemVkTWFwKSB7XG4vLyAgICAgdHJ5IHtcbi8vICAgICAgIC8vIERlc2VyaWFsaXp6YSBsYSBzdHJpbmdhIGluIHVuIGFycmF5IGRpIG9nZ2V0dGlcbi8vICAgICAgIGNvbnN0IG1hcERhdGE6IFNxdWFyZVN0YXRlW10gPSBKU09OLnBhcnNlKHNlcmlhbGl6ZWRNYXApO1xuLy8gICAgICAgY29uc3Qgc3F1YXJlcyA9IEFycmF5LmZyb20oZ3JpZENvbnRhaW5lci5jaGlsZHJlbikgYXMgSFRNTEVsZW1lbnRbXTtcbi8vXG4vLyAgICAgICAvLyBBc3NpY3VyYXRpIGNoZSBsZSBkaW1lbnNpb25pIGRlbGxhIGdyaWdsaWEgY29ycmlzcG9uZGFubyBhaSBkYXRpIHNhbHZhdGlcbi8vICAgICAgIGlmIChtYXBEYXRhLmxlbmd0aCA9PT0gc3F1YXJlcy5sZW5ndGgpIHtcbi8vICAgICAgICAgLy8gQXBwbGljYSBsbyBzdGF0byBzYWx2YXRvIGEgb2duaSBxdWFkcmF0byBkZWxsYSBncmlnbGlhXG4vLyAgICAgICAgIG1hcERhdGEuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbi8vICAgICAgICAgICBpZiAoZGF0YS5zKSB7XG4vLyAgICAgICAgICAgICBzcXVhcmVzW2luZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbi8vICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgc3F1YXJlc1tpbmRleF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9KTtcbi8vICAgICAgICAgY29uc29sZS5sb2coJ01hcHBhIGNhcmljYXRhIGNvbiBzdWNjZXNzby4nKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIGNvbnNvbGUud2FybignTGUgZGltZW5zaW9uaSBkZWxsYSBncmlnbGlhIG5vbiBjb3JyaXNwb25kb25vIGFpIGRhdGkgc2FsdmF0aS4nKTtcbi8vICAgICAgIH1cbi8vICAgICB9IGNhdGNoIChlKSB7XG4vLyAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcmUgZHVyYW50ZSBsYSBkZXNlcmlhbGl6emF6aW9uZSBkZWkgZGF0aS4nLCBlKTtcbi8vICAgICB9XG4vLyAgIH0gZWxzZSB7XG4vLyAgICAgY29uc29sZS5sb2coJ05lc3N1bmEgbWFwcGEgc2FsdmF0YSB0cm92YXRhLicpO1xuLy8gICB9XG4vLyB9XG5mdW5jdGlvbiBnZXRTYXZlZE1hcE5hbWVzKCkge1xuICAgIGNvbnN0IHNhdmVkTmFtZXMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbWFwTmFtZXMnKTtcbiAgICBpZiAoc2F2ZWROYW1lcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2Uoc2F2ZWROYW1lcyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlYWRpbmcgc2F2ZWQgbWFwIG5hbWVzIGxpc3QuJywgZSk7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdO1xufVxuZnVuY3Rpb24gcmVtb3ZlTWFwRnJvbUxvY2FsU3RvcmFnZShtYXBOYW1lKSB7XG4gICAgY29uc3QgbWFwTmFtZUZpbHRlcmVkID0gbWFwTmFtZUZuKG1hcE5hbWUpO1xuICAgIC8vIFJlbW92ZSB0aGUgbWFwIGRhdGEgaXRzZWxmXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oYHNhdmVkTWFwXyR7bWFwTmFtZUZpbHRlcmVkfWApO1xuICAgIC8vIEdldCBhbmQgdXBkYXRlIHRoZSBsaXN0IG9mIHNhdmVkIG1hcCBuYW1lc1xuICAgIGxldCBtYXBOYW1lcyA9IFtdO1xuICAgIGNvbnN0IHNhdmVkTmFtZXMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbWFwTmFtZXMnKTtcbiAgICBpZiAoc2F2ZWROYW1lcykge1xuICAgICAgICBtYXBOYW1lcyA9IEpTT04ucGFyc2Uoc2F2ZWROYW1lcyk7XG4gICAgfVxuICAgIC8vIEZpbHRlciBvdXQgdGhlIG5hbWUgdG8gYmUgcmVtb3ZlZFxuICAgIGNvbnN0IHVwZGF0ZWRNYXBOYW1lcyA9IG1hcE5hbWVzLmZpbHRlcihuYW1lID0+IG5hbWUgIT09IG1hcE5hbWUpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtYXBOYW1lcycsIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRNYXBOYW1lcykpO1xuICAgIGNvbnNvbGUubG9nKGBNYXAgXCIke21hcE5hbWV9XCIgcmVtb3ZlZCBzdWNjZXNzZnVsbHkuYCk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHJhbmRvbWl6ZVNxdWFyZTtcbi8vIEZ1bnppb25lIHBlciByYW5kb21penphcmUgdW4gcXVhZHJhdG8gY29uIGFubm90YXppb25pIGRpIHRpcG9cbmZ1bmN0aW9uIHJhbmRvbWl6ZVNxdWFyZSgpIHtcbiAgICAvLyBTZWxlemlvbmEgdHV0dGkgZ2xpIGVsZW1lbnRpIGNvbiBsYSBjbGFzc2UgJ2dyaWQtc3F1YXJlJ1xuICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUuYWN0aXZlJyk7XG4gICAgLy8gVmVyaWZpY2Egc2UgY2kgc29ubyBxdWFkcmF0aSBuZWxsYSBncmlnbGlhXG4gICAgaWYgKHNxdWFyZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGFsZXJ0KCdQZXIgZmF2b3JlLCBjcmVhIHByaW1hIHVuYSBncmlnbGlhIScpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFJpbXVvdmUgbGEgY2xhc3NlICdzZWxlY3RlZCcgZGEgdHV0dGkgaSBxdWFkcmF0aSBwZXIgZGVzZWxlemlvbmFyZSBxdWVsbG8gcHJlY2VkZW50ZW1lbnRlIGV2aWRlbnppYXRvXG4gICAgc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKSk7XG4gICAgLy8gQ2FsY29sYSB1biBpbmRpY2UgY2FzdWFsZSBhbGwnaW50ZXJubyBkZWxsJ2FycmF5IGRpIHF1YWRyYXRpXG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzcXVhcmVzLmxlbmd0aCk7XG4gICAgLy8gQWdnaXVuZ2UgbGEgY2xhc3NlICdzZWxlY3RlZCcgYWwgcXVhZHJhdG8gc2NlbHRvIGNhc3VhbG1lbnRlXG4gICAgc3F1YXJlc1tyYW5kb21JbmRleF0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcmFuZG9taXplU3F1YXJlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZnVuY3Rpb25zL3JhbmRvbWl6ZVNxdWFyZVwiKSk7XG5jb25zdCBHcmlkXzEgPSByZXF1aXJlKFwiLi9mdW5jdGlvbnMvR3JpZFwiKTtcbmNvbnN0IFNhdmVfMSA9IHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9TYXZlXCIpO1xuY29uc3QgQmFja2dyb3VuZF8xID0gcmVxdWlyZShcIi4vZnVuY3Rpb25zL0JhY2tncm91bmRcIik7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGxldCBicnVzaFR5cGUgPSAnY3Jvc3MnO1xuICAgIGxldCBncmlkQ29scyA9IDE1O1xuICAgIGxldCBncmlkUm93cyA9IDE1O1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1jb250YWluZXInKTtcbiAgICAvLyBBY3RpdmUgZXZlcnkgc3F1YXJlIHNlbGVjdGVkLlxuICAgIGNvbnN0IGNyZWF0ZUdyaWRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JlYXRlLWdyaWQtYnRuJyk7XG4gICAgY3JlYXRlR3JpZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgZ3JpZFJvd3MgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1yYW5nZS1yb3dzJykudmFsdWUpO1xuICAgICAgICBncmlkQ29scyA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLXJhbmdlJykudmFsdWUpO1xuICAgICAgICAoMCwgR3JpZF8xLmNyZWF0ZUdyaWQpKGdyaWRSb3dzLCBncmlkQ29scywgYnJ1c2hUeXBlKTtcbiAgICAgICAgY3JlYXRlR3JpZEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NsZWFyLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAoMCwgR3JpZF8xLmNyZWF0ZUdyaWQpKGdyaWRSb3dzLCBncmlkQ29scywgYnJ1c2hUeXBlKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1yYW5nZS1yb3dzJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgZ3JpZFJvd3MgPSBwYXJzZUludCgoZT8udGFyZ2V0KS52YWx1ZSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLWxhYmVsJykuaW5uZXJUZXh0ID0gZ3JpZENvbHMgKyAneCcgKyBncmlkUm93cztcbiAgICAgICAgY3JlYXRlR3JpZEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLXJhbmdlJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgZ3JpZENvbHMgPSBwYXJzZUludCgoZT8udGFyZ2V0KS52YWx1ZSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLWxhYmVsJykuaW5uZXJUZXh0ID0gZ3JpZENvbHMgKyAneCcgKyBncmlkUm93cztcbiAgICAgICAgY3JlYXRlR3JpZEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYW5kb21pemUtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByYW5kb21pemVTcXVhcmVfMS5kZWZhdWx0KTtcbiAgICAvLyBDaGlhbWEgbGEgZnVuemlvbmUgZGkgcmFuZG9taXp6YXppb25lIGFsIGNsaWNrIGRlbCBwdWxzYW50ZS5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F2ZS1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFwTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtbmFtZScpLnZhbHVlO1xuICAgICAgICAoMCwgU2F2ZV8xLnNhdmVNYXBUb0xvY2FsU3RvcmFnZSkoZ3JpZENvbnRhaW5lciwgbWFwTmFtZSwgZ3JpZFJvd3MsIGdyaWRDb2xzKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZC1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFwTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtbmFtZXMnKS52YWx1ZTtcbiAgICAgICAgY29uc3QgbWFwRGF0YSA9ICgwLCBTYXZlXzEubG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2UpKG1hcE5hbWUpO1xuICAgICAgICBncmlkUm93cyA9IG1hcERhdGE/LnJvd3MgPz8gZ3JpZFJvd3M7XG4gICAgICAgIGdyaWRDb2xzID0gbWFwRGF0YT8uY29scyA/PyBncmlkQ29scztcbiAgICAgICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG4gICAgICAgIC8vIEFwcGxpY2EgbG8gc3RhdG8gc2FsdmF0byBhIG9nbmkgcXVhZHJhdG8gZGVsbGEgZ3JpZ2xpYVxuICAgICAgICBjb25zdCBzcXVhcmVzID0gQXJyYXkuZnJvbShncmlkQ29udGFpbmVyLmNoaWxkcmVuKTtcbiAgICAgICAgbWFwRGF0YT8uc3F1YXJlcz8uZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLnMpIHtcbiAgICAgICAgICAgICAgICBzcXVhcmVzW2luZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNxdWFyZXNbaW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cImJydXNoLW9wdGlvbnNcIl0nKSkuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGJydXNoVHlwZSA9IChlPy50YXJnZXQpLnZhbHVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2JydXNoVHlwZTogJywgYnJ1c2hUeXBlKTtcbiAgICAgICAgICAgICgwLCBHcmlkXzEuYWRkU3F1YXJlTGlzdGVuZXJzKShicnVzaFR5cGUsIGdyaWRDb2xzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJiYWNrLW9wdGlvbnNcIl0nKSkuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+ICgwLCBCYWNrZ3JvdW5kXzEuYmFjaykoZ3JpZENvbnRhaW5lciwgKGU/LnRhcmdldCkudmFsdWUpKTtcbiAgICB9KTtcbiAgICBncmlkQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgKGUpID0+IGUucHJldmVudERlZmF1bHQoKSk7XG4gICAgLy8gQ3JlYSB1bmEgZ3JpZ2xpYSBkaSBkaW1lbnNpb25pIHByZWRlZmluaXRlIGFsbCdhdnZpbyBkZWxsYSBwYWdpbmFcbiAgICAoMCwgR3JpZF8xLmNyZWF0ZUdyaWQpKGdyaWRSb3dzLCBncmlkQ29scywgYnJ1c2hUeXBlKTtcbn0pO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9