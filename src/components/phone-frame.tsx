import React from "react";

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="relative overflow-hidden rounded-[2.75rem] border border-[#e9d7c6] bg-[linear-gradient(180deg,_#fff9f1_0%,_#fff2f6_55%,_#ffe9e1_100%)] shadow-[0_18px_45px_rgba(134,54,54,0.18)]">
        <div className="absolute left-1/2 top-3 h-6 w-24 -translate-x-1/2 rounded-full bg-[#efe0d2]" />
        <div className="absolute left-12 top-4 h-2 w-2 rounded-full bg-[#c9b3a3]" />
        <div className="absolute right-12 top-4 h-2 w-2 rounded-full bg-[#c9b3a3]" />
        <div className="max-h-[90vh] min-h-[90vh] overflow-hidden rounded-[2.75rem] bg-[linear-gradient(135deg,_#fff3e4_0%,_#ffd1b3_40%,_#ffb07a_70%,_#f59a6f_100%)] px-5 pb-5 pt-10">
          {children}
        </div>
      </div>
    </div>
  );
}
