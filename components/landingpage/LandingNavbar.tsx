"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Menu, Home } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavLinkClass = (path: string) => {
    const isActive =
      path !== "/"
        ? pathname.slice(0, path.length) === path
        : pathname === path;
    return cn(
      "rounded-full px-5 py-2 transition-all duration-300 relative font-semibold text-sm h-9",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
    );
  };

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out py-3 md:py-4",
        "border-b backdrop-blur-xl",
        isScrolled
          ? "bg-white/85 border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          : "bg-white border-white/40 shadow-none",
      )}
    >
      <div className="container relative mx-auto px-4 md:px-8 lg:px-12 flex flex-row items-center justify-between w-full max-w-7xl">
        {/* LEFT: Burger (mobile) + Logo (desktop-only) */}
        <div className="flex items-center gap-2">
          {/* Burger — Mobile Only, slides dari kiri */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-64 flex flex-col gap-0"
                aria-describedby={undefined}
              >
                <SheetHeader className="h-16 flex flex-row items-center border-b shrink-0 p-0">
                  <SheetTitle className="flex-1 px-4">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-xl group cursor-pointer focus-visible:outline-none"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.refresh();
                      }}
                    >
                      <span className="transition-transform group-hover:rotate-12">
                        🎉
                      </span>
                      <span className="font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                        kumpul.in
                      </span>
                    </button>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 flex flex-col overflow-hidden p-3 gap-3">
                  <nav className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-10",
                        pathname === "/"
                          ? "bg-primary/10 text-primary font-bold hover:bg-primary/20"
                          : "text-muted font-medium",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/">
                        <Home className="h-5 w-5 shrink-0 mr-3" />
                        <span>Beranda</span>
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-10",
                        pathname === "/events"
                          ? "bg-primary/10 text-primary font-bold hover:bg-primary/20"
                          : "text-muted font-medium",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/events">
                        <span>Jelajah</span>
                      </Link>
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo — Desktop only (hidden on mobile) */}
          <button
            type="button"
            onClick={() => router.refresh()}
            className="hidden md:flex items-center gap-2 md:text-2xl group cursor-pointer focus-visible:outline-none"
          >
            <span className="transition-transform group-hover:rotate-12">
              🎉
            </span>
            <span className="font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
              kumpul.in
            </span>
          </button>
        </div>

        {/* CENTER: Desktop Nav */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={getNavLinkClass("/")}
          >
            <Link href="/">Beranda</Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className={getNavLinkClass("/events")}
          >
            <Link href="/events">Jelajah</Link>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full font-bold h-9 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm"
              asChild
            >
              <Link href="#">Masuk</Link>
            </Button>
            <Button
              variant="brand"
              size="sm"
              asChild
              className="hidden md:inline-flex rounded-full font-bold h-9 shadow-[0_4px_14px_0_rgb(0,44,238,0.39)] hover:shadow-[0_6px_20px_rgba(0,44,238,0.23)] hover:-translate-y-0.5 transition-all"
            >
              <Link href="#">Daftar</Link>
            </Button>
          </>
        </div>
      </div>
    </nav>
  );
}
