
//we only allow these five cell types, and store how long it's been in that state
export interface Cell {
    type: 'b' | 'f' | 's' | 'w' | 'g';
    step: number; 
}

//store the cells as a 2D array along with dimensions
export interface Grid {
    nrows: number;
    ncols: number;
    cells: Cell[][];
}

//initialize the simulation grid withnrows and ncols, and an optional initial state
export function initSimulation(nrows: number, ncols: number, initial?: Cell[][]): Grid {
    if (initial) {
        return {
            nrows,
            ncols,
            cells: initial,
        };
    }

    //if no initial state provided, default initial state is all grass
    const cells: Cell[][] = [];
    for (let r = 0; r < nrows; r++) {
        const row: Cell[] = [];
        for (let c = 0; c < ncols; c++) {
            row.push({ type: 'g', step: 0 });
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
export function stepSimulation(grid: Grid): Grid {
    const nrows = grid.nrows;
    const ncols = grid.ncols;

    const resultingCells: Cell[][] = Array.from({ length: nrows }, () =>
        Array.from({ length: ncols }, () => ({ type: 'g', step: 0 }))
    );

    let paddedCells: Cell[][] = Array.from({ length: nrows + 2 }, () =>
        Array.from({ length: ncols + 2 }, () => ({ type: 'g', step: 0 }))
    );

    //set border cells using reflective boundary conditions
    for (let r = 0; r < grid.nrows+2; r++) {
        for (let c = 0; c < grid.ncols+2; c++) {
            const rr = Math.min(Math.max(r-1, 0), grid.nrows-1);
            const cc = Math.min(Math.max(c-1, 0), grid.ncols-1);
            paddedCells[r][c] = {... grid.cells[rr][cc]};
        }
    }

    //loop through each cell in the grid to update
    for (let r = 1; r <= grid.nrows; r++) {
        for (let c = 1; c <= grid.ncols; c++) {
            const neighbors: Cell[] = new Array(8);

            //get the neighboring cells (up, down, left, right, diagonals)
            neighbors[0] = paddedCells[r-1][c]; //up
            neighbors[1] = paddedCells[r+1][c]; //down
            neighbors[2] = paddedCells[r][c-1]; //left
            neighbors[3] = paddedCells[r][c+1]; //right
            neighbors[4] = paddedCells[r-1][c-1]; //up-left
            neighbors[5] = paddedCells[r-1][c+1]; //up-right
            neighbors[6] = paddedCells[r+1][c-1]; //down-left
            neighbors[7] = paddedCells[r+1][c+1]; //down-right
            
            
            //count the number of each cell type in the neighbors
            const countFire = neighbors.filter(n => n.type === 'f').length;
            const countBurnt = neighbors.filter(n => n.type === 'b').length;
            const countGrass = neighbors.filter(n => n.type === 'g').length;
            const countSoil = neighbors.filter(n => n.type === 's').length;
            const countWoods = neighbors.filter(n => n.type === 'w').length;

            //apply rules based on current cell type
            let cellToUpdate = resultingCells[r-1][c-1];
            const curType = paddedCells[r][c].type;
            const curStep = paddedCells[r][c].step;

            if (curType === 'g') {
				if (countFire >= 2) {
					cellToUpdate.type = 'f';
					cellToUpdate.step = 0;
				}
			} else if (curType === 'w') {
				if (countFire >= 4) {
					cellToUpdate.type = 'f';
					cellToUpdate.step = 0;
				}
			} else if (curType === 'f') {
				if (curStep >= 2) { 
                    (cellToUpdate.type = 'b', cellToUpdate.step = 0);
                } else { 
                    (cellToUpdate.type = curType, cellToUpdate.step = curStep + 1); 
                }

			} else if (curType === 'b') {
				if (curStep >= 2) {
                    (cellToUpdate.type = 's', cellToUpdate.step = 0);
                } else {
                    (cellToUpdate.type = curType, cellToUpdate.step = curStep + 1);
                }

			} else {
				if (countGrass >= 3) {
					cellToUpdate.type = 'g';
					cellToUpdate.step = 0;
				}
				else if(countWoods >=5) {
					cellToUpdate.type = 'w';
					cellToUpdate.step = 0;
				}
			}
        }
    }
    return {...grid, cells: resultingCells};
}