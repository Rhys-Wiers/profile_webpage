// pages/simulations/fire.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    createAutomataModule?: any;
  }
}

const FireSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [Module, setModule] = useState<any>(null);
  const [gridPtr, setGridPtr] = useState<number | null>(null);

  const nrows = 50; // adjust grid size
  const ncols = 50;
  const cellSize = 10; // pixels per cell

  const cellColors: Record<string, string> = {
    b: "#000000", // burnt
    f: "#ff4500", // burning
    g: "#00ff00", // grass
    s: "#8b4513", // soil
    w: "#228B22", // woods
  };

  // 1️⃣ Load the Emscripten script dynamically
  useEffect(() => {
    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.createAutomataModule) return resolve();

        const script = document.createElement("script");
        script.src = "/automata.js";
        script.type = "text/javascript";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load automata.js"));
        document.body.appendChild(script);
      });
    };

    loadScript()
      .then(async () => {
        if (!window.createAutomataModule) {
          console.error("Emscripten module not found on window!");
          return;
        }
        const module = await window.createAutomataModule();
        setModule(module);

        // 2️⃣ Initialize grid
        const initialGrid = new Uint8Array(nrows * ncols).fill("g".charCodeAt(0));
        initialGrid[Math.floor((nrows * ncols) / 2)] = "f".charCodeAt(0);

        const cellsPtr = module._malloc(initialGrid.length);
        module.HEAPU8.set(initialGrid, cellsPtr);

        const init_simulation = module.cwrap("init_simulation", "number", [
          "number",
          "number",
          "number",
        ]);
        const ptr = init_simulation(nrows, ncols, cellsPtr);
        setGridPtr(ptr);

        module._free(cellsPtr);
      })
      .catch((err) => console.error(err));
  }, []);

  // 3️⃣ Run simulation loop
  useEffect(() => {
    if (!Module || gridPtr === null) return;

    const step_simulation = Module.cwrap("step_simulation", "number", ["number"]);
    const get_cells = Module.cwrap("get_cells", "number", ["number"]);

    let animationId: number;

    const render = () => {
      // Step simulation
      const updatedPtr = step_simulation(gridPtr);
      setGridPtr(updatedPtr);

      // Get cell data
      const cellsPtrOut = get_cells(updatedPtr);
      const flatGrid = Module.HEAPU8.slice(cellsPtrOut, cellsPtrOut + nrows * ncols);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      for (let r = 0; r < nrows; r++) {
        for (let c = 0; c < ncols; c++) {
          const charCode = flatGrid[r * ncols + c];
          const cellChar = String.fromCharCode(charCode);
          ctx.fillStyle = cellColors[cellChar] || "#000000";
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      if (gridPtr) {
        const free_simulation = Module.cwrap("free_simulation", null, ["number"]);
        free_simulation(gridPtr);
      }
    };
  }, [Module, gridPtr]);

  return (
    <main className="p-8 flex flex-col items-center">
      <h1 className="text-2xl mb-4">🔥 Fire Simulation</h1>
      <canvas
        ref={canvasRef}
        width={ncols * cellSize}
        height={nrows * cellSize}
        style={{ border: "1px solid black" }}
      />
    </main>
  );
};

export default FireSimulation;
