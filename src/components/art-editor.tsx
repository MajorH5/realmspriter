import RealmTrees from "../../public/images/background.png";
import ScrollingBackground from "./scrolling-background";

type ArtEditorProps = {
    className?: string
}

export default function ArtEditor ({
    className
}: ArtEditorProps) {
    return (
        <div
            className={`max-w-[880px] max-h-[700px] aspect-[880/700] w-full block overflow-hidden ${className || ""}`}
        >
            <ScrollingBackground scale={4} image={RealmTrees} />
        </div>
    );
}