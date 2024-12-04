import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTrigger } from "../generic/modal";
import Link from "next/link";

export default function WelcomeModal() {
    return (
        <Modal
            name="WelcomeModal"
            className="w-[46%] h-[55%]"
        >
            <ModalHeader>
                Welcome!
            </ModalHeader>

            <ModalBody>
                <p>
                    Welcome to RealmSpriter. By clicking 'Enter', you are indicating
                    that you have read and agreed to the Terms of Use and Privacy Policy.
                </p>
                <Link
                    target="_blank"
                    href="/legal/terms-of-use/"
                    className="no-underline text-[#5d56bd]"
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
            </ModalBody>

            <ModalFooter>
                <ModalTrigger>
                    Enter
                </ModalTrigger>
            </ModalFooter>
        </Modal>
    );
}