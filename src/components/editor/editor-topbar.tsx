"use client";

import { Icons } from "@/resources/images";

import { useAudioPlayer } from "@/context/audio-player-context";
import { useModal } from "@/context/modal-context";
import { useAuth } from "@/context/auth-context";

import ImageButton from "../generic/image-button";
import { TextButton } from "../generic/rotmg-button";
import { SpriteMode } from "@/utils/constants";
import { useEditor } from "@/context/art-editor-context";
import { ChangeEvent, useMemo } from "react";

export default function EditorTopBar() {
    const { userMusicEnabled, muteMusic, unmuteMusic } = useAudioPlayer();
    const { activeModal, openModal } = useModal();
    const { user, logout } = useAuth();
    const { artSize, spriteMode, setArtSize, setSpriteMode } = useEditor();
    const formattedArtSize = useMemo(() => `${artSize.x} x ${artSize.y}`, [artSize]);

    const isLoggedIn = useMemo(() => user !== null, [user]);
    const shouldRenderToolbarButtons = !activeModal;

    const onSpriteSizeChanged = (event: ChangeEvent<HTMLSelectElement>) => {
        const dataset = event.target.selectedOptions[0].dataset;
        const selectedValue = { x: Number(dataset.width), y: Number(dataset.height) };

        setArtSize(selectedValue as { x: number, y: number }, true);
    };

    const onSpriteModeChanged = (event: ChangeEvent<HTMLSelectElement>) => {
        const dataset = event.target.selectedOptions[0].dataset;
        const spriteMode = dataset.mode as SpriteMode;
        
        setSpriteMode(spriteMode, true);
    };

    return (
        <div className="absolute flex flex-col w-full">
            <div className="flex p-1">
                <div className="flex space-x-6 pl-3 pt-2 z-40">
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
                </div>
                {shouldRenderToolbarButtons &&
                    <div className="flex flex-row justify-end items-end w-full font-myriadpro pr-2 z-40">
                        <div className="w-[70px] h-[32px] flex justify-end items-center gap-5 sm:hidden">
                            {isLoggedIn &&
                                <ImageButton
                                    title="account"
                                    totalSpritesX={5}
                                    offset={24}
                                    scale={2}
                                    image={Icons}
                                    onClick={() => openModal("CurrentAccountModal")}
                                />
                            }
                            <ImageButton
                                title={isLoggedIn ? "log out" : "log in"}
                                totalSpritesX={5}
                                offset={isLoggedIn ? 20 : 25}
                                scale={2}
                                image={Icons}
                                onClick={() => isLoggedIn ? logout() : openModal("SignInModal")}
                            />
                        </div>
                        <div className="gap-2 hidden sm:flex">
                            <span className="text-[#cccccc] opacity-50 text-lg whitespace-nowrap">{isLoggedIn ? `logged in as ${user!.email} -` : "guest account -"}</span>
                            <TextButton
                                className="hover:text-[#ffff00]"
                                onClick={() => isLoggedIn ? openModal("CurrentAccountModal") : openModal("SignUpModal")}
                            >
                                {isLoggedIn ? "account" : "register"}
                            </TextButton>
                            <TextButton
                                className="hover:text-[#ffff00]"
                                onClick={() => isLoggedIn ? logout() : openModal("SignInModal")}
                            >
                                {isLoggedIn ? "log out" : "log in"}
                            </TextButton>
                        </div>
                    </div>
                }
            </div>

            {shouldRenderToolbarButtons &&
                <div className="hidden sm:flex flex-row justify-center items-center gap-4 pl-12 mt-2 z-30 font-myriadpro">
                    <label htmlFor="mode" className="text-[#dddddd] text-lg"><b>Mode:</b></label>
                    <div className="w-fit h-fit border-[2px] rounded-sm border-[#696A68] text-lg">
                        <select name="mode" className="rotmg-dropdown" value={spriteMode} onChange={onSpriteModeChanged}>
                            {Object.values(SpriteMode).map((mode, i) => 
                                <option data-mode={mode} key={i}>{mode}</option>
                            )}
                        </select>
                    </div>

                    <label htmlFor="size" className="text-[#dddddd] text-lg"><b>Size:</b></label>
                    <div className="w-fit h-fit border-[2px] rounded-sm border-[#696A68] text-lg">
                        <select name="mode" className="rotmg-dropdown" value={formattedArtSize} onChange={onSpriteSizeChanged}>
                            <option data-width="8" data-height="8">8 x 8</option>
                            <option data-width="16" data-height="8">16 x 8</option>
                            <option data-width="16" data-height="16">16 x 16</option>
                            <option data-width="32" data-height="32">32 x 32</option>
                        </select>
                    </div>
                </div>
            }
        </div>
    );
}