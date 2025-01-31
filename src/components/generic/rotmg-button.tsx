import { useAudioPlayer } from "@/context/audio-player-context";
import { ButtonClickSfx } from "@/resources/audio";

export type RotMGButtonProps = {
    onClick?: () => void;
    playClickSfx?: boolean;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
};

const withDefaultClassName = (defaultClass: string) => {
    return ({ className, onClick, playClickSfx = true, children, disabled }: RotMGButtonProps) => {
        const { playSfx } = useAudioPlayer();

        const handleClick = () => {
            if (onClick !== undefined) onClick();
            if (playClickSfx) playSfx(ButtonClickSfx);
        };

        return <button
            onClick={handleClick}
            className={`${defaultClass} ${className || ""}`}
            disabled={disabled}
        >
            {children}
        </button >
    };
};

export const BorderButton = withDefaultClassName(`
                text-white
                border-[2px] bg-transparent
                hover:bg-[rgba(255,255,255,0.5)]
                active:bg-transparent
                text-lg text-left
                font-myriadpro`);

export const TextButton = withDefaultClassName(`
                text-white text-lg font-bold
                bg-transparent
                hover:text-[#ffda84]
                disabled:text-gray-400 disabled:hover:text-gray-400 disabled:cursor-not-allowed`);

export const DefaultButton = withDefaultClassName(`
                bg-white py-1 px-8 text-[#363636]
                rounded-lg font-bold
                hover:bg-[#ffda84]
                disabled:bg-[#4f4f4f]
                text-lg`);
