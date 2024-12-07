"use client"
import { Icons } from "@/resources/images";

import { useAudioPlayer } from "@/context/audio-player-context";
import { useModal } from "@/context/modal-context";
import { useAuth } from "@/context/auth-context";

import ImageButton from "../generic/image-button";
import { TextButton } from "../generic/rotmg-button";
import { SpriteMode, SpriteSize } from "@/utils/constants";

export default function EditorTopBar() {
    const { userMusicEnabled, muteMusic, unmuteMusic } = useAudioPlayer();
    const { activeModal, toggleModal, openModal } = useModal();
    const { user, logout } = useAuth();

    const shouldRenderToolbarButtons = !activeModal;

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
                        // onClick={() => toggleModal("NotificationsModal")}
                        />
                        <ImageButton
                            title={activeModal === "PatchNotesModal" ? "Hide patch notes" : "View patch notes"}
                            totalSpritesX={5}
                            offset={21}
                            scale={2}
                            image={Icons}
                        // onClick={() => toggleModal("PatchNotesModal")}
                        />
                    </>
                }
                {shouldRenderToolbarButtons &&
                    <div className="flex flex-row justify-end items-end w-full font-myriadpro px-2 space-x-2">
                        <span className="text-[#cccccc] opacity-50 text-lg">{user !== null ? `logged in as ${user.email} - ` : "guest account - "}</span>
                        <TextButton
                            className="hover:text-[#ffff00]"
                            onClick={() => openModal("CurrentAccountModal")}
                        >
                            {user !== null ? "account" : "register"}
                        </TextButton>
                        <TextButton
                            className="hover:text-[#ffff00]"
                            onClick={() => user !== null ? logout() : openModal("SignInModal")}
                        >
                            {user !== null ? "log out" : "log in"}
                        </TextButton>
                    </div>
                }
            </div>

            {shouldRenderToolbarButtons &&
                // TODO: Custom dropdown element
                <div className="flex flex-row justify-center items-center mt-2 z-30 font-myriadpro">
                    <label htmlFor="mode" className="text-[#dddddd] text-lg"><b>Mode:</b></label>
                    <div className="w-fit h-fit border-[2px] mx-4 rounded-sm border-[#696A68] text-lg">
                        <select name="mode" className="rotmg-dropdown" defaultValue={SpriteMode.OBJECTS}>
                            <option value={SpriteMode.OBJECTS}>Objects</option>
                            <option value={SpriteMode.CHARACTERS}>Characters</option>
                            <option value={SpriteMode.TEXTILES}>Textiles</option>
                        </select>
                    </div>

                    <label htmlFor="size" className="text-[#dddddd] text-lg"><b>Size:</b></label>
                    <div className="w-fit h-fit border-[2px] mx-4 rounded-sm border-[#696A68] text-lg">
                        <select name="mode" className="rotmg-dropdown" defaultValue={SpriteSize.S8X8}>
                            <option value={SpriteSize.S8X8}>8 x 8</option>
                            <option value={SpriteSize.S16X8}>16 x 8</option>
                            <option value={SpriteSize.S16X16}>16 x 16</option>
                            <option value={SpriteSize.S32X32}>32 x 32</option>
                        </select>
                    </div>
                </div>
            }
        </div>
    );
}