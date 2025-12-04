"use client";

import Image from "next/image";

// Import shared components
import { HeaderProvider } from "@/components/shared/header/HeaderContext";
import HeroInput from "@/components/app/(home)/sections/hero-input/HeroInput";

export default function LandingPage() {
  return (
    <HeaderProvider>
      <div className="min-h-screen bg-white relative">
        {/* Header/Topbar Section */}
        <div className="absolute bg-white flex items-center justify-between px-12 py-4 right-0 top-0 w-full">
          <div className="flex gap-2 items-center">
            <div className="relative rounded-lg shrink-0 w-10 h-10">
              <Image
                src="/logo_icon.png"
                alt="WizCommerce Logo"
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
            </div>
            <p className="font-['Satoshi',sans-serif] font-bold leading-9 text-2xl text-black">
              WizCommerce
            </p>
          </div>
          <div className="flex items-center">
            <div className="flex items-center pl-1.5 pr-0 py-0">
              <div className="bg-[#4578c4] flex flex-col items-center justify-center relative rounded-lg shrink-0 w-8 h-8">
                <div className="absolute flex flex-col font-['Satoshi',sans-serif] font-bold justify-center leading-none left-1/2 text-sm text-center text-white top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                  <p className="leading-5">OP</p>
                </div>
              </div>
              <div className="flex flex-col items-start relative rounded-tl rounded-tr shrink-0">
                <div className="bg-white flex flex-col items-start justify-center relative rounded-lg shrink-0">
                  <div className="flex items-center pl-3 pr-0 py-0 relative rounded-tl rounded-tr shrink-0 w-full">
                    <div className="flex flex-col items-center justify-center px-0 py-2 relative shrink-0">
                      <svg
                        className="relative shrink-0 w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section
          className="flex items-center justify-center min-h-screen pt-20"
          id="home-hero"
        >
          <div className="flex flex-col gap-9 items-center w-full max-w-[812px] px-4">
            {/* Welcome Text and Title */}
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col gap-4 items-center w-full">
                {/* Welcome Text */}
                <div className="flex gap-1 items-center justify-center flex-wrap">
                  <div className="flex flex-col font-['Satoshi',sans-serif] font-bold justify-center leading-none relative shrink-0 text-[#8155d9] text-lg text-center whitespace-nowrap">
                    <p className="leading-normal">
                      <span>👋 </span>
                      <span className="text-[#2d323a]">Welcome to </span>
                    </p>
                  </div>
                  <div className="bg-white flex items-center justify-center px-2 py-0.5 relative rounded-[27px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0">
                    <div className="flex flex-col font-['Satoshi',sans-serif] font-bold justify-center leading-none relative shrink-0 text-[#16885f] text-lg text-center whitespace-nowrap">
                      <p className="leading-normal">AI powered </p>
                    </div>
                  </div>
                  <div className="flex flex-col font-['Satoshi',sans-serif] font-bold justify-center leading-none relative shrink-0 text-[#8155d9] text-lg text-center whitespace-nowrap">
                    <p className="leading-normal">
                      {" "}
                      <span className="text-[#2d323a]">website builder</span>
                    </p>
                  </div>
                </div>

                {/* Main Title and Subtitle */}
                <div className="flex flex-col gap-4 items-start w-full">
                  <div className="flex flex-col items-center w-full">
                    <div className="flex flex-col font-['Satoshi',sans-serif] font-bold justify-center leading-none relative shrink-0 text-[32px] text-[rgba(0,0,0,0.87)] text-center w-full">
                      <p className="leading-normal whitespace-pre-wrap">
                        Design your website the way you envision{" "}
                      </p>
                    </div>
                  </div>
                  <p className="font-['Satoshi',sans-serif] font-normal leading-5 relative shrink-0 text-sm text-[rgba(0,0,0,0.6)] text-center w-full whitespace-pre-wrap">
                    Shape your inspiration into ideal site.
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Input - Keep as is */}
            <div className="w-full max-w-[812px]">
              <HeroInput />
            </div>
          </div>
        </section>
      </div>
    </HeaderProvider>
  );
}
