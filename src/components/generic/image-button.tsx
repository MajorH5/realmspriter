import { ButtonClickSfx } from "@/resources/audio";
import { useAudioPlayer } from "@/context/audio-player-context";
import { StaticImageData } from "next/image";

type ImageButtonProps = {
    onClick?: () => void;
    image: StaticImageData;
    scale?: number;
    title: string;
    size?: number;
    offset?: number;
    totalSpritesX?: number;
    className?: string;
};

export default function ImageButton({
    onClick,
    image,
    scale,
    title,
    size = 16,
    offset = 0,
    totalSpritesX = 1,
    className
}: ImageButtonProps) {
    const { playSfx } = useAudioPlayer();

    const xOffset = size * (offset % totalSpritesX);
    const yOffset = size * Math.floor(offset / totalSpritesX);

    const handleClick = () => {
        if (onClick !== undefined) onClick();
        playSfx(ButtonClickSfx);
    };

    return (
        <button
            title={title}
            onClick={handleClick}
            className={className}
            style={{
                imageRendering: 'pixelated',
                transformOrigin: 'top left',
                scale: scale,
                width: size,
                height: size,
                background: `url("${image.src}") ${-xOffset}px ${-yOffset}px`
            }}
        />
    );
}