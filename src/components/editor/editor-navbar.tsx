import { useModal } from "@/context/modal-context";
import ImageButton from "../generic/image-button";
import { Icons } from "@/resources/images";
import { useEditor } from "@/context/art-editor-context";
import { EditMode } from "@/utils/constants";
import { useState } from "react";
import { useHistory } from "@/context/history/history-context";

type NavButton = { title: string, offset: number, onClick: () => void, mode?: EditMode.Type }

export default function EditorNavbar() {
    const { openModal } = useModal();
    const { setEditMode, editMode, clearImage } = useEditor();
    const [menuOpen, setMenuOpen] = useState(false);
    const { undo, redo } = useHistory();

    const getButtonClass = (targetState: EditMode.Type) =>
        `w-full h-full flex flex-col items-center justify-center text-sm ${editMode === targetState ? "bg-[rgba(255,255,255,0.5)]" : ""}`;

    const primaryButtons: NavButton[] = [
        { title: "draw", offset: 26, onClick: () => setEditMode(EditMode.DRAW), mode: EditMode.DRAW },
        { title: "erase", offset: 27, onClick: () => setEditMode(EditMode.ERASE), mode: EditMode.ERASE },
        { title: "sample", offset: 28, onClick: () => setEditMode(EditMode.SAMPLE), mode: EditMode.SAMPLE },
        { title: "undo", offset: 29, onClick: () => undo() },
        { title: "redo", offset: 34, onClick: () => redo() },
        { title: "clear", offset: 9, onClick: () => clearImage(true) },
        { title: "menu", offset: 35, onClick: () => setMenuOpen((prev) => !prev) }
    ];

    const secondaryButtons: NavButton[] = [
        { title: "share", offset: 30, onClick: () => { } },
        { title: "export", offset: 31, onClick: () => openModal("ExportModal") },
        { title: "save", offset: 32, onClick: () => openModal("SaveModal") },
        { title: "browse", offset: 33, onClick: () => openModal("LoadModal") },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-[#363636] text-white shadow-md sm:hidden" style={{ zIndex: 100 }}>
            <div className="flex justify-around items-center h-14 px-4">
                {primaryButtons.map((btn, index) => (
                    <div key={`primary-${btn.title}`} className="flex flex-1 justify-center items-center h-full">
                        {/* Replace the outer <button> with a <div> */}
                        <div
                            className={btn.mode ? getButtonClass(btn.mode) : "w-full h-full flex flex-col items-center justify-center text-sm"}
                            onClick={btn.onClick}
                            role="button"
                            tabIndex={0} // Ensure the element is focusable
                            onKeyPress={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    btn.onClick();
                                }
                            }}
                        >
                            <ImageButton title={btn.title} totalSpritesX={5} offset={btn.offset} scale={2} image={Icons} />
                        </div>
                        {(index === 2 || index === 4 || index === 5) && (
                            <div key={`divider-${index}`} className="w-[3px] h-1/2 bg-[rgba(255,255,255,0.25)] mx-4" />
                        )}
                    </div>
                ))}
            </div>

            <div
                className={`flex justify-around items-center bg-[#2C2C2C] px-4 transition-all duration-300 ease-in-out ${menuOpen ? 'h-14' : 'h-0 overflow-hidden'}`}
            >
                {menuOpen &&
                    secondaryButtons.map((btn) => (
                        <div key={`secondary-${btn.title}`} className="flex flex-1 justify-center h-full">
                            <div
                                className="w-full h-full flex flex-col items-center justify-center text-sm"
                                onClick={btn.onClick}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        btn.onClick();
                                    }
                                }}
                            >
                                <ImageButton title={btn.title} totalSpritesX={5} offset={btn.offset} scale={2} image={Icons} />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
