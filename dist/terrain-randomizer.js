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
        console.log('aboveIndex: ', currentIndex + 1, cols, ((currentIndex + 1) % cols));
    }
    const belowIndex = currentIndex + cols;
    // Down (left/right).
    if ((belowIndex + 1) < squares.length) {
        if ((currentIndex % cols) !== 0)
            squares[belowIndex - 1].classList.add('active');
        if (((currentIndex + 1) % cols) !== 0)
            squares[belowIndex + 1].classList.add('active');
        console.log('belowIndex: ', currentIndex, cols, (currentIndex % cols));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7VUNsRkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvQmFja2dyb3VuZC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL0JydXNoLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvR3JpZC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL1NhdmUudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9yYW5kb21pemVTcXVhcmUudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJhY2sgPSBiYWNrO1xuZnVuY3Rpb24gYmFjayhncmlkQ29udGFpbmVyLCBiYWNrVHlwZSkge1xuICAgIGxldCBiYWNrZ3JvdW5kID0gMTtcbiAgICBzd2l0Y2ggKGJhY2tUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJyb2NrXCI6XG4gICAgICAgICAgICBiYWNrZ3JvdW5kID0gMjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwid29vZFwiOlxuICAgICAgICAgICAgYmFja2dyb3VuZCA9IDM7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCcuL2ltYWdlcy9CYWNrZ3JvdW5kVGVycmFpbiR7YmFja2dyb3VuZH0uanBnYDtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5icnVzaCA9IGJydXNoO1xuZnVuY3Rpb24gYnJ1c2goYnJ1c2hUeXBlLCBzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpIHtcbiAgICBzd2l0Y2ggKGJydXNoVHlwZSkge1xuICAgICAgICBjYXNlIFwiY3Jvc3NcIjpcbiAgICAgICAgICAgIGJydXNoQ3Jvc3Moc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm94XCI6XG4gICAgICAgICAgICBicnVzaEJveChzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNhc2UgXCJwb2ludFwiOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuZnVuY3Rpb24gYnJ1c2hDcm9zcyhzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpIHtcbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSBzcXVhcmVzQXJyYXkuaW5kZXhPZihlKTtcbiAgICAvLyBVcC9Eb3duLlxuICAgIGNvbnN0IGFib3ZlSW5kZXggPSBjdXJyZW50SW5kZXggLSBjb2xzO1xuICAgIGlmIChhYm92ZUluZGV4ID49IDApXG4gICAgICAgIHNxdWFyZXNbYWJvdmVJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgY29uc3QgYmVsb3dJbmRleCA9IGN1cnJlbnRJbmRleCArIGNvbHM7XG4gICAgaWYgKGJlbG93SW5kZXggPCBzcXVhcmVzLmxlbmd0aClcbiAgICAgICAgc3F1YXJlc1tiZWxvd0luZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAvLyBMZWZ0L1JpZ2h0LlxuICAgIGNvbnN0IGJlZm9yZUluZGV4ID0gY3VycmVudEluZGV4IC0gMTtcbiAgICBpZiAoYmVmb3JlSW5kZXggPj0gMCAmJiBiZWZvcmVJbmRleCAlIGNvbHMgIT09IChjb2xzIC0gMSkpXG4gICAgICAgIHNxdWFyZXNbYmVmb3JlSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIGNvbnN0IGFmdGVySW5kZXggPSBjdXJyZW50SW5kZXggKyAxO1xuICAgIGlmIChhZnRlckluZGV4IDwgc3F1YXJlcy5sZW5ndGggJiYgYWZ0ZXJJbmRleCAlIGNvbHMgIT09IDApXG4gICAgICAgIHNxdWFyZXNbYWZ0ZXJJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgLy8gY29uc29sZS5sb2coJ2JlZm9yZUluZGV4OiAnLCBiZWZvcmVJbmRleCwgJ2FmdGVySW5kZXg6JywgYWZ0ZXJJbmRleCwgJ01vZDogJywgYmVmb3JlSW5kZXggJSBjb2xzLCAoY29scy0xKSk7XG59XG5mdW5jdGlvbiBicnVzaEJveChzcXVhcmVzQXJyYXksIGUsIHNxdWFyZXMsIGNvbHMpIHtcbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSBzcXVhcmVzQXJyYXkuaW5kZXhPZihlKTtcbiAgICAvLyBVcC9Eb3duLlxuICAgIGNvbnN0IGFib3ZlSW5kZXggPSBjdXJyZW50SW5kZXggLSBjb2xzO1xuICAgIC8vIFVwIChsZWZ0L3JpZ2h0KS5cbiAgICBpZiAoYWJvdmVJbmRleCAtIDEgPj0gMCkge1xuICAgICAgICBpZiAoKGN1cnJlbnRJbmRleCAlIGNvbHMpICE9PSAwKVxuICAgICAgICAgICAgc3F1YXJlc1thYm92ZUluZGV4IC0gMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIGlmICgoKGN1cnJlbnRJbmRleCArIDEpICUgY29scykgIT09IDApXG4gICAgICAgICAgICBzcXVhcmVzW2Fib3ZlSW5kZXggKyAxXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2Fib3ZlSW5kZXg6ICcsIGN1cnJlbnRJbmRleCArIDEsIGNvbHMsICgoY3VycmVudEluZGV4ICsgMSkgJSBjb2xzKSk7XG4gICAgfVxuICAgIGNvbnN0IGJlbG93SW5kZXggPSBjdXJyZW50SW5kZXggKyBjb2xzO1xuICAgIC8vIERvd24gKGxlZnQvcmlnaHQpLlxuICAgIGlmICgoYmVsb3dJbmRleCArIDEpIDwgc3F1YXJlcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKChjdXJyZW50SW5kZXggJSBjb2xzKSAhPT0gMClcbiAgICAgICAgICAgIHNxdWFyZXNbYmVsb3dJbmRleCAtIDFdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICBpZiAoKChjdXJyZW50SW5kZXggKyAxKSAlIGNvbHMpICE9PSAwKVxuICAgICAgICAgICAgc3F1YXJlc1tiZWxvd0luZGV4ICsgMV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdiZWxvd0luZGV4OiAnLCBjdXJyZW50SW5kZXgsIGNvbHMsIChjdXJyZW50SW5kZXggJSBjb2xzKSk7XG4gICAgfVxuICAgIGJydXNoQ3Jvc3Moc3F1YXJlc0FycmF5LCBlLCBzcXVhcmVzLCBjb2xzKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVHcmlkID0gY3JlYXRlR3JpZDtcbmV4cG9ydHMuYWRkU3F1YXJlTGlzdGVuZXJzID0gYWRkU3F1YXJlTGlzdGVuZXJzO1xuY29uc3QgQnJ1c2hfMSA9IHJlcXVpcmUoXCIuL0JydXNoXCIpO1xuY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmlkLWNvbnRhaW5lcicpO1xuLy8gbGV0IGlzTW91c2VEb3duID0gZmFsc2U7XG4vLyBsZXQgc3RhcnRTcXVhcmU6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4vLyBsZXQgc2VsZWN0ZWRTcXVhcmVzOiBTZXQ8SFRNTEVsZW1lbnQ+ID0gbmV3IFNldCgpOyAvLyBVc2lhbW8gdW4gU2V0IHBlciBldml0YXJlIGR1cGxpY2F0aVxuLy8gbGV0IGlzRHJhZ2dpbmdSaWdodENsaWNrID0gZmFsc2U7XG4vLyBGdW56aW9uZSBwZXIgY3JlYXJlIGxhIGdyaWdsaWEgY29uIGFubm90YXppb25pIGRpIHRpcG9cbmZ1bmN0aW9uIGNyZWF0ZUdyaWQocm93cywgY29scywgYnJ1c2hUeXBlKSB7XG4gICAgLy8gUHVsaXNjZSBpbCBjb250ZW51dG8gcHJlY2VkZW50ZSBkZWwgY29udGVuaXRvcmVcbiAgICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIC8vIEltcG9zdGEgaSB0ZW1wbGF0ZSBwZXIgbGUgcmlnaGUgZSBsZSBjb2xvbm5lIGRlbGxhIGdyaWdsaWEgQ1NTXG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS5ncmlkVGVtcGxhdGVSb3dzID0gYHJlcGVhdCgke3Jvd3N9LCAxZnIpYDtcbiAgICBncmlkQ29udGFpbmVyLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7Y29sc30sIDFmcilgO1xuICAgIC8vIENhbGNvbGEgbGEgbGFyZ2hlenphIGRlbCBjb250ZW5pdG9yZSBpbiBiYXNlIGFsIG51bWVybyBkaSBjb2xvbm5lIGUgYWxsYSBkaW1lbnNpb25lIGRlaSBxdWFkcmF0aSArIGJvcmRpXG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke2NvbHMgKiA1MiAtIDF9cHhgOyAvLyBBc3N1bWVuZG8gY2hlIG9nbmkgcXVhZHJhdG8gc2lhIDUwcHggKyAycHggZGkgYm9yZG8gdG90YWxlXG4gICAgLy8gQ3JlYSBpIHNpbmdvbGkgcXVhZHJhdGkgZGVsbGEgZ3JpZ2xpYVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93cyAqIGNvbHM7IGkrKykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICB9XG4gICAgLy8gQWN0aXZlIGV2ZXJ5IHNxdWFyZSBzZWxlY3RlZC5cbiAgICBhZGRTcXVhcmVMaXN0ZW5lcnMoYnJ1c2hUeXBlLCBjb2xzKTtcbiAgICAvLyBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJykpKTtcbn1cbmxldCBpc01vdXNlRG93biA9IGZhbHNlO1xubGV0IHN0YXJ0U3F1YXJlID0gbnVsbDtcbmxldCBzZWxlY3RlZFNxdWFyZXMgPSBuZXcgU2V0KCk7XG5sZXQgaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgPSBmYWxzZTtcbi8vIFZhcmlhYmlsaSBnbG9iYWxpIHBlciBtZW1vcml6emFyZSBpIHJpZmVyaW1lbnRpIGFpIGxpc3RlbmVyXG5sZXQgc3F1YXJlTGlzdGVuZXJSZWYgPSBudWxsO1xubGV0IHNxdWFyZU92ZXJMaXN0ZW5lclJlZiA9IG51bGw7XG5sZXQgc3F1YXJlVXBMaXN0ZW5lclJlZiA9IG51bGw7XG4vLyBGdW56aW9uZSBwZXIgcmltdW92ZXJlIHR1dHRpIGkgdmVjY2hpIGxpc3RlbmVyXG5mdW5jdGlvbiByZW1vdmVPbGRMaXN0ZW5lcnMoKSB7XG4gICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZScpO1xuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xuICAgICAgICBpZiAoc3F1YXJlTGlzdGVuZXJSZWYpIHtcbiAgICAgICAgICAgIHNxdWFyZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzcXVhcmVMaXN0ZW5lclJlZik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNxdWFyZU92ZXJMaXN0ZW5lclJlZikge1xuICAgICAgICAgICAgc3F1YXJlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHNxdWFyZU92ZXJMaXN0ZW5lclJlZik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoc3F1YXJlVXBMaXN0ZW5lclJlZikge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgc3F1YXJlVXBMaXN0ZW5lclJlZik7XG4gICAgfVxufVxuLy8gRnVuemlvbmUgcHJpbmNpcGFsZSBwZXIgYWdnaXVuZ2VyZSBudW92aSBsaXN0ZW5lclxuZnVuY3Rpb24gYWRkU3F1YXJlTGlzdGVuZXJzKGJydXNoVHlwZSwgY29scykge1xuICAgIC8vIFJpbXVvdmUgaSB2ZWNjaGkgbGlzdGVuZXIgcHJpbWEgZGkgYXBwbGljYXJlIGkgbnVvdmlcbiAgICByZW1vdmVPbGRMaXN0ZW5lcnMoKTtcbiAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlJyk7XG4gICAgY29uc3Qgc3F1YXJlc0FycmF5ID0gQXJyYXkuZnJvbShzcXVhcmVzKTtcbiAgICAvLyBEaWNoaWFyYXppb25lIGRlaSBsaXN0ZW5lciBjb24gdW4gbm9tZSwgaW4gbW9kbyBjaGUgcG9zc2FubyBlc3NlcmUgcmltb3NzaVxuICAgIHNxdWFyZUxpc3RlbmVyUmVmID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoZS5idXR0b24gPT09IDIpIHtcbiAgICAgICAgICAgIGlzRHJhZ2dpbmdSaWdodENsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgKDAsIEJydXNoXzEuYnJ1c2gpKGJydXNoVHlwZSwgc3F1YXJlc0FycmF5LCBlLnRhcmdldCwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBzdGFydFNxdWFyZSA9IGUudGFyZ2V0O1xuICAgICAgICBpc01vdXNlRG93biA9IHRydWU7XG4gICAgICAgIHNlbGVjdGVkU3F1YXJlcy5jbGVhcigpO1xuICAgICAgICBzZWxlY3RlZFNxdWFyZXMuYWRkKGUudGFyZ2V0KTtcbiAgICB9O1xuICAgIHNxdWFyZU92ZXJMaXN0ZW5lclJlZiA9IChlKSA9PiB7XG4gICAgICAgIGlmICghaXNNb3VzZURvd24gfHwgIXN0YXJ0U3F1YXJlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBjdXJyZW50U3F1YXJlID0gZS50YXJnZXQ7XG4gICAgICAgIGlmIChjdXJyZW50U3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygnZ3JpZC1zcXVhcmUnKSAmJiAhc2VsZWN0ZWRTcXVhcmVzLmhhcyhjdXJyZW50U3F1YXJlKSkge1xuICAgICAgICAgICAgaWYgKGlzRHJhZ2dpbmdSaWdodENsaWNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnLCAnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICgwLCBCcnVzaF8xLmJydXNoKShicnVzaFR5cGUsIHNxdWFyZXNBcnJheSwgY3VycmVudFNxdWFyZSwgc3F1YXJlcywgY29scyk7XG4gICAgICAgICAgICAgICAgY3VycmVudFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGVjdGVkU3F1YXJlcy5hZGQoY3VycmVudFNxdWFyZSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnYnJ1c2hUeXBlIGxpc3RlbmVyOiAnLCBicnVzaFR5cGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBzcXVhcmVVcExpc3RlbmVyUmVmID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChpc0RyYWdnaW5nUmlnaHRDbGljayB8fCBpc01vdXNlRG93bikge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlzRHJhZ2dpbmdSaWdodENsaWNrID0gZmFsc2U7XG4gICAgICAgICAgICBpc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICAgICAgc3RhcnRTcXVhcmUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvLyBBcHBsaWNhemlvbmUgZGVpIG51b3ZpIGxpc3RlbmVyXG4gICAgc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiB7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzcXVhcmVMaXN0ZW5lclJlZik7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBzcXVhcmVPdmVyTGlzdGVuZXJSZWYpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzcXVhcmVVcExpc3RlbmVyUmVmKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zYXZlTWFwVG9Mb2NhbFN0b3JhZ2UgPSBzYXZlTWFwVG9Mb2NhbFN0b3JhZ2U7XG5leHBvcnRzLmxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlID0gbG9hZE1hcEZyb21Mb2NhbFN0b3JhZ2U7XG5leHBvcnRzLmdldFNhdmVkTWFwTmFtZXMgPSBnZXRTYXZlZE1hcE5hbWVzO1xuZXhwb3J0cy5yZW1vdmVNYXBGcm9tTG9jYWxTdG9yYWdlID0gcmVtb3ZlTWFwRnJvbUxvY2FsU3RvcmFnZTtcbi8vIEZpbHRlciBtYXAgbmFtZSBmb3IgdGVjaG5pY2FsIElELlxuY29uc3QgbWFwTmFtZUZuID0gKG1hcE5hbWUpID0+IG1hcE5hbWUucmVwbGFjZUFsbCgnICcsICcnKTtcbmZ1bmN0aW9uIHNhdmVNYXBUb0xvY2FsU3RvcmFnZShncmlkQ29udGFpbmVyLCBtYXBOYW1lLCBncmlkUm93cywgZ3JpZENvbHMsIGJhY2tUeXBlID0gJ2VhcnRoJykge1xuICAgIGNvbnN0IHNxdWFyZXMgPSBBcnJheS5mcm9tKGdyaWRDb250YWluZXIuY2hpbGRyZW4pO1xuICAgIGNvbnN0IG1hcERhdGEgPSB7XG4gICAgICAgIHJvd3M6IGdyaWRSb3dzLFxuICAgICAgICBjb2xzOiBncmlkQ29scyxcbiAgICAgICAgYmFjazogYmFja1R5cGUsXG4gICAgICAgIHNxdWFyZXM6IHNxdWFyZXMubWFwKHNxdWFyZSA9PiAoe1xuICAgICAgICAgICAgczogc3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcbiAgICAgICAgfSkpXG4gICAgfTtcbiAgICBjb25zdCBtYXBOYW1lRmlsdGVyZWQgPSBtYXBOYW1lRm4obWFwTmFtZSk7XG4gICAgLy8gQWRkIG9wdGlvbiB0byBzYXZlZCBtYXBzLlxuICAgIGNvbnN0IG1hcE5hbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1uYW1lcycpO1xuICAgIGNvbnN0IG5ld09wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG5ld09wdGlvbi52YWx1ZSA9IG1hcE5hbWVGaWx0ZXJlZDsgLy8gSWwgdmFsb3JlIGVmZmV0dGl2byBkZWxsJ29wemlvbmVcbiAgICBuZXdPcHRpb24udGV4dENvbnRlbnQgPSBtYXBOYW1lOyAvLyBJbCB0ZXN0byB2aXNpYmlsZSBhbGwndXRlbnRlXG4gICAgbWFwTmFtZXMuYXBwZW5kQ2hpbGQobmV3T3B0aW9uKTtcbiAgICAvLyBTYXZlIHRoZSBtYXAgZGF0YSB1bmRlciBhIHVuaXF1ZSBrZXlcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgc2F2ZWRNYXBfJHttYXBOYW1lRmlsdGVyZWR9YCwgSlNPTi5zdHJpbmdpZnkobWFwRGF0YSkpO1xuICAgIC8vIEdldCBhbmQgdXBkYXRlIHRoZSBsaXN0IG9mIHNhdmVkIG1hcCBuYW1lc1xuICAgIGxldCBtYXBOYW1lc0FycmF5ID0gW107XG4gICAgY29uc3Qgc2F2ZWROYW1lcyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtYXBOYW1lcycpO1xuICAgIGlmIChzYXZlZE5hbWVzKSB7XG4gICAgICAgIG1hcE5hbWVzQXJyYXkgPSBKU09OLnBhcnNlKHNhdmVkTmFtZXMpO1xuICAgIH1cbiAgICAvLyBBZGQgdGhlIG5ldyBtYXAgbmFtZSBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgaWYgKCFtYXBOYW1lc0FycmF5LmluY2x1ZGVzKG1hcE5hbWUpKSB7XG4gICAgICAgIG1hcE5hbWVzQXJyYXkucHVzaChtYXBOYW1lKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ21hcE5hbWVzJywgSlNPTi5zdHJpbmdpZnkobWFwTmFtZXNBcnJheSkpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgTWFwIFwiJHttYXBOYW1lfVwiIHNhdmVkIHN1Y2Nlc3NmdWxseS5gKTtcbn1cbmZ1bmN0aW9uIGxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlKG1hcE5hbWUpIHtcbiAgICBjb25zdCBtYXBOYW1lRmlsdGVyZWQgPSBtYXBOYW1lRm4obWFwTmFtZSk7XG4gICAgY29uc3Qgc2VyaWFsaXplZE1hcCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGBzYXZlZE1hcF8ke21hcE5hbWVGaWx0ZXJlZH1gKTtcbiAgICBpZiAoc2VyaWFsaXplZE1hcCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbWFwRGF0YSA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZE1hcCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgTWFwIFwiJHttYXBOYW1lfVwiIGxvYWRlZCBzdWNjZXNzZnVsbHkuYCk7XG4gICAgICAgICAgICByZXR1cm4gbWFwRGF0YTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZGVzZXJpYWxpemluZyBkYXRhLicsIGUpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdObyBzYXZlZCBtYXAgZm91bmQgd2l0aCB0aGF0IG5hbWUuJyk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cbi8vIGZ1bmN0aW9uIGxvYWRNYXBGcm9tTG9jYWxTdG9yYWdlKGdyaWRDb250YWluZXI6IEhUTUxFbGVtZW50LCBtYXBOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbi8vICAgLy8gUmVjdXBlcmEgbGEgc3RyaW5nYSBzZXJpYWxpenphdGFcbi8vICAgY29uc3Qgc2VyaWFsaXplZE1hcCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlZE1hcF8nICsgbWFwTmFtZUZuKG1hcE5hbWUpKTtcbi8vXG4vLyAgIGlmIChzZXJpYWxpemVkTWFwKSB7XG4vLyAgICAgdHJ5IHtcbi8vICAgICAgIC8vIERlc2VyaWFsaXp6YSBsYSBzdHJpbmdhIGluIHVuIGFycmF5IGRpIG9nZ2V0dGlcbi8vICAgICAgIGNvbnN0IG1hcERhdGE6IFNxdWFyZVN0YXRlW10gPSBKU09OLnBhcnNlKHNlcmlhbGl6ZWRNYXApO1xuLy8gICAgICAgY29uc3Qgc3F1YXJlcyA9IEFycmF5LmZyb20oZ3JpZENvbnRhaW5lci5jaGlsZHJlbikgYXMgSFRNTEVsZW1lbnRbXTtcbi8vXG4vLyAgICAgICAvLyBBc3NpY3VyYXRpIGNoZSBsZSBkaW1lbnNpb25pIGRlbGxhIGdyaWdsaWEgY29ycmlzcG9uZGFubyBhaSBkYXRpIHNhbHZhdGlcbi8vICAgICAgIGlmIChtYXBEYXRhLmxlbmd0aCA9PT0gc3F1YXJlcy5sZW5ndGgpIHtcbi8vICAgICAgICAgLy8gQXBwbGljYSBsbyBzdGF0byBzYWx2YXRvIGEgb2duaSBxdWFkcmF0byBkZWxsYSBncmlnbGlhXG4vLyAgICAgICAgIG1hcERhdGEuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcbi8vICAgICAgICAgICBpZiAoZGF0YS5zKSB7XG4vLyAgICAgICAgICAgICBzcXVhcmVzW2luZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbi8vICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgc3F1YXJlc1tpbmRleF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9KTtcbi8vICAgICAgICAgY29uc29sZS5sb2coJ01hcHBhIGNhcmljYXRhIGNvbiBzdWNjZXNzby4nKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIGNvbnNvbGUud2FybignTGUgZGltZW5zaW9uaSBkZWxsYSBncmlnbGlhIG5vbiBjb3JyaXNwb25kb25vIGFpIGRhdGkgc2FsdmF0aS4nKTtcbi8vICAgICAgIH1cbi8vICAgICB9IGNhdGNoIChlKSB7XG4vLyAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcmUgZHVyYW50ZSBsYSBkZXNlcmlhbGl6emF6aW9uZSBkZWkgZGF0aS4nLCBlKTtcbi8vICAgICB9XG4vLyAgIH0gZWxzZSB7XG4vLyAgICAgY29uc29sZS5sb2coJ05lc3N1bmEgbWFwcGEgc2FsdmF0YSB0cm92YXRhLicpO1xuLy8gICB9XG4vLyB9XG5mdW5jdGlvbiBnZXRTYXZlZE1hcE5hbWVzKCkge1xuICAgIGNvbnN0IHNhdmVkTmFtZXMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbWFwTmFtZXMnKTtcbiAgICBsZXQgc2F2ZWROYW1lc0FycmF5ID0gW107XG4gICAgaWYgKHNhdmVkTmFtZXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNhdmVkTmFtZXNBcnJheSA9IEpTT04ucGFyc2Uoc2F2ZWROYW1lcyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlYWRpbmcgc2F2ZWQgbWFwIG5hbWVzIGxpc3QuJywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWFwTmFtZXNTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWVzJyk7XG4gICAgICAgIHNhdmVkTmFtZXNBcnJheS5mb3JFYWNoKChtYXBOYW1lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICAgIG5ld09wdGlvbi52YWx1ZSA9IG1hcE5hbWVGbihtYXBOYW1lKTsgLy8gSWwgdmFsb3JlIGVmZmV0dGl2byBkZWxsJ29wemlvbmVcbiAgICAgICAgICAgIG5ld09wdGlvbi50ZXh0Q29udGVudCA9IG1hcE5hbWU7IC8vIElsIHRlc3RvIHZpc2liaWxlIGFsbCd1dGVudGVcbiAgICAgICAgICAgIG1hcE5hbWVzU2VsZWN0LmFwcGVuZENoaWxkKG5ld09wdGlvbik7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlbW92ZU1hcEZyb21Mb2NhbFN0b3JhZ2UobWFwTmFtZSkge1xuICAgIGNvbnN0IG1hcE5hbWVGaWx0ZXJlZCA9IG1hcE5hbWVGbihtYXBOYW1lKTtcbiAgICAvLyBSZW1vdmUgdGhlIG1hcCBkYXRhIGl0c2VsZlxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGBzYXZlZE1hcF8ke21hcE5hbWVGaWx0ZXJlZH1gKTtcbiAgICAvLyBHZXQgYW5kIHVwZGF0ZSB0aGUgbGlzdCBvZiBzYXZlZCBtYXAgbmFtZXNcbiAgICBsZXQgbWFwTmFtZXMgPSBbXTtcbiAgICBjb25zdCBzYXZlZE5hbWVzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21hcE5hbWVzJyk7XG4gICAgaWYgKHNhdmVkTmFtZXMpIHtcbiAgICAgICAgbWFwTmFtZXMgPSBKU09OLnBhcnNlKHNhdmVkTmFtZXMpO1xuICAgIH1cbiAgICAvLyBGaWx0ZXIgb3V0IHRoZSBuYW1lIHRvIGJlIHJlbW92ZWRcbiAgICBjb25zdCB1cGRhdGVkTWFwTmFtZXMgPSBtYXBOYW1lcy5maWx0ZXIobmFtZSA9PiBuYW1lICE9PSBtYXBOYW1lKTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbWFwTmFtZXMnLCBKU09OLnN0cmluZ2lmeSh1cGRhdGVkTWFwTmFtZXMpKTtcbiAgICAvLyBHZXQgdGhlIHNlbGVjdCBlbGVtZW50XG4gICAgY29uc3QgbWFwTmFtZXNTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWVzJyk7XG4gICAgLy8gRmlsdGVyIG1hcCBuYW1lIGZvciB0ZWNobmljYWwgSUQgKHRoZSBvcHRpb24ncyB2YWx1ZSlcbiAgICBpZiAobWFwTmFtZXNTZWxlY3QpIHtcbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCBvcHRpb25zIGluIHRoZSBzZWxlY3QgZWxlbWVudFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcE5hbWVzU2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbiA9IG1hcE5hbWVzU2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgb3B0aW9uJ3MgdmFsdWUgbWF0Y2hlcyB0aGUgZmlsdGVyZWQgbWFwIG5hbWVcbiAgICAgICAgICAgIGlmIChvcHRpb24udmFsdWUgPT09IG1hcE5hbWUpIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIG9wdGlvbiBhdCB0aGUgZm91bmQgaW5kZXhcbiAgICAgICAgICAgICAgICBtYXBOYW1lc1NlbGVjdC5yZW1vdmUoaSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE9wdGlvbiBmb3IgbWFwIFwiJHttYXBOYW1lfVwiIHJlbW92ZWQgZnJvbSBzZWxlY3QuYCk7XG4gICAgICAgICAgICAgICAgLy8gQnJlYWsgdGhlIGxvb3Agb25jZSB0aGUgb3B0aW9uIGlzIHJlbW92ZWRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdTZWxlY3QgZWxlbWVudCB3aXRoIElEIFwibWFwLW5hbWVzXCIgbm90IGZvdW5kLicpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhgTWFwIFwiJHttYXBOYW1lfVwiIHJlbW92ZWQgc3VjY2Vzc2Z1bGx5LmApO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSByYW5kb21pemVTcXVhcmU7XG4vLyBGdW56aW9uZSBwZXIgcmFuZG9taXp6YXJlIHVuIHF1YWRyYXRvIGNvbiBhbm5vdGF6aW9uaSBkaSB0aXBvXG5mdW5jdGlvbiByYW5kb21pemVTcXVhcmUoKSB7XG4gICAgLy8gU2VsZXppb25hIHR1dHRpIGdsaSBlbGVtZW50aSBjb24gbGEgY2xhc3NlICdncmlkLXNxdWFyZSdcbiAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlLmFjdGl2ZScpO1xuICAgIC8vIFZlcmlmaWNhIHNlIGNpIHNvbm8gcXVhZHJhdGkgbmVsbGEgZ3JpZ2xpYVxuICAgIGlmIChzcXVhcmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBhbGVydCgnUGVyIGZhdm9yZSwgY3JlYSBwcmltYSB1bmEgZ3JpZ2xpYSEnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBSaW11b3ZlIGxhIGNsYXNzZSAnc2VsZWN0ZWQnIGRhIHR1dHRpIGkgcXVhZHJhdGkgcGVyIGRlc2VsZXppb25hcmUgcXVlbGxvIHByZWNlZGVudGVtZW50ZSBldmlkZW56aWF0b1xuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4gc3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJykpO1xuICAgIC8vIENhbGNvbGEgdW4gaW5kaWNlIGNhc3VhbGUgYWxsJ2ludGVybm8gZGVsbCdhcnJheSBkaSBxdWFkcmF0aVxuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc3F1YXJlcy5sZW5ndGgpO1xuICAgIC8vIEFnZ2l1bmdlIGxhIGNsYXNzZSAnc2VsZWN0ZWQnIGFsIHF1YWRyYXRvIHNjZWx0byBjYXN1YWxtZW50ZVxuICAgIHNxdWFyZXNbcmFuZG9tSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHJhbmRvbWl6ZVNxdWFyZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9yYW5kb21pemVTcXVhcmVcIikpO1xuY29uc3QgR3JpZF8xID0gcmVxdWlyZShcIi4vZnVuY3Rpb25zL0dyaWRcIik7XG5jb25zdCBTYXZlXzEgPSByZXF1aXJlKFwiLi9mdW5jdGlvbnMvU2F2ZVwiKTtcbmNvbnN0IEJhY2tncm91bmRfMSA9IHJlcXVpcmUoXCIuL2Z1bmN0aW9ucy9CYWNrZ3JvdW5kXCIpO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICBsZXQgYnJ1c2hUeXBlID0gJ2Nyb3NzJztcbiAgICBsZXQgYmFja1R5cGUgPSAnZWFydGgnO1xuICAgIGxldCBncmlkQ29scyA9IDE1O1xuICAgIGxldCBncmlkUm93cyA9IDE1O1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1jb250YWluZXInKTtcbiAgICAoMCwgU2F2ZV8xLmdldFNhdmVkTWFwTmFtZXMpKCk7XG4gICAgLy8gQWN0aXZlIGV2ZXJ5IHNxdWFyZSBzZWxlY3RlZC5cbiAgICBjb25zdCBjcmVhdGVHcmlkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZS1ncmlkLWJ0bicpO1xuICAgIGNyZWF0ZUdyaWRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGdyaWRSb3dzID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtcmFuZ2Utcm93cycpLnZhbHVlKTtcbiAgICAgICAgZ3JpZENvbHMgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1yYW5nZScpLnZhbHVlKTtcbiAgICAgICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG4gICAgICAgIGNyZWF0ZUdyaWRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGVhci1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtcmFuZ2Utcm93cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIGdyaWRSb3dzID0gcGFyc2VJbnQoKGU/LnRhcmdldCkudmFsdWUpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1sYWJlbCcpLmlubmVyVGV4dCA9IGdyaWRDb2xzICsgJ3gnICsgZ3JpZFJvd3M7XG4gICAgICAgIGNyZWF0ZUdyaWRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1yYW5nZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIGdyaWRDb2xzID0gcGFyc2VJbnQoKGU/LnRhcmdldCkudmFsdWUpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1sYWJlbCcpLmlubmVyVGV4dCA9IGdyaWRDb2xzICsgJ3gnICsgZ3JpZFJvd3M7XG4gICAgICAgIGNyZWF0ZUdyaWRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmFuZG9taXplLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmFuZG9taXplU3F1YXJlXzEuZGVmYXVsdCk7XG4gICAgLy8gQ2hpYW1hIGxhIGZ1bnppb25lIGRpIHJhbmRvbWl6emF6aW9uZSBhbCBjbGljayBkZWwgcHVsc2FudGUuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmUtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcE5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLW5hbWUnKS52YWx1ZTtcbiAgICAgICAgKDAsIFNhdmVfMS5zYXZlTWFwVG9Mb2NhbFN0b3JhZ2UpKGdyaWRDb250YWluZXIsIG1hcE5hbWUsIGdyaWRSb3dzLCBncmlkQ29scywgYmFja1R5cGUpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXBOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1uYW1lcycpLnZhbHVlO1xuICAgICAgICBjb25zdCBtYXBEYXRhID0gKDAsIFNhdmVfMS5sb2FkTWFwRnJvbUxvY2FsU3RvcmFnZSkobWFwTmFtZSk7XG4gICAgICAgIGdyaWRSb3dzID0gbWFwRGF0YT8ucm93cyA/PyBncmlkUm93cztcbiAgICAgICAgZ3JpZENvbHMgPSBtYXBEYXRhPy5jb2xzID8/IGdyaWRDb2xzO1xuICAgICAgICAoMCwgR3JpZF8xLmNyZWF0ZUdyaWQpKGdyaWRSb3dzLCBncmlkQ29scywgYnJ1c2hUeXBlKTtcbiAgICAgICAgYmFja1R5cGUgPSAobWFwRGF0YT8uYmFjayA/PyBiYWNrVHlwZSk7XG4gICAgICAgICgwLCBCYWNrZ3JvdW5kXzEuYmFjaykoZ3JpZENvbnRhaW5lciwgYmFja1R5cGUpO1xuICAgICAgICAvLyBBcHBsaWNhIGxvIHN0YXRvIHNhbHZhdG8gYSBvZ25pIHF1YWRyYXRvIGRlbGxhIGdyaWdsaWFcbiAgICAgICAgY29uc3Qgc3F1YXJlcyA9IEFycmF5LmZyb20oZ3JpZENvbnRhaW5lci5jaGlsZHJlbik7XG4gICAgICAgIG1hcERhdGE/LnNxdWFyZXM/LmZvckVhY2goKGRhdGEsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoZGF0YS5zKSB7XG4gICAgICAgICAgICAgICAgc3F1YXJlc1tpbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzcXVhcmVzW2luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbGV0ZS1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFwTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtbmFtZXMnKS52YWx1ZTtcbiAgICAgICAgKDAsIFNhdmVfMS5yZW1vdmVNYXBGcm9tTG9jYWxTdG9yYWdlKShtYXBOYW1lKTtcbiAgICB9KTtcbiAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cImJydXNoLW9wdGlvbnNcIl0nKSkuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGJydXNoVHlwZSA9IChlPy50YXJnZXQpLnZhbHVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2JydXNoVHlwZTogJywgYnJ1c2hUeXBlKTtcbiAgICAgICAgICAgICgwLCBHcmlkXzEuYWRkU3F1YXJlTGlzdGVuZXJzKShicnVzaFR5cGUsIGdyaWRDb2xzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJiYWNrLW9wdGlvbnNcIl0nKSkuZm9yRWFjaChyYWRpbyA9PiB7XG4gICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGJhY2tUeXBlID0gKGU/LnRhcmdldCkudmFsdWU7XG4gICAgICAgICAgICAoMCwgQmFja2dyb3VuZF8xLmJhY2spKGdyaWRDb250YWluZXIsIGJhY2tUeXBlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgZ3JpZENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChlKSA9PiBlLnByZXZlbnREZWZhdWx0KCkpO1xuICAgIC8vIENyZWEgdW5hIGdyaWdsaWEgZGkgZGltZW5zaW9uaSBwcmVkZWZpbml0ZSBhbGwnYXZ2aW8gZGVsbGEgcGFnaW5hXG4gICAgKDAsIEdyaWRfMS5jcmVhdGVHcmlkKShncmlkUm93cywgZ3JpZENvbHMsIGJydXNoVHlwZSk7XG59KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==