
//we only allow these five cell types: b is a burnt cell, f is a cell on fire, s is soil, w is woods, g is grass
export type cell = 'b' | 'f' | 's' | 'w' | 'g';

//store nrows and ncols to make it easier to loop through and display the grid, and store the cells as a 2D array
export interface Grid {
    nrows: number;
    ncols: number;
    cells: cell[][];
}

//initialize the simulation grid with given number of rows and columns, and an optional initial state
export function init_simulation(nrows: number, ncols: number, initial?: cell[][]): Grid {
    if (initial) {
        return {
            nrows,
            ncols,
            cells: initial,
        };
    }

    //if no initial state provided, default initial state is all grass
    const cells: cell[][] = [];
    for (let r = 0; r < nrows; r++) {
        const row: cell[] = [];
        for (let c = 0; c < ncols; c++) {
            row.push('g');
        }
        cells.push(row);
    }

    return {
        nrows,
        ncols,
        cells,
    }; 
}

//step the simulation forward once
export function step_simulation(grid: Grid): Grid {
    const newCells = [...grid.cells];

    //loop through each cell in the grid to update
    for (let r = 0; r < grid.nrows; r++) {
        for (let c = 0; c < grid.ncols; c++) {
            const neighbors: cell[] = [];
            const oldCell = grid.cells[r][c];
            const newCell = newCells[r][c];

            //get the neighboring cells (up, down, left, right, diagonals)

            //LEFT OFF HERE ****************
        }
    }
    return {...grid, cells: newCells};
}