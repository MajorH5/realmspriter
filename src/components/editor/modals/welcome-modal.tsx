import { useModal } from "@/context/modal-context";
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTrigger
} from "../../generic/modal";

import Link from "next/link";

export default function WelcomeModal() {
    const { openModal } = useModal();

    return (
        <Modal
            name="WelcomeModal"
            className="w-[400px] h-[240px]"
        >
            <ModalHeader>
                Welcome
            </ModalHeader>

            <ModalBody>
                <p>
                    Welcome to RealmSpriter. By clicking 'Enter', you are indicating
                    that you have read and agreed to the Terms of Use and Privacy Policy.
                </p>
                <div className="flex flex-row items-center justify-center font-normal text-base">
                    <Link
                        target="_blank"
                        href="/legal/terms-of-use/"
                        className="no-underline text-[#5d56bd] mx-4"
                    >
                        Terms of Use
                    </Link>
                    <Link
                        target="_blank"
                        href="/legal/privacy-policy/"
                        className="no-underline text-[#5d56bd]"
                    >
                        Privacy Policy
                    </Link>
                </div>
            </ModalBody>

            <ModalFooter>
                <ModalTrigger className="rotmg-button" onClick={() => openModal("DisclaimerModal")}>
                    Enter
                </ModalTrigger>
            </ModalFooter>
        </Modal>
    );
}