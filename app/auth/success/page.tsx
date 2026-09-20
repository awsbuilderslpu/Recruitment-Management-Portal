"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace("/dashboard");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center bg-background px-5">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-8 w-8"
          >
            <path
              d="m5 12 4 4L19 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mt-5 text-[22px] font-semibold tracking-[-0.035em]">
          Authenticated Successfully
        </h1>
      </div>
    </div>
  );
}