import { useModal } from "@/context/modal-context";
import { useAuth } from "@/context/auth-context";

import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTrigger
} from "../../generic/modal";

export default function DisclaimerModal() {
    const { openModal } = useModal();
    const { user, login } = useAuth();

    const onDisclaimerClose = async () => {
        if (user !== null) {
            openModal("CurrentAccountModal");
        }
    };

    return (
        <Modal name="DisclaimerModal" className="sm:w-[550px] sm:h-[580px]">
            <ModalHeader>
                Disclaimer
            </ModalHeader>

            <ModalBody>
                <div className="w-full max-h-[440px] overflow-x-none overflow-y-auto px-2">
                    <p>
                        This website (www.realmspriter.com) and the tools provided herein are intended for
                        entertainment and educational purposes only. This tool is a clone of a currently
                        defunct tool originally created by Wildshadow Studios and is NOT associated with
                        Realm of the Mad God (RotMG) or DECA LIVE OPERATIONS GMBH in any way.
                    </p>
                    <p>
                        All trademarks, service marks, trade names, product names, artworks, logos, and
                        trade dress appearing on this website are the property of their respective owners,
                        including but not limited to Wildshadow Studios, Kabam, Inc., and DECA LIVE OPERATIONS
                        GMBH. Any reference to specific entities or brands on this website is purely for
                        informational purposes and does not imply endorsement or affiliation.
                    </p>
                    <p>
                        By using this website and the tools provided herein, you agree to use them responsibly
                        and in accordance with all applicable laws, rules, and regulations. You further
                        acknowledge that the creators of this website shall not be liable for any damages
                        or losses arising from the use or misuse of the tools provided.
                    </p>
                    <p>
                        Any artworks created using this tool are the sole responsibility of the user. The
                        creators of this website shall not be held liable for any copyright infringement,
                        intellectual property disputes, or legal claims arising from the creation, distribution,
                        or use of artworks generated with this tool.
                    </p>
                    <p>
                        Users are advised to ensure that they have the necessary rights and permissions for
                        any images, sprites, or other assets used in their artworks. It is the user's responsibility
                        to obtain proper licensing or permissions for any third-party content used in their creations.
                    </p>
                    <p>
                        This website and its creators reserve the right to modify, suspend, or terminate access
                        to the tools provided herein at any time and without prior notice. The artwork uploaded
                        to this website may be subject to removal or deletion at the discretion of the website
                        owners or administrators. Reasons for removal may include, but are not limited to 
                        Violation of the website's terms of use, Copyright infringement or intellectual property disputes,
                        Inappropriate or offensive content, Technical issues or maintenance requirements.
                    </p>
                    <p>
                        The website owners reserve the right to remove or delete artwork without prior notice
                        or explanation. Users acknowledge that they do not have an inherent right to the
                        permanent storage or display of their artwork on this website.
                    </p>
                    <p>
                        By selecting "I Understand", you acknowledge that you have read and understood
                        the information provided above.
                    </p>
                </div>
            </ModalBody>

            <ModalFooter>
                <ModalTrigger className="rotmg-button" onClick={onDisclaimerClose}>
                    I Understand
                </ModalTrigger>
            </ModalFooter>
        </Modal>
    );
}