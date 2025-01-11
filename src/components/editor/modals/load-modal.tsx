import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTrigger
} from "../../generic/modal";
import { DefaultButton, TextButton } from "@/components/generic/rotmg-button";
import { useState } from "react";
import { BorderButton } from "@/components/generic/rotmg-button";
import ImageButton from "@/components/generic/image-button";
import { Icons } from "@/resources/images";

function SpriteCell() {
    return (
        <div className="w-[112px] h-[112px] bg-black">
        </div>
    );
};

export default function LoadModal() {
    const [isSearching, setIsSearching] = useState(false);

    const items = [
        "", "", "", "",
        "", "", "", "",
        "", "", "", "",
    ];

    return (
        <Modal
            name="LoadModal"
            className="sm:w-[680px] sm:h-[550px] !p-2"
            backgroundColor="black"
        >
            <ModalHeader className="w-full flex-col">
                <div className="relative w-full h-full flex flex-col">

                    <p className="w-full">Load</p>
                    <ModalTrigger
                        className="rounded-lg border-[#666666] text-sm !px-2 absolute right-1"
                        ButtonComponent={BorderButton}
                    >
                        X
                    </ModalTrigger>
                    <div className="relative w-full h-fit flex items-center justify-center space-x-4 mt-2">
                        <div className="h-[32px] w-[32px]">
                            <ImageButton
                                className="block sm:hidden"
                                title="filters"
                                totalSpritesX={5}
                                offset={23}
                                scale={2}
                                image={Icons}
                                onClick={() => { }}
                            />
                        </div>
                        <div className="hidden sm:block w-fit h-fit font-normal border-[1px] border-[#717171] text-lg">
                            <select name="mode" className="rotmg-dropdown" defaultValue="Community">
                                <option value="Community">Community</option>
                                <option value="Deca">Deca</option>
                                <option value="Mine">Mine</option>
                                <option value="All">All</option>
                            </select>
                        </div>
                        <div className="hidden sm:block w-fit h-fit font-normal border-[1px] border-[#717171] text-lg">
                            <select name="mode" className="rotmg-dropdown" defaultValue="Any Type" onChange={() => { }}>
                                <option value="Any Type">Any Type</option>
                                <option value="Items">Items</option>
                                <option value="Entities">Entities</option>
                                <option value="Tiles">Tiles</option>
                                <option value="Objects">Objects</option>
                                <option value="Misc">Misc</option>
                            </select>
                        </div>
                        <div className="flex flex-col justify-end items-end h-full">
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                placeholder="tags (comma-separated)"
                                className="w-full h-full text-base bg-transparent pl-1 border border-[#4f4f4f] placeholder:text-[#7A7A7A] text-[#B5B5B5] font-normal"
                            />
                        </div>
                        <DefaultButton
                            onClick={() => { }}
                            className="!px-6 !py-0 h-[32px]"
                        >
                            Search
                        </DefaultButton>
                    </div>
                </div>
            </ModalHeader>

            <ModalBody className="w-full h-full">
                <div className="w-full h-full flex flex-row space-x-10 flex-wrap justify-center items-center">
                    {
                        items.map(() => <SpriteCell key={Math.random().toString()} />)
                    }
                </div>
            </ModalBody>

            <ModalFooter className="w-full h-fit">
                <div className="relative w-full h-fit">
                    <TextButton
                        onClick={() => { }}
                        className="absolute m-1 left-1 bottom-1"
                        disabled={isSearching}
                    >
                        <p className="text-xl">Previous</p>
                    </TextButton>
                    <TextButton
                        onClick={() => { }}
                        className="absolute m-1 right-1 bottom-1"
                        disabled={isSearching}
                    >
                        <p className="text-xl">Next</p>
                    </TextButton>
                </div>
            </ModalFooter>
        </Modal>
    );
};
