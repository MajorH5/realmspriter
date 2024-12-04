import { ModalProvider } from "@/context/modal-context";
import RealmTrees from "../../../public/images/background.png";
import ScrollingBackground from "./scrolling-background";
import WelcomeModal from "./editor-modals";

type ArtEditorProps = {
    className?: string
}

export default function ArtEditor({
    className
}: ArtEditorProps) {
    return (
        <div
            className={`max-w-[880px] max-h-[700px] aspect-[880/700] w-full block overflow-hidden relative ${className || ""}`}
        >
            <div className="z-20">
                <ModalProvider>
                    {/* Every openable modal is contained in here */}
                    {/* Only opened modals are rendered */}
                    <div className="w-full h-full absolute z-20">
                        <WelcomeModal />
                    </div>
                </ModalProvider>
            </div>

            <ScrollingBackground scale={4} image={RealmTrees} />
        </div>
    );
}
