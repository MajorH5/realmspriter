import { useEditor } from "@/context/art-editor-context";
import { TransparentTiles } from "@/resources/images";
import { EditMode } from "@/utils/constants";
import { hexToRGB, RGBtohex } from "@/utils/utility";
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
        setPixel,
        image,
        editMode,
        setCurrentColor
    } = useEditor();
    const [mouseCell, setMouseCell] = useState({ x: 0, y: 0 });
    const [mouseDown, setMouseDown] = useState(false);
    const [mouseOver, setMouseOver] = useState(false);

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

    const interactWithPixel = (x: number, y: number) => {
        switch(editMode) {
            case EditMode.DRAW:
                setPixel(x, y, currentColor);     
                break;
            case EditMode.ERASE:
                setPixel(x, y, null);
                break;
            case EditMode.SAMPLE:
                const color = getPixel(x, y);

                if (color !== null) {
                    setCurrentColor(color);
                }
                break;
        }
    };

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
        context.strokeStyle = "#ffffff";
        context.lineWidth = 0.5;
        context.globalAlpha = 1;

        context.translate(0.5, 0.5);
        context.rect(0, 0, canvas.width - 1, canvas.height - 1);
        context.stroke();
        for (let y = 0; y <= artSize.y; y++) {
            for (let x = 0; x <= artSize.x; x++) {
                context.rect(
                    (x * cellSize.x),
                    (y * cellSize.y),
                    (cellSize.x),
                    (cellSize.y)
                );
                context.stroke();
            }
        }
        context.translate(-0.5, -0.5);
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

    const onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        const canvas = mainCanvasRef.current;
        if (!canvas) return;

        const [x, y] = normalizeMousePosition(event.clientX, event.clientY, canvas);

        const newCellX = Math.floor(x / cellSize.x);
        const newCellY = Math.floor(y / cellSize.y);
        
        if (mouseCell.x !== newCellX || mouseCell.y !== newCellY) {
            // Report mouse cell
            setMouseCell({x: newCellX, y: newCellY});
        }

        if (mouseDown) {
            interactWithPixel(newCellX, newCellY);
        }
    };

    const onMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
        setMouseDown(true);

        const canvas = mainCanvasRef.current;
        if (!canvas) return;

        const [x, y] = normalizeMousePosition(event.clientX, event.clientY, canvas);

        const newCellX = Math.floor(x / cellSize.x);
        const newCellY = Math.floor(y / cellSize.y);
        
        interactWithPixel(newCellX, newCellY);
    };

    const onMouseUp = (event: MouseEvent<HTMLCanvasElement>) => {
        setMouseDown(false);        
    };

    const onMouseLeave = (event: MouseEvent<HTMLCanvasElement>) => {
        setMouseDown(false);
        setMouseOver(false);
    };

    const onMouseEnter = (event: MouseEvent<HTMLCanvasElement>) => {
        setMouseOver(true);
    };

    useEffect(() => {
        const canvas = mainCanvasRef.current;
        const context = canvas?.getContext("2d");
        
        if (!canvas || !context) return;

        const pixels = image.pixels.slice();

        if (mouseOver) {
            const index = (mouseCell.y * artSize.x + mouseCell.x) * 4;
            
            switch (editMode) {
                case EditMode.DRAW:
                    const { r, g, b } = hexToRGB(currentColor);

                    pixels[index + 0] = r;
                    pixels[index + 1] = g;
                    pixels[index + 2] = b;
                    pixels[index + 3] = 255;
                    break;
                case EditMode.ERASE:
                    pixels[index + 0] = 0;
                    pixels[index + 1] = 0;
                    pixels[index + 2] = 0;
                    pixels[index + 3] = 0;
                    break;
                case EditMode.SAMPLE:
                    const alpha = pixels[index + 3];

                    if (alpha !== 0) {
                        pixels[index + 3] = Math.floor(255 / 2);
                    }
                    break;
                default:
                    break;
            }
        }

        const imageCanvas = document.createElement("canvas");
        const imageContext = imageCanvas.getContext("2d")!;

        imageCanvas.width = artSize.x;
        imageCanvas.height = artSize.y;

        const imageData = new ImageData(pixels, artSize.x, artSize.y);
        imageContext.putImageData(imageData, 0, 0);

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = false;
        context.drawImage(imageCanvas, 0, 0,
            imageCanvas.width, imageCanvas.height,
            0, 0, canvas.width, canvas.height);
    }, [image, mouseCell]);

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
                onMouseEnter={onMouseEnter}
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
