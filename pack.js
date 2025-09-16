// On page load.
document.addEventListener('DOMContentLoaded', function () {
    // Seleziona gli elementi dal DOM e annota i loro tipi
    var createGridBtn = document.getElementById('create-grid-btn');
    var randomizeBtn = document.getElementById('randomize-btn');
    var rowsInput = document.getElementById('rows');
    var colsInput = document.getElementById('cols');
    var gridContainer = document.getElementById('grid-container');
    // Funzione per creare la griglia con annotazioni di tipo
    function createGrid(rows, cols) {
        // Pulisce il contenuto precedente del contenitore
        gridContainer.innerHTML = '';
        // Imposta i template per le righe e le colonne della griglia CSS
        gridContainer.style.gridTemplateRows = "repeat(".concat(rows, ", 1fr)");
        gridContainer.style.gridTemplateColumns = "repeat(".concat(cols, ", 1fr)");
        // Calcola la larghezza del contenitore in base al numero di colonne e alla dimensione dei quadrati + bordi
        gridContainer.style.width = "".concat(cols * 52, "px"); // Assumendo che ogni quadrato sia 50px + 2px di bordo totale
        // Crea i singoli quadrati della griglia
        for (var i = 0; i < rows * cols; i++) {
            var square = document.createElement('div');
            square.classList.add('grid-square');
            gridContainer.appendChild(square);
        }
        // Active every square selected.
        var squares = document.querySelectorAll('.grid-square');
        addSquareListeners(squares);
        // squares.forEach(square => square.addEventListener('mousedown', () => square.classList.add('active')));
    }
    var isMouseDown = false;
    var startSquare = null;
    var selectedSquares = new Set(); // Usiamo un Set per evitare duplicati
    var isDraggingRightClick = false;
    // Funzione per aggiungere listener ai quadrati
    function addSquareListeners(squares) {
        squares.forEach(function (square) {
            square.addEventListener('mousedown', function (e) {
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
            square.addEventListener('mouseover', function (e) {
                if (!isMouseDown || !startSquare)
                    return;
                var currentSquare = e.target;
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
        gridContainer.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
        // Listener globale per 'mouseup' per fermare il tracciamento
        document.addEventListener('mouseup', function (event) {
            if (isDraggingRightClick || isMouseDown) {
                event.preventDefault();
                isDraggingRightClick = false;
                isMouseDown = false;
                startSquare = null;
            }
        });
    }
    // Funzione per randomizzare un quadrato con annotazioni di tipo
    function randomizeSquare() {
        // Seleziona tutti gli elementi con la classe 'grid-square'
        var squares = document.querySelectorAll('.grid-square.active');
        // Verifica se ci sono quadrati nella griglia
        if (squares.length === 0) {
            alert('Per favore, crea prima una griglia!');
            return;
        }
        // Rimuove la classe 'selected' da tutti i quadrati per deselezionare quello precedentemente evidenziato
        squares.forEach(function (square) { return square.classList.remove('selected'); });
        // Calcola un indice casuale all'interno dell'array di quadrati
        var randomIndex = Math.floor(Math.random() * squares.length);
        // Aggiunge la classe 'selected' al quadrato scelto casualmente
        squares[randomIndex].classList.add('selected');
    }
    // Active every square selected.
    createGridBtn.addEventListener('click', function () {
        // Converte i valori degli input in numeri interi, gestendo potenziali valori non validi
        var rows = parseInt(rowsInput.value);
        var cols = parseInt(colsInput.value);
        // Verifica che i valori inseriti siano numeri positivi
        if (rows > 0 && cols > 0) {
            createGrid(rows, cols); // Chiama la funzione per creare la griglia
        }
        else {
            alert('Inserisci valori validi per righe e colonne.'); // Messaggio di errore se i valori non sono validi
        }
    });
    // Aggiunge i gestori degli eventi ai pulsanti
    createGridBtn.addEventListener('click', function () {
        // Converte i valori degli input in numeri interi, gestendo potenziali valori non validi
        var rows = parseInt(rowsInput.value);
        var cols = parseInt(colsInput.value);
        // Verifica che i valori inseriti siano numeri positivi
        if (rows > 0 && cols > 0) {
            createGrid(rows, cols); // Chiama la funzione per creare la griglia
        }
        else {
            alert('Inserisci valori validi per righe e colonne.'); // Messaggio di errore se i valori non sono validi
        }
    });
    randomizeBtn.addEventListener('click', randomizeSquare); // Chiama la funzione di randomizzazione al click del pulsante
    // Crea una griglia di dimensioni predefinite all'avvio della pagina
    createGrid(15, 15);
});
