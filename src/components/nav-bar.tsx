"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NavBar({ title, showBack, action }: { title: string; showBack?: boolean; action?: ReactNode }) {
  const router = useRouter();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-11 w-11 rounded-full"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : null}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">FoodTinder</p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[color:var(--primary)]">
            {title}
          </h1>
        </div>
      </div>
      {action}
    </div>
  );
}
