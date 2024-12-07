import WelcomeModal from "./welcome-modal";
import DisclaimerModal from "./disclaimer-modal";
import CurrentAccountModal from "./current-account-modal";
import SignInModal from "./sign-in-modal";

export default function () {
    return (
        <>
            {/* Every openable modal is contained in here */}
            {/* Only opened modals are rendered */}
            <div className="w-full h-full absolute z-20">
                <WelcomeModal />
                <DisclaimerModal />
                <CurrentAccountModal />
                <SignInModal />
            </div>
        </>
    );
}
