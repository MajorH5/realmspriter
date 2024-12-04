import Image, { StaticImageData } from "next/image";

const MIN_SCALE = 2;

type ScrollingBackgroundProps = {
    image: StaticImageData,
    scale?: number
}

export default function ScrollingBackground({
    image,
    scale = MIN_SCALE
}: ScrollingBackgroundProps) {
    scale = Math.floor(Math.max(scale, MIN_SCALE));

    return (
        <div
            className="w-full h-full overflow-hidden relative"
        >
            <div className="absolute w-full h-full bg-black z-10 opacity-40" />
            <div
                style={{
                    backgroundImage: `url("${image.src}")`,
                    width: `${image.width * scale}px`,
                    height: `${image.height * scale}px`
                }}
                className="w-[200%] h-[200%] bg-repeat image-marquee"
            />
        </div>
    );
}
