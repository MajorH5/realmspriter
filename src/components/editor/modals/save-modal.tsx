import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTrigger } from "@/components/generic/modal";
import { DefaultButton } from "@/components/generic/rotmg-button";
import { useModal } from "@/context/modal-context";
export default function SaveModal() {
    const { closeModal } = useModal();

    const onSave = () => {
        closeModal();
    };

    return (
        <Modal name="SaveModal" className="sm:w-[450px] sm:h-[420px] max-h-[420px] !p-2 flex justify-between" backgroundColor="black">
            <ModalHeader>
                Save
            </ModalHeader>

            <ModalBody className="flex flex-col gap-5 px-8 w-full h-full">
                <div className="flex gap-5 w-full">
                    <label htmlFor="name" className="font-bold text-xl w-1/5">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="name of your creation"
                        className="w-full bg-transparent pl-1 border border-[#4f4f4f] placeholder:text-[#7A7A7A] font-normal text-sm"
                        style={{ textShadow: '0px 0px 3px black' }}
                    />
                </div>
                <div className="flex gap-5 w-full">
                    <label htmlFor="name" className="font-bold text-xl w-1/5">Type:</label>
                    <div className="w-full h-fit font-normal border-[1px] border-[#717171] text-lg">
                        <select name="mode" className="rotmg-dropdown w-full" defaultValue="Any Type" onChange={() => { }}>
                            <option value="Any Type">Any Type</option>
                            <option value="Items">Items</option>
                            <option value="Entities">Entities</option>
                            <option value="Tiles">Tiles</option>
                            <option value="Objects">Objects</option>
                            <option value="Misc">Misc</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-5 w-full h-full">
                    <label htmlFor="name" className="font-bold text-xl w-1/5">Tags:</label>
                    <textarea
                        id="name"
                        name="name"
                        placeholder={"comma-separated list of tags (e.g. \"elf, wizard, abyss of demons, crunchy\")"}
                        className="w-full h-full bg-transparent pl-1 border border-[#4f4f4f] placeholder:text-[#7A7A7A] font-normal text-sm resize-none"
                        style={{ textShadow: '0px 0px 3px black' }}
                    />
                </div>
            </ModalBody>

            <ModalFooter className="w-full flex justify-end gap-4 p-3">
                <ModalTrigger className="w-[140px] h-[30px] !pt-0">Cancel</ModalTrigger>
                <DefaultButton className="w-[140px] h-[30px] !pt-0" onClick={onSave}>Save</DefaultButton>
            </ModalFooter>
        </Modal>
    );
};