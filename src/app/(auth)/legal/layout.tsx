import "./legal.css";

export default function LegalLayout ({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center justify-center m-0 p-8 text-[14px]">
            {children}
        </div>
    );
}