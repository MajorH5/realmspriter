type RotMGButtonProps = {
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
}

export default function RotMGButton({
    onClick,
    children,
    className,
}: RotMGButtonProps) {
    return (
        <button
            className={`
                bg-white py-1 px-8 text-[#363636]
                rounded-lg font-bold
                hover:bg-[#ffda84]
                disabled:bg-[#4f4f4f]
                text-lg
                ${className || ""}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
