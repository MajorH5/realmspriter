import { Icons } from "@/resources/images"

import { useModal } from "@/context/modal-context";
import { useEditor } from "@/context/art-editor-context";

import ImageButton from "../generic/image-button";

export default function EditorTopBar() {
    const { isMusicMuted, setMusicMuted } = useEditor();
    const { activeModal, toggleModal } = useModal();

    const shouldRenderToolbarButtons = !activeModal ||
        activeModal === "NotificationsModal" ||
        activeModal === "PatchNotesModal";

    return (
        <div className="absolute flex flex-row w-full z-30 p-1 space-x-6">
            <ImageButton
                title={isMusicMuted ? "Unmute music" : "Mute music"}
                totalSpritesX={5}
                offset={isMusicMuted ? 1 : 0}
                scale={2}
                image={Icons}
                onClick={() => setMusicMuted(!isMusicMuted)}
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