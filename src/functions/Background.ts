type BackType = 'earth' | 'rock' | 'wood';

function back(gridContainer: HTMLElement, backType: BackType) {
  let background = 1;
  switch (backType) {
    case "rock": background = 2; break;
    case "wood": background = 3; break;
  }
  gridContainer.style.backgroundImage = `url('./images/BackgroundTerrain${background}.jpg`;
}

export { BackType, back };