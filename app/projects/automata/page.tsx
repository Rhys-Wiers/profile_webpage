
'use client';
import React, { useEffect, useState } from "react";
import { initSimulation, stepSimulation, Grid, Cell } from "@/lib/automata";

interface CellColors {
    f: string;
    g: string;
    w: string;
    s: string;
    b: string;
}

const cellColors: CellColors = {
    f: '#e7640dff',
    g: '#3cb043',
    w: '#1b551bff',
    s: '#68320cff',
    b: "#262626ff",
};

const DisplayCell = ({ cell }: { cell: Cell }) => {
    let color = cellColors[cell.type] || '#ffffff';
    
    return (
        <div 
            className="border w-full h-full" 
            style={{ backgroundColor: color}}
        ></div>
    );
}

export default function board() {
    const nrows = 120;
    const ncols = 120;

    const [grid, setGrid] = useState<Grid | null>(null);

    useEffect(() => {
        const generateRandomBoard = (): Grid => {
            const cellTypes: Cell['type'][] = ['s', 'g', 'w', 'b'];
            const cells: Cell[][] = Array.from({ length: nrows }, () =>
                Array.from({ length: ncols }, () => {
                    const type: Cell['type'] = Math.random() < 0.1 ? 'f' : cellTypes[Math.floor(Math.random() * cellTypes.length)];
                    return { type, step: 0 };
                })
            );
            return { nrows, ncols, cells };
        };
        setGrid(generateRandomBoard());
    }, []);

    useEffect(() => {
        if (!grid) return;

        const interval = setInterval(() => {
            setGrid(prev => prev ? stepSimulation(prev): null);
        }, 500);
        return () => clearInterval(interval);
    }, [grid]);

    if (!grid) return;

    return (
        <main className="min-h-screen flex flex-col items-center  justify-center">
            <h1 className="text-xl mb-4"> Fire Simulation</h1>

            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${grid.ncols}, 0.5rem)`,
                    gridTemplateRows: `repeat(${grid.nrows}, 0.5rem)`,
                }}
            >
                {grid.cells.map((row, r) => 
                    row.map((cell, c) => (
                        <DisplayCell key={`${r}-${c}`} cell={cell} />
                    ))
                )}
            </div>
        </main>
    );
}
