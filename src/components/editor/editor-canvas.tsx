import { useEditor } from "@/context/art-editor-context";
import { TransparentTiles } from "@/resources/images";
import {
    useEffect,
    useRef,
    useState,
    useMemo,
    MouseEvent
} from "react";

const MAX_EDITOR_WIDTH = 400;

export default function EditorCanvas() {
    const {
        artSize,
        currentColor,
        getPixel,
        setPixel
    } = useEditor();
    const [mouseCell, setMouseCell] = useState({ x: 0, y: 0 });
    const [mouseDown, setMouseDown] = useState(false);

    // Refs for the canvas elements
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    const cellSize = useMemo(() => {
        const {x: sizeX, y: sizeY } = artSize;
        const canvasWidth = MAX_EDITOR_WIDTH;
        const canvasHeight = (sizeY / sizeX) * MAX_EDITOR_WIDTH;

        return {
            x: canvasWidth / sizeX,
            y: canvasHeight / sizeY,
        };
    }, [artSize]);

    const updateCanvasSize = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return;

        // Fix the size to be of the new sprite size
        canvas.width = MAX_EDITOR_WIDTH;
        canvas.height = (artSize.y / artSize.x) * MAX_EDITOR_WIDTH;
    };

    const reRenderGrid = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return;
        const context = canvas.getContext("2d");

        if (!context) return;

        // Draw the grid
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "#FFFFFF";
        context.lineWidth = 0.5;
        context.globalAlpha = 1;

        for (let y = 0; y < artSize.y; y++) {
            for (let x = 0; x < artSize.x; x++) {
                context.strokeRect(
                    x * cellSize.x,
                    y * cellSize.y,
                    cellSize.x - 0.5,
                    cellSize.y - 0.5
                );
            }
        }
    };

    useEffect(() => {
        const mainCanvas = mainCanvasRef.current;
        const gridCanvas = gridCanvasRef.current;

        updateCanvasSize(mainCanvas);
        updateCanvasSize(gridCanvas);

        reRenderGrid(gridCanvas);
    }, [artSize, cellSize]);

    const normalizeMousePosition = (
        x: number,
        y: number,
        canvas: HTMLCanvasElement
    ): [number, number] => {
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const mouseX = (x - rect.left) * scaleX;
        const mouseY = (y - rect.top) * scaleY;

        return [mouseX, mouseY];
    };

    const fillCell = (x: number, y: number, color: string) => {
        const context = mainCanvasRef.current?.getContext("2d");
        if (!context) return;

        context.fillStyle = color;
        context.fillRect(
            x * cellSize.x,
            y * cellSize.y,
            cellSize.x,
            cellSize.y
        );
    };

    const clearCell = (x: number, y: number) => {
        const context = mainCanvasRef.current?.getContext("2d");
        if (!context) return;
        context.clearRect(x * cellSize.x, y * cellSize.y, cellSize.x, cellSize.y);
    }

    const onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        const canvas = mainCanvasRef.current;
        if (!canvas) return;

        const [x, y] = normalizeMousePosition(event.clientX, event.clientY, canvas);

        // put the old cell back to its actual value
        const oldCell = getPixel(mouseCell.x, mouseCell.y);

        if (oldCell !== null) {
            fillCell(mouseCell.x, mouseCell.y, oldCell);
        } else {
            clearCell(mouseCell.x, mouseCell.y);
        }

        // Fill new cell
        const newCellX = Math.floor(x / cellSize.x);
        const newCellY = Math.floor(y / cellSize.y);

        fillCell(newCellX, newCellY, currentColor);
        // Report mouse cell
        setMouseCell({x: newCellX, y: newCellY});

        console.log(mouseDown, oldCell)
        if (mouseDown) {
            setPixel(newCellX, newCellY, currentColor);
        }
    };

    const onMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
        setMouseDown(true);

        const canvas = mainCanvasRef.current;
        if (!canvas) return;

        const [x, y] = normalizeMousePosition(event.clientX, event.clientY, canvas);
        const newCellX = Math.floor(x / cellSize.x);
        const newCellY = Math.floor(y / cellSize.y);
        
        setPixel(newCellX, newCellY, currentColor);
    };

    const onMouseUp = (event: MouseEvent<HTMLCanvasElement>) => {
        setMouseDown(false);        
    };

    const onMouseLeave = (event: MouseEvent<HTMLCanvasElement>) => {
        setMouseDown(false);
        clearCell(mouseCell.x, mouseCell.y);
    }

    return (
        <div className="grid">
            <canvas
                ref={mainCanvasRef}
                id="main-canvas"
                style={{
                    gridRow: "1",
                    gridColumn: "1",
                    backgroundImage: `url(${TransparentTiles.src})`,
                }}
            />
            <canvas
                ref={gridCanvasRef}
                id="grid-canvas"
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                style={{
                    gridRow: "1",
                    gridColumn: "1",
                    zIndex: "1000",
                }}
            />
        </div>
    );
}
