import BackgroundImage from './assets/images/background.png';

type BackgroundMarqueeProps = {
    image: string
}

export default function BackgroundMarquee ({ image }: BackgroundMarqueeProps) {
    return (
        <div className="absolute bg-repeat w-[200%] h-full" style={{
            backgroundImage: `url("${BackgroundImage}")`
        }}>
        </div>
    );
}