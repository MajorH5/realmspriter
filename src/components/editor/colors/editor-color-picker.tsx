import { useEditor } from "@/context/art-editor-context";
import { useEffect, useRef, useState } from "react";

export default function EditorColorPicker() {
    const { currentColor, setCurrentColor, colorHistory } = useEditor();
    const inputColorRef = useRef<HTMLInputElement | null>(null);

    const updateColor = (targetColor: string) => {
        if (targetColor.length >= 6) {
            const hex = `#${targetColor}`;
            
            console.log(targetColor, hex, /#[0-9a-fA-F]{6}/.test(hex))
            if (/#[0-9a-fA-F]{6}/.test(hex)) {
                setCurrentColor(hex);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateColor(e.target.value);
    };

    useEffect(() => {
        const { current: inputColor } = inputColorRef;
        if (inputColor === null) return;
        
        inputColor.value = currentColor.slice(1);        
    }, [currentColor])

    return (
        <div className="hidden sm:flex absolute left-1/2 translate-x-[-50%] bottom-3 flex-col justify-center items-center space-y-3 z-40">
            <div className="flex flex-wrap justify-center items-center max-w-[180px] gap-2">
                {colorHistory.map((color) => (
                    <button
                        key={color}
                        className="w-[20px] h-[20px] border-2"
                        style={{
                            borderColor: currentColor === color ? "rgba(255, 255, 255, 1)" : "transparent",
                            boxShadow:
                                currentColor === color
                                    ? "inset 2px 2px 4px rgba(0, 0, 0, 0.5)"
                                    : "",
                            backgroundColor: color,
                        }}
                        onClick={() => setCurrentColor(color)}
                    />
                ))}
            </div>

            <input
                type="text"
                className="w-[100px] h-[30px] bg-transparent border border-white font-myriadpro"
                maxLength={6}
                ref={inputColorRef}
                onChange={handleInputChange}
                placeholder="hex (xxxxxx)"
            />

            <div
                className="w-[180px] h-[25px] border-2 border-white"
                style={{
                    boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)",
                    backgroundColor: currentColor, 
                }}
            />
        </div>
    );
}
