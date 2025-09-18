/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/functions/grid.ts":
/*!*******************************!*\
  !*** ./src/functions/grid.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = createGrid;
const gridContainer = document.getElementById('grid-container');
let isMouseDown = false;
let startSquare = null;
let selectedSquares = new Set(); // Usiamo un Set per evitare duplicati
let isDraggingRightClick = false;
// Funzione per creare la griglia con annotazioni di tipo
function createGrid(rows, cols) {
    // Pulisce il contenuto precedente del contenitore
    gridContainer.innerHTML = '';
    // Imposta i template per le righe e le colonne della griglia CSS
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    // Calcola la larghezza del contenitore in base al numero di colonne e alla dimensione dei quadrati + bordi
    gridContainer.style.width = `${cols * 52}px`; // Assumendo che ogni quadrato sia 50px + 2px di bordo totale
    // Crea i singoli quadrati della griglia
    for (let i = 0; i < rows * cols; i++) {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        gridContainer.appendChild(square);
    }
    // Active every square selected.
    const squares = document.querySelectorAll('.grid-square');
    addSquareListeners(squares);
    // squares.forEach(square => square.addEventListener('mousedown', () => square.classList.add('active')));
}
// Funzione per aggiungere listener ai quadrati
function addSquareListeners(squares) {
    squares.forEach(square => {
        square.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (e.button === 2) { // 0 è sinistro, 1 è centrale, 2 è destro
                isDraggingRightClick = true;
                square.classList.remove('active');
            }
            else {
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
const grid_1 = __importDefault(__webpack_require__(/*! ./functions/grid */ "./src/functions/grid.ts"));
// On page load.
document.addEventListener('DOMContentLoaded', () => {
    // Seleziona gli elementi dal DOM e annota i loro tipi
    const createGridBtn = document.getElementById('create-grid-btn');
    const randomizeBtn = document.getElementById('randomize-btn');
    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('cols');
    // Active every square selected.
    createGridBtn.addEventListener('click', () => {
        // Converte i valori degli input in numeri interi, gestendo potenziali valori non validi
        const rows = parseInt(rowsInput.value);
        const cols = parseInt(colsInput.value);
        // Verifica che i valori inseriti siano numeri positivi
        if (rows > 0 && cols > 0) {
            (0, grid_1.default)(rows, cols); // Chiama la funzione per creare la griglia
        }
        else {
            alert('Inserisci valori validi per righe e colonne.'); // Messaggio di errore se i valori non sono validi
        }
    });
    // Aggiunge i gestori degli eventi ai pulsanti
    createGridBtn.addEventListener('click', () => {
        // Converte i valori degli input in numeri interi, gestendo potenziali valori non validi
        const rows = parseInt(rowsInput.value);
        const cols = parseInt(colsInput.value);
        // Verifica che i valori inseriti siano numeri positivi
        if (rows > 0 && cols > 0) {
            (0, grid_1.default)(rows, cols); // Chiama la funzione per creare la griglia
        }
        else {
            alert('Inserisci valori validi per righe e colonne.'); // Messaggio di errore se i valori non sono validi
        }
    });
    randomizeBtn.addEventListener('click', randomizeSquare_1.default); // Chiama la funzione di randomizzazione al click del pulsante
    // Crea una griglia di dimensioni predefinite all'avvio della pagina
    (0, grid_1.default)(15, 15);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVycmFpbi1yYW5kb21pemVyLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQkFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsS0FBSztBQUMxRCx3REFBd0QsS0FBSztBQUM3RDtBQUNBLG1DQUFtQyxVQUFVLEtBQUs7QUFDbEQ7QUFDQSxvQkFBb0IsaUJBQWlCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7Ozs7Ozs7Ozs7O0FDdEVhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtCQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbEJhO0FBQ2I7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsMENBQTBDLG1CQUFPLENBQUMsdUVBQTZCO0FBQy9FLCtCQUErQixtQkFBTyxDQUFDLGlEQUFrQjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkU7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRTtBQUNBLEtBQUs7QUFDTCx1RUFBdUU7QUFDdkU7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7VUMzQ0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvZ3JpZC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvZnVuY3Rpb25zL3JhbmRvbWl6ZVNxdWFyZS50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNyZWF0ZUdyaWQ7XG5jb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyaWQtY29udGFpbmVyJyk7XG5sZXQgaXNNb3VzZURvd24gPSBmYWxzZTtcbmxldCBzdGFydFNxdWFyZSA9IG51bGw7XG5sZXQgc2VsZWN0ZWRTcXVhcmVzID0gbmV3IFNldCgpOyAvLyBVc2lhbW8gdW4gU2V0IHBlciBldml0YXJlIGR1cGxpY2F0aVxubGV0IGlzRHJhZ2dpbmdSaWdodENsaWNrID0gZmFsc2U7XG4vLyBGdW56aW9uZSBwZXIgY3JlYXJlIGxhIGdyaWdsaWEgY29uIGFubm90YXppb25pIGRpIHRpcG9cbmZ1bmN0aW9uIGNyZWF0ZUdyaWQocm93cywgY29scykge1xuICAgIC8vIFB1bGlzY2UgaWwgY29udGVudXRvIHByZWNlZGVudGUgZGVsIGNvbnRlbml0b3JlXG4gICAgZ3JpZENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAvLyBJbXBvc3RhIGkgdGVtcGxhdGUgcGVyIGxlIHJpZ2hlIGUgbGUgY29sb25uZSBkZWxsYSBncmlnbGlhIENTU1xuICAgIGdyaWRDb250YWluZXIuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtyb3dzfSwgMWZyKWA7XG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke2NvbHN9LCAxZnIpYDtcbiAgICAvLyBDYWxjb2xhIGxhIGxhcmdoZXp6YSBkZWwgY29udGVuaXRvcmUgaW4gYmFzZSBhbCBudW1lcm8gZGkgY29sb25uZSBlIGFsbGEgZGltZW5zaW9uZSBkZWkgcXVhZHJhdGkgKyBib3JkaVxuICAgIGdyaWRDb250YWluZXIuc3R5bGUud2lkdGggPSBgJHtjb2xzICogNTJ9cHhgOyAvLyBBc3N1bWVuZG8gY2hlIG9nbmkgcXVhZHJhdG8gc2lhIDUwcHggKyAycHggZGkgYm9yZG8gdG90YWxlXG4gICAgLy8gQ3JlYSBpIHNpbmdvbGkgcXVhZHJhdGkgZGVsbGEgZ3JpZ2xpYVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93cyAqIGNvbHM7IGkrKykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICB9XG4gICAgLy8gQWN0aXZlIGV2ZXJ5IHNxdWFyZSBzZWxlY3RlZC5cbiAgICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlJyk7XG4gICAgYWRkU3F1YXJlTGlzdGVuZXJzKHNxdWFyZXMpO1xuICAgIC8vIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4gc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSkpO1xufVxuLy8gRnVuemlvbmUgcGVyIGFnZ2l1bmdlcmUgbGlzdGVuZXIgYWkgcXVhZHJhdGlcbmZ1bmN0aW9uIGFkZFNxdWFyZUxpc3RlbmVycyhzcXVhcmVzKSB7XG4gICAgc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiB7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaWYgKGUuYnV0dG9uID09PSAyKSB7IC8vIDAgw6ggc2luaXN0cm8sIDEgw6ggY2VudHJhbGUsIDIgw6ggZGVzdHJvXG4gICAgICAgICAgICAgICAgaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgLy8gU2VsZXppb25hIGlsIHByaW1vIHF1YWRyYXRvXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydFNxdWFyZSA9IHNxdWFyZTtcbiAgICAgICAgICAgIGlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGVjdGVkU3F1YXJlcy5jbGVhcigpOyAvLyBQdWxpc2NlIGxlIHNlbGV6aW9uaSBwcmVjZWRlbnRpXG4gICAgICAgICAgICBzZWxlY3RlZFNxdWFyZXMuYWRkKHNxdWFyZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmICghaXNNb3VzZURvd24gfHwgIXN0YXJ0U3F1YXJlKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTcXVhcmUgPSBlLnRhcmdldDtcbiAgICAgICAgICAgIGlmIChjdXJyZW50U3F1YXJlLmNsYXNzTGlzdC5jb250YWlucygnZ3JpZC1zcXVhcmUnKSAmJiAhc2VsZWN0ZWRTcXVhcmVzLmhhcyhjdXJyZW50U3F1YXJlKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0RyYWdnaW5nUmlnaHRDbGljaykge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScsICdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRTcXVhcmVzLmFkZChjdXJyZW50U3F1YXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgZ3JpZENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIChlKSA9PiBlLnByZXZlbnREZWZhdWx0KCkpO1xuICAgIC8vIExpc3RlbmVyIGdsb2JhbGUgcGVyICdtb3VzZXVwJyBwZXIgZmVybWFyZSBpbCB0cmFjY2lhbWVudG9cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChpc0RyYWdnaW5nUmlnaHRDbGljayB8fCBpc01vdXNlRG93bikge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlzRHJhZ2dpbmdSaWdodENsaWNrID0gZmFsc2U7XG4gICAgICAgICAgICBpc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICAgICAgc3RhcnRTcXVhcmUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHJhbmRvbWl6ZVNxdWFyZTtcbi8vIEZ1bnppb25lIHBlciByYW5kb21penphcmUgdW4gcXVhZHJhdG8gY29uIGFubm90YXppb25pIGRpIHRpcG9cbmZ1bmN0aW9uIHJhbmRvbWl6ZVNxdWFyZSgpIHtcbiAgICAvLyBTZWxlemlvbmEgdHV0dGkgZ2xpIGVsZW1lbnRpIGNvbiBsYSBjbGFzc2UgJ2dyaWQtc3F1YXJlJ1xuICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUuYWN0aXZlJyk7XG4gICAgLy8gVmVyaWZpY2Egc2UgY2kgc29ubyBxdWFkcmF0aSBuZWxsYSBncmlnbGlhXG4gICAgaWYgKHNxdWFyZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGFsZXJ0KCdQZXIgZmF2b3JlLCBjcmVhIHByaW1hIHVuYSBncmlnbGlhIScpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFJpbXVvdmUgbGEgY2xhc3NlICdzZWxlY3RlZCcgZGEgdHV0dGkgaSBxdWFkcmF0aSBwZXIgZGVzZWxlemlvbmFyZSBxdWVsbG8gcHJlY2VkZW50ZW1lbnRlIGV2aWRlbnppYXRvXG4gICAgc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKSk7XG4gICAgLy8gQ2FsY29sYSB1biBpbmRpY2UgY2FzdWFsZSBhbGwnaW50ZXJubyBkZWxsJ2FycmF5IGRpIHF1YWRyYXRpXG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzcXVhcmVzLmxlbmd0aCk7XG4gICAgLy8gQWdnaXVuZ2UgbGEgY2xhc3NlICdzZWxlY3RlZCcgYWwgcXVhZHJhdG8gc2NlbHRvIGNhc3VhbG1lbnRlXG4gICAgc3F1YXJlc1tyYW5kb21JbmRleF0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcmFuZG9taXplU3F1YXJlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZnVuY3Rpb25zL3JhbmRvbWl6ZVNxdWFyZVwiKSk7XG5jb25zdCBncmlkXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZnVuY3Rpb25zL2dyaWRcIikpO1xuLy8gT24gcGFnZSBsb2FkLlxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAvLyBTZWxlemlvbmEgZ2xpIGVsZW1lbnRpIGRhbCBET00gZSBhbm5vdGEgaSBsb3JvIHRpcGlcbiAgICBjb25zdCBjcmVhdGVHcmlkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZS1ncmlkLWJ0bicpO1xuICAgIGNvbnN0IHJhbmRvbWl6ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYW5kb21pemUtYnRuJyk7XG4gICAgY29uc3Qgcm93c0lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvd3MnKTtcbiAgICBjb25zdCBjb2xzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29scycpO1xuICAgIC8vIEFjdGl2ZSBldmVyeSBzcXVhcmUgc2VsZWN0ZWQuXG4gICAgY3JlYXRlR3JpZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgLy8gQ29udmVydGUgaSB2YWxvcmkgZGVnbGkgaW5wdXQgaW4gbnVtZXJpIGludGVyaSwgZ2VzdGVuZG8gcG90ZW56aWFsaSB2YWxvcmkgbm9uIHZhbGlkaVxuICAgICAgICBjb25zdCByb3dzID0gcGFyc2VJbnQocm93c0lucHV0LnZhbHVlKTtcbiAgICAgICAgY29uc3QgY29scyA9IHBhcnNlSW50KGNvbHNJbnB1dC52YWx1ZSk7XG4gICAgICAgIC8vIFZlcmlmaWNhIGNoZSBpIHZhbG9yaSBpbnNlcml0aSBzaWFubyBudW1lcmkgcG9zaXRpdmlcbiAgICAgICAgaWYgKHJvd3MgPiAwICYmIGNvbHMgPiAwKSB7XG4gICAgICAgICAgICAoMCwgZ3JpZF8xLmRlZmF1bHQpKHJvd3MsIGNvbHMpOyAvLyBDaGlhbWEgbGEgZnVuemlvbmUgcGVyIGNyZWFyZSBsYSBncmlnbGlhXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnSW5zZXJpc2NpIHZhbG9yaSB2YWxpZGkgcGVyIHJpZ2hlIGUgY29sb25uZS4nKTsgLy8gTWVzc2FnZ2lvIGRpIGVycm9yZSBzZSBpIHZhbG9yaSBub24gc29ubyB2YWxpZGlcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIEFnZ2l1bmdlIGkgZ2VzdG9yaSBkZWdsaSBldmVudGkgYWkgcHVsc2FudGlcbiAgICBjcmVhdGVHcmlkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAvLyBDb252ZXJ0ZSBpIHZhbG9yaSBkZWdsaSBpbnB1dCBpbiBudW1lcmkgaW50ZXJpLCBnZXN0ZW5kbyBwb3RlbnppYWxpIHZhbG9yaSBub24gdmFsaWRpXG4gICAgICAgIGNvbnN0IHJvd3MgPSBwYXJzZUludChyb3dzSW5wdXQudmFsdWUpO1xuICAgICAgICBjb25zdCBjb2xzID0gcGFyc2VJbnQoY29sc0lucHV0LnZhbHVlKTtcbiAgICAgICAgLy8gVmVyaWZpY2EgY2hlIGkgdmFsb3JpIGluc2VyaXRpIHNpYW5vIG51bWVyaSBwb3NpdGl2aVxuICAgICAgICBpZiAocm93cyA+IDAgJiYgY29scyA+IDApIHtcbiAgICAgICAgICAgICgwLCBncmlkXzEuZGVmYXVsdCkocm93cywgY29scyk7IC8vIENoaWFtYSBsYSBmdW56aW9uZSBwZXIgY3JlYXJlIGxhIGdyaWdsaWFcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KCdJbnNlcmlzY2kgdmFsb3JpIHZhbGlkaSBwZXIgcmlnaGUgZSBjb2xvbm5lLicpOyAvLyBNZXNzYWdnaW8gZGkgZXJyb3JlIHNlIGkgdmFsb3JpIG5vbiBzb25vIHZhbGlkaVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmFuZG9taXplQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmFuZG9taXplU3F1YXJlXzEuZGVmYXVsdCk7IC8vIENoaWFtYSBsYSBmdW56aW9uZSBkaSByYW5kb21penphemlvbmUgYWwgY2xpY2sgZGVsIHB1bHNhbnRlXG4gICAgLy8gQ3JlYSB1bmEgZ3JpZ2xpYSBkaSBkaW1lbnNpb25pIHByZWRlZmluaXRlIGFsbCdhdnZpbyBkZWxsYSBwYWdpbmFcbiAgICAoMCwgZ3JpZF8xLmRlZmF1bHQpKDE1LCAxNSk7XG59KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==