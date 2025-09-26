
// Interface for the state of a single square
interface SquareState {
  s: boolean;
}

// Interface for the saved map data, including square states and dimensions
interface MapData {
  rows: number;
  cols: number;
  squares: SquareState[];
}

// Interface for the list of saved map names
interface SavedMapNames {
  names: string[];
}

// Filter map name for technical ID.
const mapNameFn = (mapName: string) => mapName.replaceAll(' ', '');

function saveMapToLocalStorage(gridContainer: HTMLElement, mapName: string, gridRows: number, gridCols: number): void {
  const squares = Array.from(gridContainer.children) as HTMLElement[];
  const mapData: MapData = {
    rows: gridRows,
    cols: gridCols,
    squares: squares.map(square => ({
      s: square.classList.contains('active')
    }))
  };

  const mapNameFiltered = mapNameFn(mapName);

  // Add option to saved maps.
  const mapNames = (document.getElementById('map-names') as HTMLSelectElement);
  const newOption = document.createElement('option');
  newOption.value = mapNameFiltered; // Il valore effettivo dell'opzione
  newOption.textContent = mapName; // Il testo visibile all'utente
  mapNames.appendChild(newOption);

  // Save the map data under a unique key
  localStorage.setItem(`savedMap_${mapNameFiltered}`, JSON.stringify(mapData));

  // Get and update the list of saved map names
  let mapNamesArray: string[] = [];
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

function loadMapFromLocalStorage(mapName: string): MapData | null {
  const mapNameFiltered = mapNameFn(mapName);
  const serializedMap = localStorage.getItem(`savedMap_${mapNameFiltered}`);

  if (serializedMap) {
    try {
      const mapData: MapData = JSON.parse(serializedMap);
      console.log(`Map "${mapName}" loaded successfully.`);
      return mapData;
    } catch (e) {
      console.error('Error deserializing data.', e);
      return null;
    }
  } else {
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

function getSavedMapNames(): string[] {
  const savedNames = localStorage.getItem('mapNames');
  if (savedNames) {
    try {
      return JSON.parse(savedNames) as string[];
    } catch (e) {
      console.error('Error reading saved map names list.', e);
      return [];
    }
  }
  return [];
}

function removeMapFromLocalStorage(mapName: string): void {
  const mapNameFiltered = mapNameFn(mapName);

  // Remove the map data itself
  localStorage.removeItem(`savedMap_${mapNameFiltered}`);

  // Get and update the list of saved map names
  let mapNames: string[] = [];
  const savedNames = localStorage.getItem('mapNames');
  if (savedNames) {
    mapNames = JSON.parse(savedNames);
  }

  // Filter out the name to be removed
  const updatedMapNames = mapNames.filter(name => name !== mapName);
  localStorage.setItem('mapNames', JSON.stringify(updatedMapNames));

  console.log(`Map "${mapName}" removed successfully.`);
}

export { saveMapToLocalStorage, loadMapFromLocalStorage, getSavedMapNames, removeMapFromLocalStorage, MapData };