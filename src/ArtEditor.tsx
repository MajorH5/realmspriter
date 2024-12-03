import BackgroundMarquee from "./BackgroundMarquee";
import Modal from "./Modal";

export default function ArtEditor() {

    return (
        <>
            <div className="art-editor overflow-hidden">
                <BackgroundMarquee image="/assets/images/background.png" />
                <Modal header="Welcome" buttonAction="Enter">
                    {"Welcome to RealmSpriter. By clicking 'Enter', you are indicating that you have read and agreed to the Terms of Use and Privacy Policy."}
                    <div className="flex flex-row space-x-5 justify-center items-center">
                        <a href="/" className="text-[#5d56bd] select-none" style={{ fontFamily: 'myriadpro' }}>Terms of use</a>
                        <a href="/" className="text-[#5d56bd] select-none" style={{ fontFamily: 'myriadpro' }}>Privacy Policy</a>
                    </div>
                </Modal>

                <Modal header="Disclaimer" buttonAction="I Understand">
                    <div className="overflow-y-scroll w-full h-full max-h-[30rem] p-3 py-4">
                        This website (www.realmspriter.com) and the tools provided herein are intended for entertainment and educational purposes only. This tool is a clone of a currently defunct tool originally created by Wildshadow Studios and is NOT associated with Realm of the Mad God (RotMG) or DECA LIVE OPERATIONS GMBH in any way.

                        All trademarks, service marks, trade names, product names, artworks, logos, and trade dress appearing on this website are the property of their respective owners, including but not limited to Wildshadow Studios, Kabam, Inc., and DECA LIVE OPERATIONS GMBH. Any reference to specific entities or brands on this website is purely for informational purposes and does not imply endorsement or affiliation.

                        By using this website and the tools provided herein, you agree to use them responsibly and in accordance with all applicable laws, rules, and regulations. You further acknowledge that the creators of this website shall not be liable for any damages or losses arising from the use or misuse of the tools provided.

                        Any artworks created using this tool are the sole responsibility of the user. The creators of this website shall not be held liable for any copyright infringement, intellectual property disputes, or legal claims arising from the creation, distribution, or use of artworks generated with this tool.

                        Users are advised to ensure that they have the necessary rights and permissions for any images, sprites, or other assets used in their artworks. It is the user's responsibility to obtain proper licensing or permissions for any third-party content used in their creations.

                        This website and its creators reserve the right to modify, suspend, or terminate access to the tools provided herein at any time and without prior notice.
                        The artwork uploaded to this website may be subject to removal or deletion at the discretion of the website owners or administrators. Reasons for removal may include, but are not limited to:

                        Violation of the website's terms of use,
                        Copyright infringement or intellectual property disputes,
                        Inappropriate or offensive content,
                        Technical issues or maintenance requirements.
                        The website owners reserve the right to remove or delete artwork without prior notice or explanation. Users acknowledge that they do not have an inherent right to the permanent storage or display of their artwork on this website.
                        By selecting "I Understand", you acknowledge that you have read and understood the information provided above.
                    </div>
                </Modal>
            </div>
        </>
    );
}
