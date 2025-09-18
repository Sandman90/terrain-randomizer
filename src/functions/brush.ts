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
    const aboveIndex = currentIndex - cols;
    const belowIndex = currentIndex + cols;
    if (aboveIndex >= 0) squares[aboveIndex].classList.add('active');
    if (belowIndex < squares.length) squares[belowIndex].classList.add('active');
}

function brushBox(squaresArray: HTMLElement[], e: EventTarget | null, squares: NodeListOf<HTMLElement>, cols: number) {
    const currentIndex = squaresArray.indexOf(e as HTMLElement);
    const aboveIndex = currentIndex - cols;
    const belowIndex = currentIndex + cols;
    if (aboveIndex >= 0) squares[aboveIndex].classList.add('active');
    if (belowIndex < squares.length) squares[belowIndex].classList.add('active');
}

export { BrushType, brush };