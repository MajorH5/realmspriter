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

export default function SignInModal() {
    const { openModal } = useModal();
    const { login } = useAuth();

    const [error, setError] = useState<string | null>(null);
    const [isSigningIn, setSigningIn] = useState(false);

    const formRef = useRef<HTMLFormElement | null>(null);

    const onSignIn = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isSigningIn) return;

        setSigningIn(true);

        const formData = new FormData(formRef.current!);

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const emailInput = document.getElementById("email") as HTMLInputElement;

        let error = null;

        if (email === "" || !emailInput.checkValidity()) {
            error = "Please enter a valid email";
        } else if (password.length < 8 || password.length > 64) {
            error = "Password must be between 8 and 64 characters long";
        }

        setError(error);
        
        if (error !== null) {
            setSigningIn(false);
            return;
        }

        const result = await login(email, password);

        if (result === null) {
            setError("Invalid email or password");
        } else {
            openModal("CurrentAccountModal");
        }

        setSigningIn(false);
    };

    return (
        <Modal
            name="SignInModal"
            backgroundColor="black"
            className="!p-0 border-[1px] sm:w-[400px] sm:h-[370px] max-h-[370px] overflow-hidden"
        >
            <ModalHeader className="bg-[#4D4D4D] shadow-md w-full">
                <p className="text-left pl-[10px] py-3 text-base font-light text-[#B5B5B5]">
                    Sign in
                </p>
            </ModalHeader>

            <ModalBody className="px-8 w-full">
                <form ref={formRef} className="space-y-3" onSubmit={onSignIn} noValidate>
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
                        />
                    </p>
                    <p>
                        <label htmlFor="password" className="font-bold text-lg">Password:</label>
                    </p>
                    <p>
                        <input
                            autoComplete="current-password"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="password"
                            className="w-full max-w-[280px] bg-transparent pl-1 border-2 border-[#4f4f4f] placeholder:text-[#7A7A7A] font-normal"
                        />
                    </p>
                </form>

                <div className="mt-4 w-fit"
                    style={{
                        textShadow: '0px 0px 4px black'
                    }}
                >
                    <p className="text-sm text-[#FA8641] cursor-default select-none">{error}&nbsp;</p> {/* <-- non breaking space to maintain rendering */}
                    <p className="text-sm hover:text-[#ffda84] cursor-default select-none">Forgot your password? Click here</p>
                    <p className="text-sm hover:text-[#ffda84] cursor-default select-none" onClick={() => openModal("SignUpModal")}>New user? Click here to Register</p>
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
                >
                    <p className="text-2xl">Sign in</p>
                </TextButton>
            </ModalFooter>
        </Modal>
    );
}