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
import EditorNavbar from "./editor-navbar";
import { useEditor } from "@/context/art-editor-context";

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
    const { zoomIn, zoomOut } = useEditor();

    return (
        <div
            className={`w-dvh h-dvh sm:max-w-[880px] sm:max-h-[700px] sm:aspect-[880/700] block overflow-hidden relative ${className || ""}`}
        >
            {/* mute topbar element needs to stay rendered above all else */}
            <EditorTopBar />
            {activeModal ? (
                <EditorModals />
            ) : (
                <>
                    <div className="relative sm:hidden">
                        <div className="absolute top-12 right-4 flex flex-col space-y-2 z-50">
                            <button
                                className="w-12 h-12 bg-[#363636] border border-white text-white rounded-full flex items-center justify-center"
                                onClick={zoomIn}
                            >
                                <span className="text-xl">+</span>
                            </button>
                            <button
                                className="w-12 h-12 bg-[#363636] border border-white text-white rounded-full flex items-center justify-center"
                                onClick={zoomOut}
                            >
                                <span className="text-xl">-</span>
                            </button>
                        </div>
                    </div>
                    <EditorSideButtons className="ml-4 mt-12" />
                    <EditorNavbar />
                    <div className="flex sm:flex left-1/2 translate-x-[-41.5%] top-1/2 translate-y-[-53.5%] flex-row justify-end items-center z-30 absolute gap-5">
                        <EditorCanvas />
                        <EditorPreview />
                    </div>
                    <EditorColorPicker />
                    <p className="absolute bottom-1 right-2 font-myriadpro text-[rgba(255,255,255,0.25)]" style={{ zIndex: 100 }}>v2.0.0</p>
                </>
            )}
            <ScrollingBackground scale={4} image={RealmTrees} />
        </div>
    );
}
