"use client";

import { RealmTrees } from "@/resources/images";
import ScrollingBackground from "./scrolling-background";

import EditorModals from "./modals/editor-modals";
import EditorTopBar from "./editor-topbar";

type ArtEditorProps = {
    className?: string
}

export function Loading () {
    return (
        <div className="max-w-[880px] max-h-[700px] aspect-[880/700] w-full flex flex-col justify-center">
            <p className="text-center">Loading</p>
        </div>
    );
}

export default function ArtEditor({
    className
}: ArtEditorProps) {
    return (
        <div
            className={`max-w-[880px] max-h-[700px] aspect-[880/700] w-full block overflow-hidden relative ${className || ""}`}
        >
            <EditorTopBar />
            <EditorModals />
            <ScrollingBackground scale={4} image={RealmTrees} />
        </div>
    );
}
