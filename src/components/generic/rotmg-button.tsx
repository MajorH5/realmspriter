import { useAudioPlayer } from "@/context/audio-player-context";
import { ButtonClickSfx } from "@/resources/audio";

type RotMGButtonProps = {
    onClick?: () => void;
    playClickSfx?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export default function RotMGButton({
    onClick,
    playClickSfx = true,
    children,
    className
}: RotMGButtonProps) {
    const { playSfx  } = useAudioPlayer();

    return (
        <button
            className={`
                bg-white py-1 px-8 text-[#363636]
                rounded-lg font-bold
                hover:bg-[#ffda84]
                disabled:bg-[#4f4f4f]
                text-lg
                ${className || ""}`}
            onClick={() => {
                if (playClickSfx) {
                    playSfx(ButtonClickSfx);
                }

                if (onClick !== undefined) {
                    onClick();
                };
            }}
        >
            {children}
        </button>
    );
}
