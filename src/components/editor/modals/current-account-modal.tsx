import { useAudioPlayer } from "@/context/audio-player-context";
import { useAuth } from "@/context/auth-context";
import { useModal } from "@/context/modal-context";

import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTrigger
} from "../../generic/modal";
import { SorcMsc } from "@/resources/audio";
import { TextButton } from "@/components/generic/rotmg-button";
import { useState } from "react";

export default function CurrentAccountModal() {
    const { closeModal } = useModal();
    const {
        user,
        logout,
        resendVerificationEmail,
        sendingEmail,
        emailSent
    } = useAuth();
    const { currentTheme, playTheme } = useAudioPlayer();
    const [message, setMessage] = useState<string | null>(null);

    const onContinue = () => {
        if (!currentTheme || currentTheme.getAudioSource() !== SorcMsc) {
            playTheme(SorcMsc);
        }
    };

    const verifyAccount = async () => {
        if (sendingEmail || emailSent || user?.accountVerified) return;

        const result = await resendVerificationEmail();

        if (result) {
            setMessage("Verification email sent");
        } else {
            setMessage("Too many verification requests. Try again later");
        }
    };

    return (
        <Modal
            name="CurrentAccountModal"
            backgroundColor="black"
            className="!p-0 !border-[1px] w-[400px] h-[315px] overflow-hidden"
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
                    <p
                        className={`text-sm ${(sendingEmail || emailSent) ? "text-[#888888]" : "hover:text-[#ffda84]"} cursor-default`}
                        onClick={() => verifyAccount()}
                    >
                        {!user?.accountVerified ? (emailSent ? "Sent..." : "Email not verified. Click here to resend email") : ""}&nbsp;
                    </p>
                    <p className="text-sm hover:text-[#ffda84] cursor-default" onClick={() => closeModal()}>Click here to change password</p>
                    <p className="text-sm hover:text-[#ffda84] cursor-default" onClick={() => (logout(), closeModal())}>Not you? Click here to log out</p>
                    <p className="text-sm text-[#FA8641] cursor-default select-none">{message}&nbsp;</p>
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