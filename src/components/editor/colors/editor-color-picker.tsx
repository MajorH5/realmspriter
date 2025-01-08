import { useEditor } from "@/context/art-editor-context";

export default function EditorColorPicker() {
    const { currentColor, setCurrentColor, colorHistory } = useEditor();

    const updateColor = (targetColor: string) => {
        if (targetColor.length < 6) {
            const hex = `#${targetColor}`;

            if (!/#[0-9a-fA-F]{6}/.test(hex)) {
                return;
            }

            setCurrentColor(hex);
        }
    };

    return (
        // <div
        //     className="absolute w-full h-full bg-transparent pb-2"
        //     style={{ zIndex: 30 /* <-- TODO: better approach than z-index layering */ }}
        // >
            // <div className="h-full flex flex-row items-end justify-center">
                <div className="absolute left-1/2 translate-x-[-50%] bottom-3 flex flex-col justify-center items-center space-y-3 z-40">

                    <div
                        className="flex flex-wrap justify-center items-center max-w-[180px] gap-2"
                    >
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
                        className="w-[100px] h-[30px] bg-transparent border border-white"
                        value={currentColor.slice(1)}
                        maxLength={6}
                        onChange={e => updateColor(e.target.value)}
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
            // </div>
        // </div>
    );
}
