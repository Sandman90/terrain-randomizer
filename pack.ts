// On page load.
document.addEventListener('DOMContentLoaded', () => {
    // Seleziona gli elementi dal DOM e annota i loro tipi
    const createGridBtn: HTMLButtonElement = document.getElementById('create-grid-btn') as HTMLButtonElement;
    const randomizeBtn: HTMLButtonElement = document.getElementById('randomize-btn') as HTMLButtonElement;
    const rowsInput: HTMLInputElement = document.getElementById('rows') as HTMLInputElement;
    const colsInput: HTMLInputElement = document.getElementById('cols') as HTMLInputElement;
    const gridContainer: HTMLElement = document.getElementById('grid-container') as HTMLElement;

    // Funzione per creare la griglia con annotazioni di tipo
    function createGrid(rows: number, cols: number): void {
        // Pulisce il contenuto precedente del contenitore
        gridContainer.innerHTML = '';

        // Imposta i template per le righe e le colonne della griglia CSS
        gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        // Calcola la larghezza del contenitore in base al numero di colonne e alla dimensione dei quadrati + bordi
        gridContainer.style.width = `${cols * 52}px`; // Assumendo che ogni quadrato sia 50px + 2px di bordo totale

        // Crea i singoli quadrati della griglia
        for (let i = 0; i < rows * cols; i++) {
            const square: HTMLDivElement = document.createElement('div');
            square.classList.add('grid-square');
            gridContainer.appendChild(square);
        }

        // Active every square selected.
        const squares: NodeListOf<HTMLElement> = document.querySelectorAll('.grid-square');
        addSquareListeners(squares);
        // squares.forEach(square => square.addEventListener('mousedown', () => square.classList.add('active')));
    }


    let isMouseDown = false;
    let startSquare: HTMLElement | null = null;
    let selectedSquares: Set<HTMLElement> = new Set(); // Usiamo un Set per evitare duplicati
    let isDraggingRightClick = false;
// Funzione per aggiungere listener ai quadrati
    function addSquareListeners(squares: NodeListOf<HTMLElement>): void {
        squares.forEach(square => {
            square.addEventListener('mousedown', (e: MouseEvent) => {
                e.preventDefault();
                if (e.button === 2) { // 0 è sinistro, 1 è centrale, 2 è destro
                    isDraggingRightClick = true;
                    square.classList.remove('active');
                } else {
                    square.classList.add('active'); // Seleziona il primo quadrato
                }
                startSquare = square;
                isMouseDown = true;
                selectedSquares.clear(); // Pulisce le selezioni precedenti
                selectedSquares.add(square);
            });

            square.addEventListener('mouseover', (e: MouseEvent) => {
                if (!isMouseDown || !startSquare) return;
                const currentSquare = e.target as HTMLElement;
                if (currentSquare.classList.contains('grid-square') && !selectedSquares.has(currentSquare)) {
                    if (isDraggingRightClick) {
                        currentSquare.classList.remove('active', 'selected');
                    } else {
                        currentSquare.classList.add('active');
                    }
                    selectedSquares.add(currentSquare);
                }
            });
        });

        gridContainer.addEventListener('contextmenu', (e) => e.preventDefault());
        // Listener globale per 'mouseup' per fermare il tracciamento
        document.addEventListener('mouseup', (event: MouseEvent) => {
            if (isDraggingRightClick || isMouseDown) {
                event.preventDefault();
                isDraggingRightClick = false;
                isMouseDown = false;
                startSquare = null;
            }
        });
    }


    // Funzione per randomizzare un quadrato con annotazioni di tipo
    function randomizeSquare(): void {
        // Seleziona tutti gli elementi con la classe 'grid-square'
        const squares: NodeListOf<HTMLElement> = document.querySelectorAll('.grid-square.active');

        // Verifica se ci sono quadrati nella griglia
        if (squares.length === 0) {
            alert('Per favore, crea prima una griglia!');
            return;
        }

        // Rimuove la classe 'selected' da tutti i quadrati per deselezionare quello precedentemente evidenziato
        squares.forEach(square => square.classList.remove('selected'));

        // Calcola un indice casuale all'interno dell'array di quadrati
        const randomIndex: number = Math.floor(Math.random() * squares.length);

        // Aggiunge la classe 'selected' al quadrato scelto casualmente
        squares[randomIndex].classList.add('selected');
    }

    // Active every square selected.
    createGridBtn.addEventListener('click', () => {
        // Converte i valori degli input in numeri interi, gestendo potenziali valori non validi
        const rows: number = parseInt(rowsInput.value);
        const cols: number = parseInt(colsInput.value);

        // Verifica che i valori inseriti siano numeri positivi
        if (rows > 0 && cols > 0) {
            createGrid(rows, cols); // Chiama la funzione per creare la griglia
        } else {
            alert('Inserisci valori validi per righe e colonne.'); // Messaggio di errore se i valori non sono validi
        }
    });

    // Aggiunge i gestori degli eventi ai pulsanti
    createGridBtn.addEventListener('click', () => {
        // Converte i valori degli input in numeri interi, gestendo potenziali valori non validi
        const rows: number = parseInt(rowsInput.value);
        const cols: number = parseInt(colsInput.value);

        // Verifica che i valori inseriti siano numeri positivi
        if (rows > 0 && cols > 0) {
            createGrid(rows, cols); // Chiama la funzione per creare la griglia
        } else {
            alert('Inserisci valori validi per righe e colonne.'); // Messaggio di errore se i valori non sono validi
        }
    });

    randomizeBtn.addEventListener('click', randomizeSquare); // Chiama la funzione di randomizzazione al click del pulsante

    // Crea una griglia di dimensioni predefinite all'avvio della pagina
    createGrid(15, 15);
});
