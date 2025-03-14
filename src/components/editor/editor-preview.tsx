import { useEditor } from "@/context/art-editor-context";
import { useEffect, useRef, WheelEvent } from "react";
import { BorderButton } from "../generic/rotmg-button";
import { RotMGify } from "@/utils/utility";
import ImageButton from "../generic/image-button";
import { SpriteMode } from "@/utils/constants";
import { Icons } from "@/resources/images";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 400;

export default function EditorPreview() {
    const { previewImage, artSize, zoomLevel, zoomIn, zoomOut, spriteMode } = useEditor();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const scrollAmount = 40 * 5;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth"
        });
    };

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
            {spriteMode === SpriteMode.CHARACTERS &&
                <div className="absolute w-full h-full flex items-end justify-center p-4 gap-x-5">
                    <ImageButton
                        title={"idle animation"}
                        totalSpritesX={5}
                        offset={5}
                        scale={2}
                        image={Icons}
                        onClick={() => { }}
                    />
                    <ImageButton
                        title={"walk animation"}
                        totalSpritesX={5}
                        offset={6}
                        scale={2}
                        image={Icons}
                        onClick={() => { }}
                    />
                    <ImageButton
                        title={"attack animation"}
                        totalSpritesX={5}
                        offset={7}
                        scale={2}
                        image={Icons}
                        onClick={() => { }}
                    />
                </div>}
            {spriteMode === SpriteMode.ANIMATED &&
                <div className="absolute w-full bottom-0 flex items-center justify-center p-4 gap-x-5">
                    <ImageButton
                        onClick={() => scroll("left")}
                        title={"left"}
                        totalSpritesX={5}
                        offset={37}
                        scale={2}
                        image={Icons}
                    />

                    <div
                        ref={scrollRef}
                        className="flex flex-row overflow-x-auto w-full whitespace-nowrap px-0 gap-x-1 bg-[rgba(0,0,0,0.10)]"
                    >
                        {[...".".repeat(20)].map((_, index) => (
                            <div
                                key={index}
                                className="border w-[40px] h-[40px] flex items-center justify-center flex-shrink-0 font-myriadpro"
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>

                    <ImageButton
                        onClick={() => scroll("right")}
                        title={"right"}
                        totalSpritesX={5}
                        offset={36}
                        scale={2}
                        image={Icons}
                    />
                </div>
            }
            <canvas ref={canvasRef} onWheel={onWheel} />
        </div>
    );
}