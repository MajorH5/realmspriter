import { useEditor } from "@/context/art-editor-context";

export default function EditorColorPicker() {
    const { currentColor, setCurrentColor, colorHistory } = useEditor();

    return (
        <div
            className="absolute w-full h-full bg-transparent"
            style={{ zIndex: 999 /* <-- TODO: better approach than z-index layering */ }}
        >
            <div className="h-full flex flex-row items-end justify-center">
                <div className="flex flex-col justify-center items-center space-y-3">

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

                    <input type="text" className="w-[100px] h-[30px] bg-transparent border border-white" value={currentColor} />

                    <div
                        className="w-[180px] h-[25px] border-2 border-white"
                        style={{
                            boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)",
                            backgroundColor: currentColor,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
