import { useEditor } from "@/context/art-editor-context";
import { TransparentTiles } from "@/resources/images";
import { useEffect, MouseEvent } from "react";

const MAX_EDITOR_WIDTH = 400;

export default function EditorCanvas() {
    const { artSize } = useEditor();

    const updateCanvasSize = (canvas: HTMLCanvasElement) => {
        if (canvas === null) {
            return;
        }

        const [sizeX, sizeY] = artSize;

        // fix the size to be of the new sprite size
        canvas.width = MAX_EDITOR_WIDTH;
        canvas.height = (sizeY / sizeX) * MAX_EDITOR_WIDTH;
    };

    const reRenderGrid = (canvas: HTMLCanvasElement) => {
        const context = canvas?.getContext("2d");

        if (context === null || canvas === null) {
            return;
        }

        // draw the grid
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "#FFFFFF";
        context.lineWidth = 0.5;
        context.globalAlpha = 1;

        const [sizeX, sizeY] = artSize;

        const cellSizeX = canvas.width / sizeX;
        const cellSizeY = canvas.height / sizeY;

        for (let y = 0; y < sizeY; y++) {
            for (let x = 0; x < sizeX; x++) {
                context.strokeRect(x * cellSizeX, y * cellSizeY,
                    cellSizeX - 0.5, cellSizeY - 0.5)
            }
        }
    };

    useEffect(() => {
        const mainCanvas = document.getElementById("main-canvas") as HTMLCanvasElement;
        const gridCanvas = document.getElementById("grid-canvas") as HTMLCanvasElement;

        updateCanvasSize(mainCanvas);
        updateCanvasSize(gridCanvas);

        reRenderGrid(gridCanvas);
    }, [artSize]);

    const onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {

    };

    const onMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {

    };

    return (
        <div className="grid">
            <canvas id="main-canvas" style={{
                gridRow: "1",
                gridColumn: "1",
                backgroundImage: `url(${TransparentTiles.src})`
            }}>
            </canvas>
            <canvas
                id="grid-canvas"
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                style={{
                    gridRow: "1",
                    gridColumn: "1",
                    zIndex: "1000",
                }}>
            </canvas>
        </div>
    );
}