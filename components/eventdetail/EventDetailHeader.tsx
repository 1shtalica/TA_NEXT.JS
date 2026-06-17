"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function HeaderSection() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out py-3.5",
        "bg-[#f9fafb]/85 backdrop-blur-xl border-b border-slate-200/70",
        isScrolled ? "shadow-md shadow-slate-900/5" : "shadow-xs",
      )}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12 w-full max-w-7xl flex flex-row items-center justify-between">

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.refresh()}
            className="flex items-center gap-2 text-xl group cursor-pointer focus-visible:outline-none"
          >
            <span className="text-2xl transition-transform group-hover:rotate-12">
              🎉
            </span>
            <span className="font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
              kumpul.in
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="rounded-xl font-bold h-9 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm" asChild>
                <Link href="/#">Masuk</Link>
              </Button>
              <Button
                variant="brand"
                size="sm"
                asChild
                className="hidden md:inline-flex rounded-xl font-bold h-9 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all"
              >
                <Link href="/#">Daftar</Link>
              </Button>
        </div>
      </div>
    </nav>
  );
}
