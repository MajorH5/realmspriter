import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTrigger
} from "../../generic/modal";
import { DefaultButton, TextButton } from "@/components/generic/rotmg-button";
import { useEffect, useState } from "react";
import { BorderButton } from "@/components/generic/rotmg-button";
import ImageButton from "@/components/generic/image-button";
import { Icons } from "@/resources/images";
import { RotMGSpriteLoader } from "@/resources/RotMGSpriteLoader/RotMGSpriteLoader";
import { Object } from "@/resources/RotMGSpriteLoader/object";
import { useQuery } from "@/resources/query";
import { Page } from "@/resources/RotMGSpriteLoader/page";

function SpriteCell({ object }: { object: Object }) {
    console.log(object);
    return (
        <div
            className="relative w-[112px] h-[112px] overflow-hidden cursor-pointer hover:bg-[rgba(255,255,255,0.25)]"
            style={{
                textShadow: '0px 0px 3px black'
            }}
        >
            <p className="absolute text-sm text-[#999999] bottom-1 whitespace-nowrap pl-1">EnergyStaff</p>
        </div>
    );
};

export default function LoadModal() {
    const [isSearching, setIsSearching] = useState(false);
    const [page, setPage] = useState<Page | null>(null);

    const loader = new RotMGSpriteLoader(12);
    const { search } = useQuery(loader);

    if (!loader.isLoaded()) {
        loader.waitLoad();
    }

    const loadPage = () => {
        if (isSearching) return;

        setPage(null);
        setIsSearching(true);

        RotMGSpriteLoader.preloadAll()
            .then(() => {
                return search("All", "Any Type", "oryx");
            })
            .then((result) => {
                
                const [page, pageNumber] = result;
                if (page !== undefined) {
                    setPage(page);
                } else {
                    setPage(null);
                }

                setIsSearching(false);
            });
    };

    useEffect(() => { loadPage(); }, []);

    return (
        <Modal
            name="LoadModal"
            className="sm:w-[680px] sm:h-[550px] !p-2"
            backgroundColor="black"
        >
            <ModalHeader className="w-full flex-col">
                <div className="relative w-full h-full flex flex-col">

                    <p className="w-full">Load</p>
                    <ModalTrigger
                        className="rounded-lg border-[#666666] text-sm !px-2 absolute right-1"
                        ButtonComponent={BorderButton}
                    >
                        X
                    </ModalTrigger>
                    <div className="relative w-full h-fit flex items-center justify-center gap-x-4 mt-2">
                        <ImageButton
                            className="block sm:hidden"
                            title="filters"
                            totalSpritesX={5}
                            offset={23}
                            scale={2}
                            image={Icons}
                            onClick={() => { }}
                        />
                        <div className="hidden sm:block w-fit h-fit font-normal border-[1px] border-[#717171] text-lg">
                            <select name="mode" className="rotmg-dropdown" defaultValue="Community">
                                <option value="Community">Community</option>
                                <option value="Deca">Deca</option>
                                <option value="Mine">Mine</option>
                                <option value="All">All</option>
                            </select>
                        </div>
                        <div className="hidden sm:block w-fit h-fit font-normal border-[1px] border-[#717171] text-lg">
                            <select name="mode" className="rotmg-dropdown" defaultValue="Any Type" onChange={() => { }}>
                                <option value="Any Type">Any Type</option>
                                <option value="Items">Items</option>
                                <option value="Entities">Entities</option>
                                <option value="Tiles">Tiles</option>
                                <option value="Objects">Objects</option>
                                <option value="Misc">Misc</option>
                            </select>
                        </div>
                        <div className="flex flex-col justify-end items-end h-full">
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                placeholder="tags (comma-separated)"
                                className="w-full h-full sm:w-[185px] text-base bg-transparent pl-1 border border-[#4f4f4f] placeholder:text-[#7A7A7A] text-[#B5B5B5] font-normal"
                                onSubmit={() => loadPage()}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        // @ts-ignore
                                        e.target.blur();
                                        loadPage();
                                    }
                                }}
                            />
                        </div>
                        <DefaultButton
                            onClick={() => loadPage()}
                            className="!px-6 !py-0 h-[32px]"
                            disabled={isSearching}
                        >
                            Search
                        </DefaultButton>
                    </div>
                </div>
            </ModalHeader>

            <ModalBody className="w-full h-full max-h-[1/2] overflow-y-scroll sm:max-h-none sm:overflow-hidden">
                {isSearching ?
                    (
                        <div className="w-full h-full flex justify-center items-center font-bold">
                            <p>Loading...</p>
                        </div>
                    ) :
                    (
                        <div className="w-full h-full flex flex-row gap-x-10 flex-wrap justify-center items-center">
                            {page?.getObjects().map((obj) => <SpriteCell key={Math.random().toString()} object={obj} />)
                            }
                        </div>
                    )
                }
            </ModalBody>

            <ModalFooter className="w-full">
                <div className="relative w-full flex justify-between items-end p-1">
                    <TextButton
                        onClick={() => loadPage()}
                        disabled={isSearching}
                        className="pb-1 pl-2"
                    >
                        <p className="text-xl">Previous</p>
                    </TextButton>
                    <TextButton
                        onClick={() => loadPage()}
                        disabled={isSearching}
                        className="pb-1 pr-2"
                    >
                        <p className="text-xl">Next</p>
                    </TextButton>
                </div>

            </ModalFooter>
        </Modal>
    );
};
