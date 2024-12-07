import { useAudioPlayer } from "@/context/audio-player-context";
import { useAuth } from "@/context/auth-context";

import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTrigger
} from "../../generic/modal";
import { SorcMsc } from "@/resources/audio";
import { TextButton } from "@/components/generic/rotmg-button";

export default function CurrentAccountModal() {
    const { user } = useAuth();
    const { currentTheme, playTheme } = useAudioPlayer();

    const onContinue = () => {
        if (!currentTheme || currentTheme.getAudioSource() !== SorcMsc) {
            playTheme(SorcMsc);
        }
    };

    return (
        <Modal
            name="CurrentAccountModal"
            backgroundColor="black"
            className="!p-0 border-[1px] w-[400px] h-[315px] overflow-hidden"
        >
            <ModalHeader className="bg-[#4D4D4D] shadow-md w-full">
                <p className="text-left pl-[10px] py-3 text-base font-light text-[#B5B5B5]">
                    Current account
                </p>
            </ModalHeader>

            <ModalBody className="px-8 w-full">
                <p className="font-bold text-xl">Currently logged in as:</p>
                <p>{user?.email}</p>
                <div className="mt-14 w-fit"
                    style={{
                        textShadow: '0px 0px 4px black'
                    }}
                >
                    <p className="text-sm hover:text-[#ffda84] cursor-default">Click here to change password</p>
                    <p className="text-sm hover:text-[#ffda84] cursor-default">Not you? Click here to log out</p>
                </div>
            </ModalBody>

            <ModalFooter className="!mt-auto w-full text-end">
                <ModalTrigger
                    onClick={onContinue}
                    className="m-4"
                    ButtonComponent={TextButton}
                >
                    <p className="text-2xl">Continue</p>
                </ModalTrigger>
            </ModalFooter>
        </Modal>
    );
}