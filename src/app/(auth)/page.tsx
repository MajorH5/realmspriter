import ArtEditor from "@/components/editor/art-editor";
import Footer from "@/components/generic/footer";
import { ArtEditorProvider } from "@/context/art-editor-context";
import { ModalProvider } from "@/context/modal-context";

export default function RealmSpriter() {
    return (
        <div
            className="flex flex-col min-h-screen overflow-x-hidden bg-black text-white"
        >
            <div className="flex items-center justify-center">
                <ArtEditorProvider>
                    <ModalProvider>
                        <ArtEditor />
                    </ModalProvider>
                </ArtEditorProvider>
            </div>

            <p className="text-center m-4">
                To report issues or give feedback email us at&nbsp;
                <a target="_blank" href="mailto:feedback@realmspriter.com">feedback@realmspriter.com</a>
                .
            </p>

            <Footer />
        </div>
    );
}
