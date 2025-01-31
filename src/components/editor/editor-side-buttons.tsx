import { useEditor } from "@/context/art-editor-context";
import { BorderButton } from "../generic/rotmg-button";
import { EditMode } from "@/utils/constants";
import { useModal } from "@/context/modal-context";

export default function EditorSideButtons({
    className
}: {
    className: string
}) {
    const { editMode, setEditMode, clearImage } = useEditor();
    const { openModal } = useModal();

    const getSelectStyle = (targetState: EditMode.Type) => {
        return editMode === targetState ? "!bg-[rgba(255,255,255,0.5)]" : "";
    };

    return (
        <div className={`hidden sm:flex flex-col max-w-[300px] absolute z-40 space-y-10 ${className || ""}`}>
            <div className="flex flex-col space-y-2">
                <BorderButton
                    onClick={() => setEditMode(EditMode.DRAW)}
                    className={`py-[2px] pl-3 pr-6 ${getSelectStyle(EditMode.DRAW)}`}>
                    (D)raw
                </BorderButton>

                <BorderButton
                    onClick={() => setEditMode(EditMode.ERASE)}
                    className={`py-[2px] pl-3 pr-6 ${getSelectStyle(EditMode.ERASE)}`}>
                    (E)rase
                </BorderButton>

                <BorderButton
                    onClick={() => setEditMode(EditMode.SAMPLE)}
                    className={`py-[2px] pl-3 pr-6 ${getSelectStyle(EditMode.SAMPLE)}`}>
                    S(A)mple
                </BorderButton>

                <BorderButton className="py-[2px] pl-3 pr-6">(U)ndo</BorderButton>
                <BorderButton className="py-[2px] pl-3 pr-6">(R)edo</BorderButton>
                <BorderButton onClick={clearImage} className="py-[2px] pl-3 pr-6">(C)lear</BorderButton>
            </div>
            <div className="flex flex-col space-y-2">
                <BorderButton onClick={() => openModal("LoadModal")} className="py-[2px] pl-3 pr-6">(L)oad</BorderButton>
                <BorderButton onClick={() => openModal("SaveModal")} className="py-[2px] pl-3 pr-6">(S)ave</BorderButton>
                <BorderButton onClick={() => openModal("ExportModal")} className="py-[2px] pl-3 pr-6">E(X)port</BorderButton>
            </div>
        </div >
    );
}
