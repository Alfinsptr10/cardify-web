"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { photoboothLayouts } from "@/lib/photobooth/layouts";
export default function PhotoboothPage() {
  const router = useRouter();

  const [selectedLayout, setSelectedLayout] = useState(
    photoboothLayouts[0]
  );

  return (
    <div className="flex h-screen flex-col bg-[#EEF2FF]">

      {/* HEADER */}

      <header className="relative flex h-16 items-center justify-center border-b bg-white">

        <button
          onClick={() => router.push("/")}
          className="absolute left-6 flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-sm font-bold uppercase tracking-[0.35em] text-gray-800">
          SELECT LAYOUT
        </h1>

      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}

        <aside className="flex w-[330px] flex-col border-r bg-white">

          {/* Title */}

          <div className="p-6">

            <h2 className="text-lg font-bold">
              Browse Layouts
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose your photobooth layout.
            </p>

          </div>

          {/* Layout List */}

          <div className="flex-1 space-y-4 overflow-y-auto px-6">

            {photoboothLayouts.map((layout) => (

              <button
                key={layout.id}
                onClick={() => setSelectedLayout(layout)}
                className={`w-full rounded-2xl border p-4 transition

                ${
                  selectedLayout.id === layout.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }

                `}
              >

                <Image
  src={layout.preview}
  alt={layout.name}
  width={180}
  height={320}
  className="mx-auto h-40 w-auto object-contain"
/>

                <h3 className="mt-4 text-lg font-semibold">
                  {layout.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {layout.description}
                </p>

              </button>

            ))}

          </div>

          {/* Button */}

          <div className="border-t p-6">

            <button
              onClick={() =>
                router.push(
                  `/photobooth/frame?layout=${selectedLayout.id}`
                )
              }
              className="w-full rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
            >
              USE THIS LAYOUT →
            </button>

          </div>

        </aside>

        {/* PREVIEW */}

        <main className="flex flex-1 items-center justify-center bg-[#98aac4]">

          <Image
            src={selectedLayout.preview}
            alt={selectedLayout.name}
            width={360}
            height={720}
            priority
            className="max-h-[82vh] w-auto object-contain"
/>

        </main>

      </div>

    </div>
  );
}