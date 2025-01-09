import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTrigger
} from "../../generic/modal";
import { TextButton } from "@/components/generic/rotmg-button";
import { useState } from "react";
import { BorderButton } from "@/components/generic/rotmg-button";

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
            className="sm:w-[680px] sm:h-[550px]"
            backgroundColor="black"
        >
            <ModalHeader className="w-full flex">
                <p className="w-full">Load</p>
                <ModalTrigger
                    className="rounded-lg border-[#666666] text-sm !px-2 absolute"
                    ButtonComponent={BorderButton}
                >
                    X
                </ModalTrigger>
            </ModalHeader>

            <ModalBody className="w-full">
                <div className="w-full h-full flex flex-row space-x-10 flex-wrap">
                    {
                        items.map(() => <SpriteCell key={Math.random().toString()} />)
                    }
                </div>
            </ModalBody>

            <ModalFooter className="w-full h-full">
                <div className="relative bg-black h-full w-full">
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
