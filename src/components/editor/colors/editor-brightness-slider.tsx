import { useEditor } from "@/context/art-editor-context";
import { useMouseTracker } from "@/hooks/hooks";
import { useEffect, useMemo, useRef, useState } from "react";

export default function EditorBrightnessSlider() {
    const brightnessCanvas = useRef<HTMLCanvasElement>(null);
    const { currentColor, colorBrightness, setColorBrightness } = useEditor();
    const sliderPosition = useMemo(() => {
        const canvas = brightnessCanvas.current;
        if (canvas === null) return 0;

        return colorBrightness * canvas.height;
    }, [colorBrightness]);


    const renderBrightnessSlider = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        // draws a wide gradient from
        // black -> white
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, currentColor);
        gradient.addColorStop(1, 'black');

        context.globalAlpha = 1;
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const onMouseEvent = (x: number, y: number) => {
        const canvas = brightnessCanvas.current;
        if (canvas === null) return;
    
        setColorBrightness(y / canvas.height);
    };

    useMouseTracker(brightnessCanvas, {
        onMove: onMouseEvent,
        onDown: onMouseEvent
    });

    useEffect(() => {
        const canvas = brightnessCanvas.current;
        if (!canvas) return;

        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        canvas.width = 30;
        canvas.height = 130;

        renderBrightnessSlider(canvas, context);
    }, [currentColor]);

    return (
        <div className="w-[30px] h-[130px] relative">
            <canvas
                className="w-[30px] h-[130px]absolute"
                ref={brightnessCanvas}
            />
            <div
                className="w-[120%] h-2.5 z-40 left-1/2 translate-x-[-50%] border border-white rounded-full shadow-md absolute"
                style={{
                    top: sliderPosition - 10 / 2,
                    boxShadow: "inset 0px 0px 4px rgba(0, 0, 0, 0.5)"
                }}
            />
        </div>
    );
};
