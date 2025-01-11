import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTrigger } from "@/components/generic/modal";
import { DefaultButton } from "@/components/generic/rotmg-button";
import { useModal } from "@/context/modal-context";
import { useState } from "react";

export default function ExportModal() {
    const [gifDisabled, setGifDisabled] = useState(true);
    const { closeModal } = useModal();

    const onExport = () => {
        closeModal();
    };

    return (
        <Modal name="ExportModal" className="sm:w-[450px] sm:h-[270px] max-h-[270px] !p-2 flex justify-between" backgroundColor="black">
            <ModalHeader>
                Export
            </ModalHeader>

            <ModalBody className="flex flex-col gap-5 px-8 w-full h-full">
                <div className="flex gap-5 w-full">
                    <label htmlFor="name" className="font-bold text-xl w-1/2">Format:</label>
                    <div className="w-full h-fit font-normal border-[1px] border-[#717171] text-lg">
                        <select name="mode" className="rotmg-dropdown w-full" defaultValue="PNG" onChange={(e) =>  setGifDisabled(e.target.value === "PNG")}>
                            <option value="PNG">PNG</option>
                            <option value="GIF">GIF</option>
                        </select>
                    </div>
                </div>
                {!gifDisabled && <div className="flex gap-5 w-full">
                    <label htmlFor="name" className="font-bold text-xl w-1/2 whitespace-nowrap">GIF Delay:</label>
                    <div className="w-full h-fit font-normal border-[1px] border-[#717171] text-lg">
                        <select name="mode" className="rotmg-dropdown w-full" defaultValue="Any Type" onChange={() => { }}>
                            {
                                Array.from(Array(10).keys()).map((index) =>
                                    <option key={index} value={(index + 1) * 100}>{(index + 1) * 100}ms</option>
                                )
                            }
                        </select>
                    </div>
                </div>}
                <div className="flex gap-5 w-full h-full">
                    <label htmlFor="name" className="font-bold text-xl w-1/2">RotMGify:</label>
                    <div className="w-full max-h-[30px] flex items-center justify-center">
                        <input
                            type="checkbox"
                            name="rotmgify"
                            id="rotmgify"
                            className="w-6 h-6 max-h-[30px] border-2 border-gray-600 rounded-md checked:bg-blue-600 transition duration-200"
                        />
                    </div>
                </div>
            </ModalBody>

            <ModalFooter className="w-full flex justify-end gap-4 p-3">
                <ModalTrigger className="w-[140px] h-[30px] !pt-0">Cancel</ModalTrigger>
                <DefaultButton className="w-[140px] h-[30px] !pt-0" onClick={onExport}>Export</DefaultButton>
            </ModalFooter>
        </Modal>
    );
};