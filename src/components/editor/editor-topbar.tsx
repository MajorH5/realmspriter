"use client"
import { Icons } from "@/resources/images";

import { useModal } from "@/context/modal-context";
import { useEditor } from "@/context/art-editor-context";

import ImageButton from "../generic/image-button";
import { useAudioPlayer } from "@/context/audio-player-context";

export default function EditorTopBar() {
    const { userMusicEnabled, muteMusic, unmuteMusic } = useAudioPlayer();
    const { activeModal, toggleModal } = useModal();

    const shouldRenderToolbarButtons = !activeModal ||
        activeModal === "NotificationsModal" ||
        activeModal === "PatchNotesModal";

    return (
        <div className="absolute flex flex-row w-full z-30 p-1 space-x-6">
            <ImageButton
                title={userMusicEnabled ? "Mute music" : "Unmute music"}
                totalSpritesX={5}
                offset={userMusicEnabled ? 0 : 1}
                scale={2}
                image={Icons}
                onClick={
                    () => {
                        if (userMusicEnabled) {
                            muteMusic();
                        } else {
                            unmuteMusic();
                        }
                    }
                }
            />
            {shouldRenderToolbarButtons &&
                <>
                    <ImageButton
                        title={activeModal === "NotificationsModal" ? "Hide notifications" : "View notifications"}
                        totalSpritesX={5}
                        offset={16}
                        scale={2}
                        image={Icons}
                        onClick={() => toggleModal("NotificationsModal")}
                    />
                    <ImageButton
                        title={activeModal === "PatchNotesModal" ? "Hide patch notes" : "View patch notes"}
                        totalSpritesX={5}
                        offset={21}
                        scale={2}
                        image={Icons}
                        onClick={() => toggleModal("PatchNotesModal")}
                    />
                </>
            }
        </div>
    );
}