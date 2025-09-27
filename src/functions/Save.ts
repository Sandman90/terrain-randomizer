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

// Interface for the list of saved map names and values
interface SavedMapName {
  name: string;
  value: string;
}

// Filter map name for technical ID.
const mapNameFn = (mapName: string) => mapName.replaceAll(' ', '');

// ---

function saveMapToLocalStorage(gridContainer: HTMLElement, mapName: string, gridRows: number, gridCols: number, backType: string = 'earth'): void {
  const squares = Array.from(gridContainer.children) as HTMLElement[];
  const mapNameFiltered = mapNameFn(mapName);

  const mapData: MapData = {
    rows: gridRows,
    cols: gridCols,
    back: backType as BackType,
    squares: squares.map(square => ({
      s: square.classList.contains('active')
    }))
  };

  // Add option to saved maps. This part of the DOM manipulation remains the same.
  const mapNamesSelect = (document.getElementById('map-names') as HTMLSelectElement);
  const newOption = document.createElement('option');
  newOption.value = mapNameFiltered;
  newOption.textContent = mapName;
  mapNamesSelect.appendChild(newOption);

  // Save the map data under a unique key
  localStorage.setItem(`savedMap_${mapNameFiltered}`, JSON.stringify(mapData));

  // Get and update the list of saved map names (now SavedMapName objects)
  let mapNamesArray: SavedMapName[] = [];
  const savedNames = localStorage.getItem('mapNames');
  if (savedNames) {
    // Cast the parsed array to the correct interface
    mapNamesArray = JSON.parse(savedNames) as SavedMapName[];
  }

  // Create the new map entry object
  const newMapEntry: SavedMapName = { name: mapName, value: mapNameFiltered };

  // Add the new map name if its value (technical ID) doesn't exist
  if (!mapNamesArray.some(item => item.value === mapNameFiltered)) {
    mapNamesArray.push(newMapEntry);
    localStorage.setItem('mapNames', JSON.stringify(mapNamesArray));
  }

  console.log(`Map "${mapName}" saved successfully.`);
}

// ---

function loadMapFromLocalStorage(mapValue: string): MapData | null {
  // Use the map value (which is the filtered name/technical ID) for retrieval
  const serializedMap = localStorage.getItem(`savedMap_${mapValue}`);

  if (serializedMap) {
    try {
      const mapData: MapData = JSON.parse(serializedMap);
      // We don't have the original name here, but the data is loaded
      console.log(`Map data loaded successfully for value: ${mapValue}`);
      return mapData;
    } catch (e) {
      console.error('Error deserializing data.', e);
      return null;
    }
  } else {
    console.log(`No saved map found with value: ${mapValue}`);
    return null;
  }
}

function getSavedMapNames(): void {
  const savedNames = localStorage.getItem('mapNames');
  let savedNamesArray: SavedMapName[] = [];
  if (savedNames) {
    try {
      // Cast the parsed array to the correct interface
      savedNamesArray = JSON.parse(savedNames) as SavedMapName[];
    } catch (e) {
      console.error('Error reading saved map names list.', e);
      return; // Exit if parsing fails
    }

    const mapNamesSelect = document.getElementById('map-names') as HTMLSelectElement;

    // Clear existing options to prevent duplicates on reload
    mapNamesSelect.innerHTML = '';

    savedNamesArray.forEach((mapEntry: SavedMapName) => {
      const newOption = document.createElement('option');
      newOption.value = mapEntry.value; // Use the stored value (filtered name)
      newOption.textContent = mapEntry.name; // Use the stored name (original name)
      mapNamesSelect.appendChild(newOption);
    });
  }
}

function removeMapFromLocalStorage(mapName: string): void {
  const mapValue = mapNameFn(mapName);
  // Use the mapValue (filtered name) to remove the map data
  localStorage.removeItem(`savedMap_${mapValue}`);

  // Get and update the list of saved map names (SavedMapName objects)
  let mapNamesArray: SavedMapName[] = [];
  const savedNames = localStorage.getItem('mapNames');
  if (savedNames) mapNamesArray = JSON.parse(savedNames) as SavedMapName[];

  // Filter out the entry based on its value (technical ID)
  const updatedMapNamesArray = mapNamesArray.filter(entry => entry.value !== mapValue);
  localStorage.setItem('mapNames', JSON.stringify(updatedMapNamesArray));

  // Remove the option from the HTML Select element
  const mapNamesSelect = document.getElementById('map-names') as HTMLSelectElement;

  if (mapNamesSelect) {
    const mapValueFiltered = mapNameFn(mapName); // Re-filter if mapValue isn't used directly

    // Iterate over all options in the select element
    for (let i = 0; i < mapNamesSelect.options.length; i++) {
      const option = mapNamesSelect.options[i];

      // Match the option's value against the mapValue (filtered name)
      if (option.value === mapValue) {
        mapNamesSelect.remove(i);
        console.log(`Option for map "${mapName}" removed from select.`);
        break;
      }
    }
  } else {
    console.warn('Select element with ID "map-names" not found.');
  }

  console.log(`Map "${mapName}" removed successfully.`);
}

export { saveMapToLocalStorage, loadMapFromLocalStorage, getSavedMapNames, removeMapFromLocalStorage, MapData };