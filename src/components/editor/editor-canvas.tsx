import { TransparentTiles } from "@/resources/images";
import { useEffect } from "react";

export default function EditorCanvas() {
    useEffect(() => {
        console.log(`url(${TransparentTiles.src})`);
    }, []);
    return (
        <canvas className="w-[390px] h-[400px]" style={{
            backgroundImage: `url(${TransparentTiles.src})`
        }}>
        </canvas>
    );
}