import { useState } from "react";
import SolidButton from "./SolidButton";

type ModalProps = {
    children?: React.ReactNode,
    buttonAction?: string,
    header: string
}

export default function Modal({ header, children, buttonAction }: ModalProps) {
    const [visible, setVisible] = useState(true);

    return (
        <div
            className={`${!visible ? 'hidden' : ''} flex flex-row justify-center items-center h-full`}
        >
            <div
                className="bg-[#363636] p-1 px-4 flex flex-col space-y-3 drop-shadow-md shadow-inner rounded-lg border-2 border-white bc-white items-center justify-center"
                style={{
                    minHeight: 230,
                    maxWidth: 600,
                    maxHeight: 600
                }}
            >
                <p className="text-[#578763] w-full text-center drop-shadow-lg text-2xl">{header}</p>
                <div className="text-[#bbbbbb] drop-shadow-lg text-[1.1rem]" style={{ fontFamily: 'myriadpro_light' }}>{children}</div>
                <SolidButton onClick={() => setVisible(false)}>
                    {buttonAction}
                </SolidButton>
            </div>
        </div>
    );
}