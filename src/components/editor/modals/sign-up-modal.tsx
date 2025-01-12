
import { useAuth } from "@/context/auth-context";
import { useState, useRef } from "react";

import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTrigger
} from "../../generic/modal";
import { TextButton } from "@/components/generic/rotmg-button";
import { useModal } from "@/context/modal-context";
import ReCAPTCHA from "react-google-recaptcha";

export default function SignUpModal() {
    const { openModal } = useModal();
    const { register, isPerformingAuthEvent } = useAuth();

    const [error, setError] = useState<string | null>(null);
    
    const formRef = useRef<HTMLFormElement | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    
    const onSignUp = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isPerformingAuthEvent || !recaptchaRef.current) return;

        const formData = new FormData(formRef.current!);

        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const retypePassword = formData.get("retype-password") as string;

        const emailInput = document.getElementById("email") as HTMLInputElement;

        let error = null;

        if (username === "") {
            error = "Please enter a valid username";
        } else if (email === "" || !emailInput.checkValidity()) {
            error = "Please enter a valid email";
        } else if (password.length < 8 || password.length > 64) {
            error = "Password must be between 8 and 64 characters long";
        } else if (password !== retypePassword) {
            error = "Passwords do not match";
        }

        setError(error);

        if (error !== null) {
            return;
        }

        const result = await register(email, username, password, recaptchaRef.current);

        if (!result.success) {
            setError(result.message);
        } else {
            openModal("CurrentAccountModal");
        }
    };

    return (
        <Modal
            name="SignUpModal"
            backgroundColor="black"
            className="!p-0 border-[1px] sm:w-[400px] sm:h-[580px] max-h-[580px] overflow-hidden"
        >
            <ModalHeader className="bg-[#4D4D4D] shadow-md w-full">
                <p className="text-left pl-[10px] py-3 text-base font-light text-[#B5B5B5]">
                    Register in order to save your progress
                </p>
            </ModalHeader>

            <ModalBody className="px-8 w-full">
                <form ref={formRef} className="space-y-3" onSubmit={onSignUp} noValidate>
                    <p>
                        <label htmlFor="username" className="font-bold text-lg">Username:</label>
                    </p>
                    <p>
                        <input
                            autoComplete="username"
                            type="text"
                            id="username"
                            name="username"
                            placeholder="username"
                            className="w-full max-w-[280px] bg-transparent pl-1 border-2 border-[#4f4f4f] placeholder:text-[#7A7A7A] font-normal"
                            disabled={isPerformingAuthEvent}
                        />
                    </p>
                    <p>
                        <label htmlFor="email" className="font-bold text-lg">Email:</label>
                    </p>
                    <p>
                        <input
                            autoComplete="email"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="example@domain.com"
                            className="w-full max-w-[280px] bg-transparent pl-1 border-2 border-[#4f4f4f] placeholder:text-[#7A7A7A] font-normal"
                            disabled={isPerformingAuthEvent}
                        />
                    </p>
                    <p>
                        <label htmlFor="password" className="font-bold text-lg">Password:</label>
                    </p>
                    <p>
                        <input
                            autoComplete="new-password"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="password"
                            className="w-full max-w-[280px] bg-transparent pl-1 border-2 border-[#4f4f4f] placeholder:text-[#7A7A7A] font-normal"
                            disabled={isPerformingAuthEvent}
                        />
                    </p>
                    <p>
                        <label htmlFor="retype-password" className="font-bold text-lg">Retype Password:</label>
                    </p>
                    <p>
                        <input
                            autoComplete="new-password"
                            type="password"
                            id="retype-password"
                            name="retype-password"
                            placeholder="password"
                            className="w-full max-w-[280px] bg-transparent pl-1 border-2 border-[#4f4f4f] placeholder:text-[#7A7A7A] font-normal"
                            disabled={isPerformingAuthEvent}
                        />
                    </p>
                    <ReCAPTCHA
                        size="invisible"
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY!}
                        ref={recaptchaRef}
                    />
                </form>

                <div className="mt-4 w-fit"
                    style={{
                        textShadow: '0px 0px 4px black'
                    }}
                >
                    <p className="text-sm text-[#FA8641] cursor-default select-none">{error}&nbsp;</p> {/* <-- non breaking space to maintain rendering */}
                    <p className="text-sm hover:text-[#ffda84] cursor-default select-none" onClick={() => openModal("SignInModal")}>Already registered? Click here to sign in!</p>
                    <p className="text-sm mt-4">
                        By clicking 'Register', you are indicating that you have
                        read and agreed to the Terms of Use and the Privacy Policy
                    </p>
                </div>
            </ModalBody>

            <ModalFooter className="!mt-auto w-full text-end">
                <ModalTrigger
                    className="m-4"
                    ButtonComponent={TextButton}
                >
                    <p className="text-2xl">Cancel</p>
                </ModalTrigger>
                <TextButton
                    onClick={() => formRef.current?.requestSubmit()}
                    className="m-4"
                    disabled={isPerformingAuthEvent}
                >
                    <p className="text-2xl">Register</p>
                </TextButton>
            </ModalFooter>
        </Modal>
    );
}