
// Funzione per randomizzare un quadrato con annotazioni di tipo
export default function randomize(): void {
  // Seleziona tutti gli elementi con la classe 'grid-square'
  const squares: NodeListOf<HTMLElement> = document.querySelectorAll('.grid-square.active');

  // Verifica se ci sono quadrati nella griglia
  if (squares.length === 0) {
    alert('Create a grid first.');
    return;
  }

  // Rimuove la classe 'selected' da tutti i quadrati per deselezionare quello precedentemente evidenziato
  squares.forEach(square => square.classList.remove('selected'));

  // Calcola un indice casuale all'interno dell'array di quadrati
  const randomIndex: number = Math.floor(Math.random() * squares.length);

  // Aggiunge la classe 'selected' al quadrato scelto casualmente
  squares[randomIndex].classList.add('selected');
}