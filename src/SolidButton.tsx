import React from "react";

type SolidButtonProps = {
    children: React.ReactNode,
    onClick?: React.MouseEventHandler<HTMLButtonElement>
};

export default function SolidButton({ onClick, children }: SolidButtonProps) {
    return (
        <button
            onClick={onClick}
            className="bg-white hover:bg-[#ffda84] text-[#363636] py-1 px-8 rounded-lg text-lg"
        >
            {children}
        </button>
    );
}