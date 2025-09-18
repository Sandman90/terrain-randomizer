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
    addSquareListeners(squares, cols);
    // squares.forEach(square => square.addEventListener('mousedown', () => square.classList.add('active')));
}
// Funzione per aggiungere listener ai quadrati
function addSquareListeners(squares, cols) {
    const squaresArray = Array.from(squares);
    squares.forEach(square => {
        square.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (e.button === 2) { // 0 è sinistro, 1 è centrale, 2 è destro
                isDraggingRightClick = true;
                square.classList.remove('active');
            }
            else {
                brush(squaresArray, e.target, squares, cols);
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
                    brush(squaresArray, e.target, squares, cols);
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
function brush(squaresArray, e, squares, cols) {
    const currentIndex = squaresArray.indexOf(e);
    const aboveIndex = currentIndex - cols;
    const belowIndex = currentIndex + cols;
    if (aboveIndex >= 0)
        squares[aboveIndex].classList.add('active');
    if (belowIndex < squares.length)
        squares[belowIndex].classList.add('active');
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
document.addEventListener('DOMContentLoaded', () => {
    // Active every square selected.
    const createGridBtn = document.getElementById('create-grid-btn');
    const rowsInput = document.getElementById('rows');
    const rows = parseInt(rowsInput.value);
    const colsInput = document.getElementById('cols');
    const cols = parseInt(colsInput.value);
    createGridBtn.addEventListener('click', () => {
        if (rows > 0 && cols > 0)
            (0, grid_1.default)(rows, cols); // Create grid.
        else
            alert('Inserisci valori validi per righe e colonne.');
    });
    const randomizeBtn = document.getElementById('randomize-btn');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVycmFpbi1yYW5kb21pemVyLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQkFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsS0FBSztBQUMxRCx3REFBd0QsS0FBSztBQUM3RDtBQUNBLG1DQUFtQyxVQUFVLEtBQUs7QUFDbEQ7QUFDQSxvQkFBb0IsaUJBQWlCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbEZhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtCQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbEJhO0FBQ2I7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsMENBQTBDLG1CQUFPLENBQUMsdUVBQTZCO0FBQy9FLCtCQUErQixtQkFBTyxDQUFDLGlEQUFrQjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLHVFQUF1RTtBQUN2RTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7OztVQ3hCRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyLy4vc3JjL2Z1bmN0aW9ucy9ncmlkLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9mdW5jdGlvbnMvcmFuZG9taXplU3F1YXJlLnRzIiwid2VicGFjazovL3RlcnJhaW4tcmFuZG9taXplci8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGVycmFpbi1yYW5kb21pemVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly90ZXJyYWluLXJhbmRvbWl6ZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlR3JpZDtcbmNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZC1jb250YWluZXInKTtcbmxldCBpc01vdXNlRG93biA9IGZhbHNlO1xubGV0IHN0YXJ0U3F1YXJlID0gbnVsbDtcbmxldCBzZWxlY3RlZFNxdWFyZXMgPSBuZXcgU2V0KCk7IC8vIFVzaWFtbyB1biBTZXQgcGVyIGV2aXRhcmUgZHVwbGljYXRpXG5sZXQgaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgPSBmYWxzZTtcbi8vIEZ1bnppb25lIHBlciBjcmVhcmUgbGEgZ3JpZ2xpYSBjb24gYW5ub3RhemlvbmkgZGkgdGlwb1xuZnVuY3Rpb24gY3JlYXRlR3JpZChyb3dzLCBjb2xzKSB7XG4gICAgLy8gUHVsaXNjZSBpbCBjb250ZW51dG8gcHJlY2VkZW50ZSBkZWwgY29udGVuaXRvcmVcbiAgICBncmlkQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIC8vIEltcG9zdGEgaSB0ZW1wbGF0ZSBwZXIgbGUgcmlnaGUgZSBsZSBjb2xvbm5lIGRlbGxhIGdyaWdsaWEgQ1NTXG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS5ncmlkVGVtcGxhdGVSb3dzID0gYHJlcGVhdCgke3Jvd3N9LCAxZnIpYDtcbiAgICBncmlkQ29udGFpbmVyLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7Y29sc30sIDFmcilgO1xuICAgIC8vIENhbGNvbGEgbGEgbGFyZ2hlenphIGRlbCBjb250ZW5pdG9yZSBpbiBiYXNlIGFsIG51bWVybyBkaSBjb2xvbm5lIGUgYWxsYSBkaW1lbnNpb25lIGRlaSBxdWFkcmF0aSArIGJvcmRpXG4gICAgZ3JpZENvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke2NvbHMgKiA1Mn1weGA7IC8vIEFzc3VtZW5kbyBjaGUgb2duaSBxdWFkcmF0byBzaWEgNTBweCArIDJweCBkaSBib3JkbyB0b3RhbGVcbiAgICAvLyBDcmVhIGkgc2luZ29saSBxdWFkcmF0aSBkZWxsYSBncmlnbGlhXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzICogY29sczsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICAgICAgZ3JpZENvbnRhaW5lci5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgIH1cbiAgICAvLyBBY3RpdmUgZXZlcnkgc3F1YXJlIHNlbGVjdGVkLlxuICAgIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcbiAgICBhZGRTcXVhcmVMaXN0ZW5lcnMoc3F1YXJlcywgY29scyk7XG4gICAgLy8gc3F1YXJlcy5mb3JFYWNoKHNxdWFyZSA9PiBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4gc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpKSk7XG59XG4vLyBGdW56aW9uZSBwZXIgYWdnaXVuZ2VyZSBsaXN0ZW5lciBhaSBxdWFkcmF0aVxuZnVuY3Rpb24gYWRkU3F1YXJlTGlzdGVuZXJzKHNxdWFyZXMsIGNvbHMpIHtcbiAgICBjb25zdCBzcXVhcmVzQXJyYXkgPSBBcnJheS5mcm9tKHNxdWFyZXMpO1xuICAgIHNxdWFyZXMuZm9yRWFjaChzcXVhcmUgPT4ge1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChlLmJ1dHRvbiA9PT0gMikgeyAvLyAwIMOoIHNpbmlzdHJvLCAxIMOoIGNlbnRyYWxlLCAyIMOoIGRlc3Ryb1xuICAgICAgICAgICAgICAgIGlzRHJhZ2dpbmdSaWdodENsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBicnVzaChzcXVhcmVzQXJyYXksIGUudGFyZ2V0LCBzcXVhcmVzLCBjb2xzKTtcbiAgICAgICAgICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IC8vIFNlbGV6aW9uYSBpbCBwcmltbyBxdWFkcmF0b1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhcnRTcXVhcmUgPSBzcXVhcmU7XG4gICAgICAgICAgICBpc01vdXNlRG93biA9IHRydWU7XG4gICAgICAgICAgICBzZWxlY3RlZFNxdWFyZXMuY2xlYXIoKTsgLy8gUHVsaXNjZSBsZSBzZWxlemlvbmkgcHJlY2VkZW50aVxuICAgICAgICAgICAgc2VsZWN0ZWRTcXVhcmVzLmFkZChzcXVhcmUpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlzTW91c2VEb3duIHx8ICFzdGFydFNxdWFyZSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U3F1YXJlID0gZS50YXJnZXQ7XG4gICAgICAgICAgICBpZiAoY3VycmVudFNxdWFyZS5jbGFzc0xpc3QuY29udGFpbnMoJ2dyaWQtc3F1YXJlJykgJiYgIXNlbGVjdGVkU3F1YXJlcy5oYXMoY3VycmVudFNxdWFyZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNEcmFnZ2luZ1JpZ2h0Q2xpY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnLCAnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJydXNoKHNxdWFyZXNBcnJheSwgZS50YXJnZXQsIHNxdWFyZXMsIGNvbHMpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxlY3RlZFNxdWFyZXMuYWRkKGN1cnJlbnRTcXVhcmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBncmlkQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgKGUpID0+IGUucHJldmVudERlZmF1bHQoKSk7XG4gICAgLy8gTGlzdGVuZXIgZ2xvYmFsZSBwZXIgJ21vdXNldXAnIHBlciBmZXJtYXJlIGlsIHRyYWNjaWFtZW50b1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGlzRHJhZ2dpbmdSaWdodENsaWNrIHx8IGlzTW91c2VEb3duKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaXNEcmFnZ2luZ1JpZ2h0Q2xpY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIGlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgICAgICBzdGFydFNxdWFyZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGJydXNoKHNxdWFyZXNBcnJheSwgZSwgc3F1YXJlcywgY29scykge1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHNxdWFyZXNBcnJheS5pbmRleE9mKGUpO1xuICAgIGNvbnN0IGFib3ZlSW5kZXggPSBjdXJyZW50SW5kZXggLSBjb2xzO1xuICAgIGNvbnN0IGJlbG93SW5kZXggPSBjdXJyZW50SW5kZXggKyBjb2xzO1xuICAgIGlmIChhYm92ZUluZGV4ID49IDApXG4gICAgICAgIHNxdWFyZXNbYWJvdmVJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgaWYgKGJlbG93SW5kZXggPCBzcXVhcmVzLmxlbmd0aClcbiAgICAgICAgc3F1YXJlc1tiZWxvd0luZGV4XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gcmFuZG9taXplU3F1YXJlO1xuLy8gRnVuemlvbmUgcGVyIHJhbmRvbWl6emFyZSB1biBxdWFkcmF0byBjb24gYW5ub3RhemlvbmkgZGkgdGlwb1xuZnVuY3Rpb24gcmFuZG9taXplU3F1YXJlKCkge1xuICAgIC8vIFNlbGV6aW9uYSB0dXR0aSBnbGkgZWxlbWVudGkgY29uIGxhIGNsYXNzZSAnZ3JpZC1zcXVhcmUnXG4gICAgY29uc3Qgc3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZS5hY3RpdmUnKTtcbiAgICAvLyBWZXJpZmljYSBzZSBjaSBzb25vIHF1YWRyYXRpIG5lbGxhIGdyaWdsaWFcbiAgICBpZiAoc3F1YXJlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYWxlcnQoJ1BlciBmYXZvcmUsIGNyZWEgcHJpbWEgdW5hIGdyaWdsaWEhJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gUmltdW92ZSBsYSBjbGFzc2UgJ3NlbGVjdGVkJyBkYSB0dXR0aSBpIHF1YWRyYXRpIHBlciBkZXNlbGV6aW9uYXJlIHF1ZWxsbyBwcmVjZWRlbnRlbWVudGUgZXZpZGVuemlhdG9cbiAgICBzcXVhcmVzLmZvckVhY2goc3F1YXJlID0+IHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpKTtcbiAgICAvLyBDYWxjb2xhIHVuIGluZGljZSBjYXN1YWxlIGFsbCdpbnRlcm5vIGRlbGwnYXJyYXkgZGkgcXVhZHJhdGlcbiAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNxdWFyZXMubGVuZ3RoKTtcbiAgICAvLyBBZ2dpdW5nZSBsYSBjbGFzc2UgJ3NlbGVjdGVkJyBhbCBxdWFkcmF0byBzY2VsdG8gY2FzdWFsbWVudGVcbiAgICBzcXVhcmVzW3JhbmRvbUluZGV4XS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCByYW5kb21pemVTcXVhcmVfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9mdW5jdGlvbnMvcmFuZG9taXplU3F1YXJlXCIpKTtcbmNvbnN0IGdyaWRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9mdW5jdGlvbnMvZ3JpZFwiKSk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIC8vIEFjdGl2ZSBldmVyeSBzcXVhcmUgc2VsZWN0ZWQuXG4gICAgY29uc3QgY3JlYXRlR3JpZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjcmVhdGUtZ3JpZC1idG4nKTtcbiAgICBjb25zdCByb3dzSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm93cycpO1xuICAgIGNvbnN0IHJvd3MgPSBwYXJzZUludChyb3dzSW5wdXQudmFsdWUpO1xuICAgIGNvbnN0IGNvbHNJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xzJyk7XG4gICAgY29uc3QgY29scyA9IHBhcnNlSW50KGNvbHNJbnB1dC52YWx1ZSk7XG4gICAgY3JlYXRlR3JpZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaWYgKHJvd3MgPiAwICYmIGNvbHMgPiAwKVxuICAgICAgICAgICAgKDAsIGdyaWRfMS5kZWZhdWx0KShyb3dzLCBjb2xzKTsgLy8gQ3JlYXRlIGdyaWQuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGFsZXJ0KCdJbnNlcmlzY2kgdmFsb3JpIHZhbGlkaSBwZXIgcmlnaGUgZSBjb2xvbm5lLicpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJhbmRvbWl6ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYW5kb21pemUtYnRuJyk7XG4gICAgcmFuZG9taXplQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmFuZG9taXplU3F1YXJlXzEuZGVmYXVsdCk7IC8vIENoaWFtYSBsYSBmdW56aW9uZSBkaSByYW5kb21penphemlvbmUgYWwgY2xpY2sgZGVsIHB1bHNhbnRlXG4gICAgLy8gQ3JlYSB1bmEgZ3JpZ2xpYSBkaSBkaW1lbnNpb25pIHByZWRlZmluaXRlIGFsbCdhdnZpbyBkZWxsYSBwYWdpbmFcbiAgICAoMCwgZ3JpZF8xLmRlZmF1bHQpKDE1LCAxNSk7XG59KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==