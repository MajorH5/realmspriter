"use client";

import { useModal } from "@/context/modal-context";
import RotMGButton from "./rotmg-button";
import { OnScreenModal } from "@/types/modal-types";

type GenericModalProps = {
    children?: React.ReactNode;
    className?: string;
};

export const ModalHeader = ({
    children, className
}: GenericModalProps) => {
    return (
        <div
            className={`
                text-2xl text-center
                text-[#578763] font-bold
                ${className || ""}`}
        >
            {children}
        </div>
    );
};

export const ModalBody = ({
    children, className
}: GenericModalProps) => {
    return (
        <div
            className={`
                text-[#bbbbbb] font-light
                text-lg
                ${className || ""}`}
        >
            {children}
        </div>
    );
};

export const ModalFooter = ({
    children, className
}: GenericModalProps) => {
    return (
        <div className={`${className || ""}`}>
            {children}
        </div>
    );
};

export const ModalTrigger = ({
    children, className
}: GenericModalProps) => {
    const { closeModal } = useModal();

    return (
        <RotMGButton className={className} onClick={closeModal} >
            {children}
        </RotMGButton>
    );
}

export const Modal = ({
    name,
    children,
    className
}: GenericModalProps & { name: OnScreenModal }) => {
    const { activeModal } = useModal();

    if (activeModal !== name) return null;

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-[#222222]">

            <div
                className={`
                flex flex-col space-y-4
                items-center justify-center
                min-w-[50px] min-h-[50px]
                border-[2px] border-white
                rounded-lg bg-[#363636]
                p-4 font-myriadpro shadow-2xl
                ${className || ""}`}

                style={{
                    textShadow: '0px 0px 10px black'
                }}
            >
                {children}
            </div>
        </div>
    );
};
