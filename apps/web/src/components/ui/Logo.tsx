import Image from "next/image";
import Link from "next/link";

interface LogoProps {
    variant?: "horizontal" | "stacked";
    className?: string;
}

export default function Logo({ variant = "horizontal", className = "" }: LogoProps) {
    const isHorizontal = variant === "horizontal";

    return (
        <Link href="/" className={`inline-block transition-opacity hover:opacity-90 ${className}`}>
            <Image
                src={isHorizontal ? "/logo-horizontal.svg" : "/logo-stacked.svg"}
                alt="Priority Home Monitor"
                width={isHorizontal ? 200 : 150}
                height={isHorizontal ? 60 : 150}
                className="object-contain"
                priority
            />
        </Link>
    );
}