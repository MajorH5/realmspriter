"use client"
import { Icons } from "@/resources/images";

import { useAudioPlayer } from "@/context/audio-player-context";
import { useEditor } from "@/context/art-editor-context";
import { useModal } from "@/context/modal-context";
import { useAuth } from "@/context/auth-context";

import ImageButton from "../generic/image-button";
import RotMGButton from "../generic/rotmg-button";

export default function EditorTopBar() {
    const { userMusicEnabled, muteMusic, unmuteMusic } = useAudioPlayer();
    const { activeModal, toggleModal, openModal } = useModal();
    const { user } = useAuth();

    const shouldRenderToolbarButtons = !activeModal ||
        activeModal === "NotificationsModal" ||
        activeModal === "PatchNotesModal";

    return (
        <div className="absolute flex flex-col w-full">
            <div className="flex flex-row w-full z-30 p-1 space-x-6">
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
                {(!activeModal || shouldRenderToolbarButtons) &&
                    <div className="flex flex-row justify-end items-end w-full font-myriadpro px-2 space-x-2">
                        <span className="text-[#cccccc] opacity-50 text-lg">logged in as {user?.email} - </span>
                        <RotMGButton
                            className="!p-0 !bg-[rgba(0,0,0,0)] text-white hover:text-[#ffff00]"
                            onClick={() => openModal("CurrentAccountModal")}
                        >
                            account
                        </RotMGButton>
                        <RotMGButton
                            className="!p-0 !bg-[rgba(0,0,0,0)] text-white hover:text-[#ffff00]"
                        >
                            log out
                        </RotMGButton>
                    </div>
                }
            </div>

            <div className="mt-2 z-30">
                About
            </div>
        </div>
    );
}