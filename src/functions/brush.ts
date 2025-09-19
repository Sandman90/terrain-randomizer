type BrushType = 'point' | 'cross' | 'box';

function brush(brushType: BrushType, squaresArray: HTMLElement[], e: EventTarget | null, squares: NodeListOf<HTMLElement>, cols: number) {
    switch (brushType) {
        case "point":
            break;
        case "cross":
            brushCross(squaresArray, e, squares, cols);
            break;
        case "box":
            brushBox(squaresArray, e, squares, cols);
            break;
    }
}

function brushCross(squaresArray: HTMLElement[], e: EventTarget | null, squares: NodeListOf<HTMLElement>, cols: number) {
    const currentIndex = squaresArray.indexOf(e as HTMLElement);
    // Up/Down.
    const aboveIndex = currentIndex - cols;
    if (aboveIndex >= 0) squares[aboveIndex].classList.add('active');
    const belowIndex = currentIndex + cols;
    if (belowIndex < squares.length) squares[belowIndex].classList.add('active');
    // Left/Right.
    const beforeIndex = currentIndex - 1;
    if (beforeIndex >= 0 && beforeIndex % cols !== (cols-1)) squares[beforeIndex].classList.add('active');
    const afterIndex = currentIndex + 1;
    if (afterIndex < squares.length && afterIndex % cols !== 0) squares[afterIndex].classList.add('active');
    // console.log('beforeIndex: ', beforeIndex, 'afterIndex:', afterIndex, 'Mod: ', beforeIndex % cols, (cols-1));
}

function brushBox(squaresArray: HTMLElement[], e: EventTarget | null, squares: NodeListOf<HTMLElement>, cols: number) {
    const currentIndex = squaresArray.indexOf(e as HTMLElement);
    // Up/Down.
    const aboveIndex = currentIndex - cols;
    if (aboveIndex - 1 >= 0) {
        squares[aboveIndex - 1].classList.add('active');
        squares[aboveIndex + 1].classList.add('active');
    }
    const belowIndex = currentIndex + cols;
    if (belowIndex + 1 < squares.length) {
        squares[belowIndex - 1].classList.add('active');
        squares[belowIndex + 1].classList.add('active');
    }
    brushCross(squaresArray, e, squares, cols);
}

export { BrushType, brush };