"use client";

import RealmTrees from "@/../public/images/background.png";
import Icons from "@/../public/images/icons.png"

import { ModalProvider } from "@/context/modal-context";
import ScrollingBackground from "./scrolling-background";
import ImageButton from "../generic/image-button";
import { useEditor } from "@/context/art-editor-context";

import {
    WelcomeModal,
    DisclaimerModal,
    CurrentAccountModal
} from "./modals/editor-modals";

type ArtEditorProps = {
    className?: string
}

export default function ArtEditor({
    className
}: ArtEditorProps) {
    const { isMusicMuted, setMusicMuted } = useEditor();

    return (
        <div
            className={`max-w-[880px] max-h-[700px] aspect-[880/700] w-full block overflow-hidden relative ${className || ""}`}
        >
            <div className="absolute flex flex-col w-full z-30 p-1">
                <ImageButton
                title={isMusicMuted ? "Unmute music" : "Mute music"}
                    totalSpritesX={5}
                    offset={isMusicMuted ? 1 : 0}
                    scale={2}
                    image={Icons}
                    onClick={() => setMusicMuted(!isMusicMuted)}
                />
            </div>

            <ModalProvider>
                {/* Every openable modal is contained in here */}
                {/* Only opened modals are rendered */}
                <div className="w-full h-full absolute z-20">
                    <WelcomeModal />
                    <DisclaimerModal />
                    <CurrentAccountModal />
                </div>
            </ModalProvider>

            <ScrollingBackground scale={4} image={RealmTrees} />
        </div>
    );
}
