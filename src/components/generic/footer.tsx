import Link from "next/link";

export default function Footer() {
    return (
        <div className="pb-4 mt-auto text-center font-sans hidden sm:block">
            <p>
                <Link target="_blank" href="/legal/terms-of-use">Terms of use</Link>&nbsp;|&nbsp;
                <Link target="_blank" href="/legal/privacy-policy">Privacy Policy</Link>
            </p>
            <p
                className="mt-4 text-xs text-[#666666]"
            >&copy; 2024 RealmSpriter. All rights reserved.</p>
        </div>
    );
}