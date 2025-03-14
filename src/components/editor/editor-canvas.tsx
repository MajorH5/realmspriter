import { useEditor } from "@/context/art-editor-context";
import { TransparentTiles } from "@/resources/images";
import { EditMode, SpriteMode } from "@/utils/constants";
import { hexToRGB, RGBtohex } from "@/utils/utility";
import {
    useEffect,
    useRef,
    useState,
    useMemo,
    MouseEvent,
    TouchEvent
} from "react";
import { BorderButton } from "../generic/rotmg-button";
import { ActionType } from "@/context/history/history-types";
import { useHistory } from "@/context/history/history-context";
import { normalizeMousePosition } from "@/utils/utility";

const MAX_EDITOR_WIDTH = 400;

export default function EditorCanvas() {
    const {
        artSize,
        visualColor,
        getPixel,
        setPixel,
        image,
        editMode,
        setCurrentColor,
        setPreviewImage,
        spriteMode
    } = useEditor();
    const [mouseCell, setMouseCell] = useState({ x: 0, y: 0 });
    const [mouseDown, setMouseDown] = useState(false);
    const [mouseOver, setMouseOver] = useState(false);

    // Refs for the canvas elements
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    const { closeCurrentAction } = useHistory();

    const cellSize = useMemo(() => {
        const { x: sizeX, y: sizeY } = artSize;
        const canvasWidth = MAX_EDITOR_WIDTH;
        const canvasHeight = (sizeY / sizeX) * MAX_EDITOR_WIDTH;

        return {
            x: canvasWidth / sizeX,
            y: canvasHeight / sizeY,
        };
    }, [artSize]);

    const interactWithPixel = (x: number, y: number) => {
        switch (editMode) {
            case EditMode.DRAW:
                setPixel(x, y, visualColor, true);
                break;
            case EditMode.ERASE:
                setPixel(x, y, null, true);
                break;
            case EditMode.SAMPLE:
                const color = getPixel(x, y);

                if (color !== null) {
                    setCurrentColor(color, 0);
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

        const gridCavnas = document.createElement("canvas");
        const gridContext = gridCavnas.getContext("2d")!;

        gridCavnas.width = cellSize.x * 2;
        gridCavnas.height = cellSize.y * 2;

        gridContext.strokeStyle = '#ffffff';
        gridContext.lineWidth = 1;

        gridContext.translate(0.5, 0.5);
        gridContext.rect(0, 0, gridCavnas.width, gridCavnas.height);
        gridContext.stroke();
        gridContext.translate(-0.5, -0.5);

        const pattern = context.createPattern(gridCavnas, "repeat")!;
        const transform = new DOMMatrix();
        pattern.setTransform(transform.scale(0.5));

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = pattern;
        // TODO: Fix anti-aliasing problem from above
        //       causing low opacity with fillRect
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#ffffff';
        context.lineWidth = 1;
        context.translate(0.5, 0.5);
        context.rect(0, 0, canvas.width - 1, canvas.height - 1);
        context.stroke();
        context.translate(-0.5, -0.5);
    };

    useEffect(() => {
        const mainCanvas = mainCanvasRef.current;
        const gridCanvas = gridCanvasRef.current;

        updateCanvasSize(mainCanvas);
        updateCanvasSize(gridCanvas);

        reRenderGrid(gridCanvas);
    }, [artSize, cellSize]);

    const onMouseMove = ({ clientX, clientY }: { clientX: number, clientY: number }) => {
        const canvas = mainCanvasRef.current;
        if (!canvas) return;

        const [x, y] = normalizeMousePosition(clientX, clientY, canvas);

        const newCellX = Math.floor(x / cellSize.x);
        const newCellY = Math.floor(y / cellSize.y);

        if (mouseCell.x !== newCellX || mouseCell.y !== newCellY) {
            setMouseCell({ x: newCellX, y: newCellY });
        }

        if (mouseDown) {
            interactWithPixel(newCellX, newCellY);
        }
    };

    const onTouchMove = (event: TouchEvent<HTMLCanvasElement>) => {
        setMouseDown(true);
        const changedTouches = event.changedTouches;

        for (let i = 0; i < changedTouches.length; i++) {
            const { clientX, clientY } = changedTouches[i];

            onMouseMove({ clientX, clientY });
        }
    }

    const onMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
        setMouseDown(true);

        const canvas = mainCanvasRef.current;
        if (!canvas) return;

        const [x, y] = normalizeMousePosition(event.clientX, event.clientY, canvas);

        const newCellX = Math.floor(x / cellSize.x);
        const newCellY = Math.floor(y / cellSize.y);

        interactWithPixel(newCellX, newCellY);
    };

    const onMouseUp = () => {
        setMouseDown(false);
        closeCurrentAction(ActionType.PIXEL_EDIT);
    };

    const onMouseLeave = () => {
        setMouseDown(false);
        setMouseOver(false);
    };

    const onMouseEnter = () => {
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
                    const { r, g, b } = hexToRGB(visualColor);

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

        context.translate(0.5, 0.5);
        context.drawImage(imageCanvas, 0, 0,
            imageCanvas.width, imageCanvas.height,
            0, 0, canvas.width, canvas.height);
        context.translate(-0.5, -0.5);

        setPreviewImage({ pixels });
    }, [image, mouseCell, mouseOver]);

    return (
        <div className="grid relative">
            {spriteMode === SpriteMode.CHARACTERS &&
                <div className="absolute flex gap-1 justify-center w-full h-[30px] -top-10 whitespace-nowrap">
                    <BorderButton className="h-full w-[70px] text-[0.98rem] text-center">Stand</BorderButton>
                    <BorderButton className="h-full w-[70px] text-[0.98rem] text-center">Walk 1</BorderButton>
                    <BorderButton className="h-full w-[70px] text-[0.98rem] text-center">Walk 2</BorderButton>
                    <BorderButton className="h-full w-[70px] text-[0.98rem] text-center">Attack 1</BorderButton>
                    <BorderButton className="h-full w-[70px] text-[0.98rem] text-center">Attack 2</BorderButton>
                </div>
            }
            <canvas
                className="select-none"
                ref={mainCanvasRef}
                id="main-canvas"
                style={{
                    gridRow: "1",
                    gridColumn: "1",
                    backgroundImage: `url(${TransparentTiles.src})`,
                    WebkitTouchCallout: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none",

                }}
            />
            <canvas
                className="select-none"
                ref={gridCanvasRef}
                id="grid-canvas"
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onTouchMove={onTouchMove}
                onMouseUp={onMouseUp}
                style={{
                    gridRow: "1",
                    gridColumn: "1",
                    zIndex: "1000",
                    WebkitTouchCallout: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none",
                }}
            />
        </div>
    );
}
