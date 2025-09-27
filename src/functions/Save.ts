
// Interface for the state of a single square
import {BackType} from "./Background";

interface SquareState {
  s: boolean;
}

// Interface for the saved map data, including square states and dimensions
interface MapData {
  rows: number;
  cols: number;
  back: BackType;
  squares: SquareState[];
}

// Interface for the list of saved map names
interface SavedMapNames {
  names: string[];
}

// Filter map name for technical ID.
const mapNameFn = (mapName: string) => mapName.replaceAll(' ', '');

function saveMapToLocalStorage(gridContainer: HTMLElement, mapName: string, gridRows: number, gridCols: number, backType: string = 'earth'): void {
  const squares = Array.from(gridContainer.children) as HTMLElement[];
  const mapData: MapData = {
    rows: gridRows,
    cols: gridCols,
    back: backType as BackType,
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

function getSavedMapNames(): void {
  const savedNames = localStorage.getItem('mapNames');
  let savedNamesArray: string[] = [];
  if (savedNames) {
    try {
      savedNamesArray = JSON.parse(savedNames) as string[];
    } catch (e) {
      console.error('Error reading saved map names list.', e);
    }
    const mapNamesSelect = document.getElementById('map-names') as HTMLSelectElement;
    savedNamesArray.forEach((mapName: string) => {
      const newOption = document.createElement('option');
      newOption.value = mapNameFn(mapName); // Il valore effettivo dell'opzione
      newOption.textContent = mapName; // Il testo visibile all'utente
      mapNamesSelect.appendChild(newOption);
    });
  }
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
  // Get the select element
  const mapNamesSelect = document.getElementById('map-names') as HTMLSelectElement;
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
  } else {
    console.warn('Select element with ID "map-names" not found.');
  }

  console.log(`Map "${mapName}" removed successfully.`);
}

export { saveMapToLocalStorage, loadMapFromLocalStorage, getSavedMapNames, removeMapFromLocalStorage, MapData };