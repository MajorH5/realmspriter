"use client";

import { RealmTrees } from "@/resources/images";
import { useModal } from "@/context/modal-context";
import ScrollingBackground from "./scrolling-background";

import EditorModals from "./modals/editor-modals";
import EditorTopBar from "./editor-topbar";
import EditorSideButtons from "./editor-side-buttons";
import EditorColorPicker from "./colors/editor-color-picker";
import EditorCanvas from "./editor-canvas";
import EditorPreview from "./editor-preview";

type ArtEditorProps = {
    className?: string
}

export function Loading() {
    return (
        <div className="max-w-[880px] max-h-[700px] aspect-[880/700] w-full flex flex-col justify-center">
            <p className="text-center">Loading</p>
        </div>
    );
}

export default function ArtEditor({
    className
}: ArtEditorProps) {
    const { activeModal } = useModal();

    return (
        <div
            className={`max-w-[880px] max-h-[700px] aspect-[880/700] w-full block overflow-hidden relative ${className || ""}`}
        >
            {/* mute topbar element needs to stay rendered above all else */}
            <EditorTopBar />
            {activeModal ? (
                <EditorModals />
            ) : (
                <>
                    <EditorSideButtons className="ml-4 mt-12" />
                    <div className="left-1/2 translate-x-[-41.5%] top-1/2 translate-y-[-53.5%] flex flex-row justify-end items-center z-30  absolute space-x-5">
                        <EditorCanvas />
                        <EditorPreview />
                    </div>
                    <EditorColorPicker />
                </>
            )}
            <ScrollingBackground scale={4} image={RealmTrees} />
        </div>
    );
}
