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
                width={isHorizontal ? 250 : 150}
                height={isHorizontal ? 75 : 150}
                className={`object-contain ${isHorizontal ? 'w-56 lg:w-64 h-auto' : 'w-32 h-auto'}`}
                priority
            />
        </Link>
    );
}