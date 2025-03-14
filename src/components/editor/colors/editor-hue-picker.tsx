import { useEditor } from "@/context/art-editor-context";
import { hexToRGB, hslToHex, mapRange, normalizeMousePosition, rgbToHsl } from "@/utils/utility";
import { useEffect, useRef, useState } from "react";
import { useMouseTracker } from "@/hooks/hooks";

export default function EditorHuePicker() {
    const hueCanvas = useRef<HTMLCanvasElement>(null);
    const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0 });
    const { currentColor, setCurrentColor, colorBrightness } = useEditor();
    const [isColorChanging, setIsColorChanging] = useState(false);

    const renderColorGradient = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);

        gradient.addColorStop(0, 'red');
        gradient.addColorStop(1 / 6, 'yellow');
        gradient.addColorStop(2 / 6, 'green');
        gradient.addColorStop(3 / 6, 'cyan');
        gradient.addColorStop(4 / 6, 'blue');
        gradient.addColorStop(5 / 6, 'magenta');
        gradient.addColorStop(1, 'red');

        const gradient2 = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient2.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient2.addColorStop(1, 'rgba(255, 255, 255, 1)');

        context.globalAlpha = 1;
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = gradient2;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.shadowBlur = 0;
        context.fillStyle = 'black';
        context.globalAlpha = colorBrightness;
        context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const getHueAtPosition = (x: number, y: number) => {
        const canvas = hueCanvas.current!;
        const h = x / canvas.width;
        const l = mapRange(y / canvas.height, 0, 1, 0.5, 1);
        return hslToHex(h, 1, l);
    };

    const getPositionAtHue = (color: string) => {
        const canvas = hueCanvas.current!;
        let { r, g, b } = hexToRGB(color);
        const [h, s, l] = rgbToHsl(r * 255, g * 255, b * 255);

        return { x: h * canvas.width, y: (l / 255) * canvas.height };
    }

    useMouseTracker(hueCanvas, {
        onDown: (x, y) => {
            setIsColorChanging(true);
            setPickerPosition({ x, y });
        },
        onMove: (x, y) => {
            setPickerPosition({ x, y });
            setCurrentColor(getHueAtPosition(x, y));
        },
        onUp: () => {
            setIsColorChanging(false);
        }
    });

    useEffect(() => {
        const canvas = hueCanvas.current;
        if (!canvas) return;

        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        canvas.width = 320;
        canvas.height = 130;

        renderColorGradient(canvas, context);
    }, [colorBrightness]);

    useEffect(() => {
        if (isColorChanging) return;

        const position = getPositionAtHue(currentColor);
        setPickerPosition(position);
    }, [currentColor]);

    return (
        <div className="w-[320px] h-[130px] relative">
            <canvas ref={hueCanvas} className="w-[320px] h-[130px] absolute" />
            <div
                className="w-2.5 h-2.5 z-40 border border-white rounded-full shadow-md absolute"
                style={{
                    top: pickerPosition.y - 10 / 2,
                    left: pickerPosition.x - 10 / 2,
                    boxShadow: "inset 0px 0px 4px rgba(0, 0, 0, 0.5)"
                }}
            />
        </div>
    );
}
