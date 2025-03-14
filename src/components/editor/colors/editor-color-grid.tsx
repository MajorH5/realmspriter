import { useEditor } from "@/context/art-editor-context";
import { hexToRGB, RGBtohex } from "@/utils/utility";

export default function EditorColorGrid({ baseColors }: { baseColors: string[] }) {
    const { currentColor, setCurrentColor } = useEditor();

    const createGradientSteps = (colors: string[]): string[] => {
        const result = [];
        const steps = 8;

        for (let i = 0; i < colors.length; i++) {
            for (let j = 0; j < steps; j++) {
                const color = colors[i];

                let {r, g, b} = hexToRGB(color);

                // dark -> white
                const p = (j) / (steps * 2);
                r = Math.floor(r + (255 - r) * p);
                g = Math.floor(g + (255 - g) * p);
                b = Math.floor(b + (255 - b) * p);

                const hex = RGBtohex({ r, g, b });
                result.push(hex);
            }
        }

        return result;
    };

    return (
        <div className="w-[130px] h-[130px] flex flex-row flex-wrap justify-between items-between">
            {createGradientSteps(baseColors).map((color, index) =>
                <button
                    key={color}
                    className="border-2"
                    style={{
                        width: 130 / 8,
                        height: 130 / baseColors.length,
                        borderColor: currentColor === color ? "rgba(255, 255, 255, 1)" : "transparent",
                        boxShadow:
                            currentColor === color
                                ? "inset 2px 2px 4px rgba(0, 0, 0, 0.5)"
                                : "",
                        backgroundColor: color,
                    }}
                    onClick={() => setCurrentColor(color)}
                />
            )}
        </div>
    );
};
