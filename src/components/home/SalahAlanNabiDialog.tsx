"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

export default function SalahAlanNabiDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          overflow-hidden border-0 p-0
         
          rounded-2xl shadow-2xl
         
        "
      >
        <div
          className="h-1.5 w-full"
          style={{
            background:
              "linear-gradient(90deg, hsl(262.1 83.3% 57.8%), hsl(280 75% 65%), hsl(245 80% 60%))",
          }}
        />

        <DialogTitle >
        </DialogTitle>

        {/* ── Decorative soft glow orbs ─────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-primary/15 blur-3xl"
        />

        {/* ── Content ──────────────────────────────────── */}
        <div className="relative flex flex-col items-center gap-6 px-8 pb-8">
          {/* Main Arabic text */}
          <div className="flex flex-col items-center gap-3 text-center w-full">
            <h2 className=" almajeed-text text-[clamp(1.75rem,5vw,2.25rem)] font-bold text-neutral-900 dark:text-white leading-normal">
              صَلِّ عَلَى النَّبِيِّ ﷺ
            </h2>
            <p className="font-tajawal text-[clamp(0.9rem,2.5vw,1.1rem)] text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-[90%]">
              اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ
            </p>
          </div>

          {/* Close button */}
          <DialogClose asChild>
            <Button
              onClick={() => setOpen(false)}
              className="
                  mt-2 w-full rounded-xl py-4 text-base font-tajawal font-bold text-white
                  bg-gradient-to-r from-primary to-[#6b21a8]
                   hover:-translate-y-0.5
                  transition-all duration-200 active:scale-95 active:translate-y-0
                  cursor-pointer
                  "
              
            >
              آمين
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
