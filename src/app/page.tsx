import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="absolute inset-0 overflow-hidden text-white">
      <Image
        src="/landing-bg.png"
        alt="FoodTinder landing"
        fill
        sizes="(max-width: 768px) 100vw, 420px"
        className="object-cover"
        style={{ objectPosition: "50% 20%" }}
        priority
      />
      <div className="relative flex h-full flex-col items-center px-6 pt-10 pb-[calc(env(safe-area-inset-bottom)_+_40px)] text-center">
        <Button
          asChild
          size="lg"
          className="mt-auto mb-[72px] h-[68px] w-full max-w-[300px] rounded-2xl bg-gradient-to-r from-[#a93d18] to-[#c06822] text-white shadow-lg transition hover:brightness-110 hover:shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
        >
          <Link href="/create">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
