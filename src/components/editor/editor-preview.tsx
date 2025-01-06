import { useEditor } from "@/context/art-editor-context";

export default function EditorPreview() {
    const { zoomLevel } = useEditor();

    return (
        <div className="border border-white w-[300px] h-[400px] bg-[#808080]">
            <div className="w-full h-full">
                <p className="pl-2 pt-2 font-white text-white font-myriadpro font-light"><b>{zoomLevel.toString()}%</b></p>
            </div>
        </div>
    );
}