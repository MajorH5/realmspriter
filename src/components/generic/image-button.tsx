import Image, { StaticImageData } from "next/image";

type ImageButtonProps = {
    onClick?: () => void;
    image: StaticImageData;
    scale?: number;
    title: string;
    size?: number;
    offset?: number;
    totalSpritesX?: number;
};

export default function ImageButton({
    onClick,
    image,
    scale,
    title,
    size = 16,
    offset = 0,
    totalSpritesX = 1
}: ImageButtonProps) {
    const xOffset = size * (offset % totalSpritesX);
    const yOffset = size * Math.floor(offset / totalSpritesX);

    return (
        <button
            title={title}
            onClick={onClick}
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