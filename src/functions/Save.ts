
interface SquareState {
  s: boolean;
}

// Assumendo che 'gridContainer' sia il contenitore della tua griglia
export function saveMapToLocalStorage(gridContainer: HTMLElement): void {
  const squares = Array.from(gridContainer.children) as HTMLElement[];
  const mapData: SquareState[] = squares.map(square => ({
    s: square.classList.contains('active')
  }));

  // Serializza i dati in una stringa JSON
  const serializedMap = JSON.stringify(mapData);

  // Salva la stringa nel LocalStorage con una chiave
  localStorage.setItem('savedMap', serializedMap);
  console.log('Mappa salvata con successo.');
}

export function loadMapFromLocalStorage(gridContainer: HTMLElement): void {
  // Recupera la stringa serializzata
  const serializedMap = localStorage.getItem('savedMap');

  if (serializedMap) {
    try {
      // Deserializza la stringa in un array di oggetti
      const mapData: SquareState[] = JSON.parse(serializedMap);
      const squares = Array.from(gridContainer.children) as HTMLElement[];

      // Assicurati che le dimensioni della griglia corrispondano ai dati salvati
      if (mapData.length === squares.length) {
        // Applica lo stato salvato a ogni quadrato della griglia
        mapData.forEach((data, index) => {
          if (data.s) {
            squares[index].classList.add('active');
          } else {
            squares[index].classList.remove('active');
          }
        });
        console.log('Mappa caricata con successo.');
      } else {
        console.warn('Le dimensioni della griglia non corrispondono ai dati salvati.');
      }
    } catch (e) {
      console.error('Errore durante la deserializzazione dei dati.', e);
    }
  } else {
    console.log('Nessuna mappa salvata trovata.');
  }
}