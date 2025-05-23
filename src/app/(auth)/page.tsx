import ArtEditor, { Loading } from "@/components/editor/art-editor";
import Footer from "@/components/generic/footer";
import { ArtEditorProvider } from "@/context/art-editor-context";
import { AudioPlayerProvider } from "@/context/audio-player-context";
import { HistoryProvider } from "@/context/history/history-context";
import { ModalProvider } from "@/context/modal-context";
import { Suspense } from "react";

export default function RealmSpriter() {
    return (
        <div
            className="flex flex-col min-h-dvh overflow-x-hidden bg-black text-white touch-none"
            style={{

                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",
            }}
        >
            <div className="flex items-center justify-center">
                <AudioPlayerProvider>
                    <HistoryProvider>
                        <ArtEditorProvider>
                            <ModalProvider>
                                <Suspense fallback={<Loading />}>
                                    <ArtEditor />
                                </Suspense>
                            </ModalProvider>
                        </ArtEditorProvider>
                    </HistoryProvider>
                </AudioPlayerProvider>
            </div>

            <p className="text-center m-4 hidden sm:block">
                To report issues or give feedback email us at&nbsp;
                <a target="_blank" href="mailto:feedback@realmspriter.com">feedback@realmspriter.com</a>
                .
            </p>

            <Footer />
        </div>
    );
}
