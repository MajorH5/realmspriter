import { useEditor } from "@/context/art-editor-context";
import { useEffect, useRef, WheelEvent } from "react";
import { BorderButton } from "../generic/rotmg-button";
import { RotMGify } from "@/utils/utility";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 400;

export default function EditorPreview() {
    const { previewImage, artSize, zoomLevel, zoomIn, zoomOut } = useEditor();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const { current: canvas } = canvasRef;

        if (canvas !== null) {
            canvas.width = CANVAS_WIDTH - 2;
            canvas.height = CANVAS_HEIGHT - 2;
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context || previewImage === null) return;

        const newSize = { x: (artSize.x + 2) * 5, y: (artSize.y + 2) * 5 }
        
        const renderCanvas = document.createElement("canvas");
        const renderContext = renderCanvas.getContext("2d")!;

        renderCanvas.width = newSize.x;
        renderCanvas.height = newSize.y;
        
        const pixels = RotMGify(previewImage.pixels, artSize.x, artSize.y);
        const imageData = new ImageData(pixels, newSize.x, newSize.y);
        
        renderContext.putImageData(imageData, 0, 0);

        const zoom = zoomLevel / 100;
        const renderSize = { x: newSize.x * zoom, y: newSize.y * zoom }

        context.shadowColor = "black";
        context.shadowBlur = 5;
        context.imageSmoothingEnabled = false;
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(renderCanvas,
            (CANVAS_WIDTH - renderSize.x) / 2, (CANVAS_HEIGHT - renderSize.y) / 2,
            renderSize.x, renderSize.y
        );
    }, [previewImage, zoomLevel]);

    const onWheel = (event: WheelEvent<HTMLCanvasElement>) => {
        const direction = Math.sign(event.deltaY) * -1;

        if (direction < 0) zoomOut();
        if (direction > 0) zoomIn();
    };

    return (
        <div className="block sm:block relative border border-white w-[300px] h-[400px] bg-[#808080]">
            <div className="absolute w-full flex justify-between p-2">
                <p className="font-white text-white font-myriadpro font-light"><b>{zoomLevel.toString()}%</b></p>
                <div className="h-full flex gap-2">
                    <BorderButton
                        className="!border-[1px] !p-0 w-[16px] h-[16px] text-md text-center"
                        onClick={() => zoomOut()}
                    >
                        -
                    </BorderButton>
                    <BorderButton
                        className="!border-[1px] !p-0 w-[16px] h-[16px] text-md text-center"
                        onClick={() => zoomIn()}
                    >
                        +
                    </BorderButton>
                </div>
            </div>
            <canvas ref={canvasRef} onWheel={onWheel} />
        </div>
    );
}