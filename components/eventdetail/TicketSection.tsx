"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Minus,
    Plus,
    Link as LinkIcon,
    Globe,
    X,
    Phone,
    Clock,
    Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Event } from "@/types/event";
import { toast } from "sonner";

const TICKET_COLORS = [
    {
        bg: "bg-pink-100",
        border: "border-pink-200",
        ring: "ring-pink-400 border-pink-400",
        text: "text-pink-600",
    },
    {
        bg: "bg-blue-100",
        border: "border-blue-200",
        ring: "ring-blue-400 border-blue-400",
        text: "text-blue-600",
    },
    {
        bg: "bg-emerald-100",
        border: "border-emerald-200",
        ring: "ring-emerald-400 border-emerald-400",
        text: "text-emerald-600",
    },
    {
        bg: "bg-amber-100",
        border: "border-amber-200",
        ring: "ring-amber-400 border-amber-400",
        text: "text-amber-600",
    },
    {
        bg: "bg-violet-100",
        border: "border-violet-200",
        ring: "ring-violet-400 border-violet-400",
        text: "text-violet-600",
    },
];

function QuotaBar({
    booked,
    total,
    isSoldOut,
}: {
    booked: number;
    total: number;
    isSoldOut?: boolean;
}) {
    const percentage = Math.min((booked / total) * 100, 100);
    return (
        <div className="w-full flex flex-col gap-1 mt-3">
            <div className="w-full flex flex-row items-center gap-3">
                <div className="relative w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isSoldOut
                                ? "bg-slate-400"
                                : "bg-linear-to-r from-primary to-secondary",
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="text-[10px] text-muted whitespace-nowrap min-w-fit">
                    {Math.max(0, total - booked)} tersisa
                </span>
            </div>
        </div>
    );
}

function CountdownDisplay({
    diff,
    label,
    isFomo = false,
}: {
    diff: number;
    label: string;
    isFomo?: boolean;
}) {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (isFomo || diff < 1000 * 60 * 60 * 24) {
        return (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                    <Flame size={13} className="text-rose-500 animate-bounce" />
                    <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">
                        {label}
                    </span>
                </div>
                <span className="text-xl font-bold text-rose-600 font-mono tracking-wider animate-pulse">
                    {pad(hours)}:{pad(minutes)}:{pad(seconds)}
                </span>
                <span className="text-[10px] text-rose-500/70 font-medium">
                    jam : menit : detik
                </span>
            </div>
        );
    }

    return (
        <div className="p-3 bg-primary/5 border border-primary/15 rounded-xl flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-primary" />
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <div className="flex items-center gap-3">
                {days > 0 && (
                    <>
                        <div className="text-center">
                            <p className="text-xl font-bold text-primary font-mono leading-none">
                                {days}
                            </p>
                            <p className="text-[10px] text-primary/70 font-medium mt-0.5">
                                hari
                            </p>
                        </div>
                        <span className="text-primary/40 font-semibold text-base pb-3">
                            :
                        </span>
                    </>
                )}
                <div className="text-center">
                    <p className="text-xl font-bold text-primary font-mono leading-none">
                        {pad(hours)}
                    </p>
                    <p className="text-[10px] text-primary/70 font-medium mt-0.5">
                        jam
                    </p>
                </div>
                <span className="text-primary/40 font-semibold text-base pb-3">
                    :
                </span>
                <div className="text-center">
                    <p className="text-xl font-bold text-primary font-mono leading-none">
                        {pad(minutes)}
                    </p>
                    <p className="text-[10px] text-primary/70 font-medium mt-0.5">
                        menit
                    </p>
                </div>
            </div>
        </div>
    );
}

function TicketCountdownBadge({ diff, type }: { diff: number; type: "starts" | "ends" }) {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const isFomo = diff < 1000 * 60 * 60 * 24;
    const label = type === "starts" ? "Dimulai" : "Berakhir";

    if (isFomo) {
        return (
            <div className="mb-2 flex justify-center">
                <div className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1">
                    <Flame size={12} className="animate-bounce text-rose-500" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-500">
                        {label}
                    </span>
                    <span className="ml-0.5 animate-pulse font-mono text-[10px] font-bold text-rose-600">
                        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-2 flex justify-center">
            <div className="flex items-center gap-1.5 rounded-xl border border-primary/15 bg-primary/5 px-2.5 py-1">
                <Clock size={12} className="text-primary" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {label}
                </span>
                <div className="ml-0.5 flex items-center gap-0.5 font-mono text-[10px] font-bold text-primary">
                    {days > 0 && (
                        <>
                            <span>{days}h</span>
                            <span className="opacity-40">·</span>
                        </>
                    )}
                    <span>{pad(hours)}j</span>
                    <span className="opacity-40">:</span>
                    <span>{pad(minutes)}m</span>
                </div>
            </div>
        </div>
    );
}

export default function TicketSection({ event }: { event: Event }) {
    const isPaid = event.ticket_categories?.some((t) => t.price > 0) || false;
    const isFreeEventWithNoTickets =
        !isPaid && (event.ticket_categories?.length ?? 0) === 0;

    const effectiveTickets = isFreeEventWithNoTickets
        ? [
              {
                  id: "free-virtual",
                  name: "Tiket Gratis",
                  price: 0,
                  quota: event.max_capacity || 0,
                  booked: event.total_sold || 0,
                  description: "Tiket masuk untuk event ini.",
                  start_date_time: undefined as string | undefined,
                  end_date_time: undefined as string | undefined,
              },
          ]
        : (event.ticket_categories ?? []);

    const availableTicket = effectiveTickets.find(
        (t) => t.quota === 0 || t.booked < t.quota,
    );
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
        availableTicket?.id ?? null,
    );
    const [qty, setQty] = useState(1);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const now = currentTime?.getTime() ?? 0;
    const startReg = event.start_registration_date
        ? new Date(event.start_registration_date).getTime()
        : 0;
    const endReg = event.end_registration_date
        ? new Date(event.end_registration_date).getTime()
        : Infinity;

    const isRegistrationUpcoming = event.status === "published" && startReg > 0 && now > 0 && now < startReg;
    const isRegistrationClosed = event.status !== "published" || (now > 0 && now > endReg);
    const isRegistrationOpen =
        event.status === "published" && now > 0 && !isRegistrationUpcoming && !isRegistrationClosed;

    const selectedTicket = effectiveTickets.find(
        (t) => t.id === selectedTicketId,
    );

    const maxPurchase = (() => {
        if (!selectedTicket) return 0;
        const remaining =
            selectedTicket.quota > 0
                ? selectedTicket.quota - selectedTicket.booked
                : Infinity;
        const limitPerUser = event.max_ticket_per_user ?? 0;
        return limitPerUser > 0 ? Math.min(remaining, limitPerUser) : remaining;
    })();

    const totalPrice = selectedTicket ? selectedTicket.price * qty : 0;

    const formatRupiah = (num: number) => {
        if (num === 0) return "Gratis";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    const handleSelectTicket = (id: string, isSelectable: boolean) => {
        if (!isSelectable) return;
        setSelectedTicketId(id);
        setQty(1);
    };

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const text = `Yuk ikut event seru ini: ${event.title} - ${url}`;
        switch (platform) {
            case "facebook":
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                    "_blank",
                );
                break;
            case "x":
                window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                    "_blank",
                );
                break;
            case "instagram":
                window.open(
                    `https://www.instagram.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                    "_blank",
                );
                break;
            case "whatsapp":
                window.open(
                    `https://wa.me/?text=${encodeURIComponent(text)}`,
                    "_blank",
                );
                break;
            case "telegram":
                window.open(
                    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                    "_blank",
                );
                break;
            case "link":
                navigator.clipboard.writeText(url);
                toast.success("Link berhasil disalin!");
                break;
        }
    };

    return (
        <section className="w-full flex flex-col relative z-20">
           
            <div
                className="w-full bg-white shadow-md shadow-slate-900/5 border border-slate-200/80 rounded-2xl sticky top-24 flex flex-col overflow-hidden"
                style={{ maxHeight: "calc(100vh - 7rem)" }}
            >
                <div className="shrink-0 p-5 pb-2 flex flex-col gap-4 bg-white">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                            Registrasi
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-950 leading-tight">
                            Pilih Tiket
                        </h3>
                    </div>

                    {isRegistrationUpcoming && currentTime && (
                        <CountdownDisplay
                            diff={startReg - now}
                            label="Pendaftaran dibuka dalam"
                        />
                    )}
                    {!isRegistrationUpcoming &&
                        isRegistrationOpen &&
                        endReg !== Infinity &&
                        currentTime && (
                            <CountdownDisplay
                                diff={endReg - now}
                                label="Pendaftaran ditutup dalam"
                                isFomo={endReg - now < 1000 * 60 * 60 * 24}
                            />
                        )}
                    {isRegistrationClosed && currentTime && (
                        <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-center">
                            <span className="text-sm font-medium text-slate-600">
                                Pendaftaran Telah Ditutup
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-4 scrollbar-hide">
                    <div className="flex flex-col gap-4 mt-2">
                        {effectiveTickets.map((ticket, index) => {
                            const ticketStart = ticket.start_date_time
                                ? new Date(ticket.start_date_time).getTime()
                                : 0;
                            const ticketEnd = ticket.end_date_time
                                ? new Date(ticket.end_date_time).getTime()
                                : Infinity;

                            const isTicketUpcoming =
                                ticketStart > 0 && now > 0 && now < ticketStart;
                            const isTicketClosed = now > 0 && now > ticketEnd;
                            const isTicketOpen =
                                now > 0 && !isTicketUpcoming && !isTicketClosed;

                            const isActuallySoldOut =
                                ticket.quota > 0 &&
                                ticket.booked >= ticket.quota;
                            const isSelectable =
                                !isActuallySoldOut &&
                                isRegistrationOpen &&
                                isTicketOpen;
                            const isSelected = selectedTicketId === ticket.id;
                            const color =
                                TICKET_COLORS[index % TICKET_COLORS.length];
                            return (
                                <div
                                    key={ticket.id}
                                    onClick={() =>
                                        handleSelectTicket(
                                            ticket.id ?? "",
                                            isSelectable,
                                        )
                                    }
                                    className={cn(
                                        "group relative flex w-full rounded-xl transition-all duration-300 cursor-pointer overflow-hidden",
                                        "border shadow-sm",
                                        color.bg,
                                        !isSelectable &&
                                            "opacity-60 cursor-not-allowed grayscale",
                                        isSelected && isSelectable
                                            ? `ring-1 scale-[1.01] ${color.ring}`
                                            : `hover:shadow-md hover:-translate-y-0.5 ${color.border}`,
                                    )}
                                >
                                    <div className="w-12 sm:w-16 flex flex-col items-center justify-center shrink-0">
                                        <span
                                            className={cn(
                                                "-rotate-90 whitespace-nowrap font-semibold tracking-[0.22em] text-[10px] sm:text-xs uppercase opacity-80",
                                                color.text,
                                            )}
                                        >
                                            TICKET
                                        </span>
                                    </div>

                                    <div className="relative w-0 flex flex-col justify-center border-l-2 border-dashed border-white/60">
                                        <div
                                            className={cn(
                                                "absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border",
                                                color.border,
                                            )}
                                        />
                                        <div
                                            className={cn(
                                                "absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-5 h-5 bg-white rounded-full border",
                                                color.border,
                                            )}
                                        />
                                    </div>

                                    <div className="flex-1 p-3.5 flex flex-col justify-between">
                                        {isTicketUpcoming && currentTime && event.status === "published" && !isActuallySoldOut && (
                                            <TicketCountdownBadge diff={ticketStart - now} type="starts" />
                                        )}
                                        {isTicketOpen &&
                                            currentTime &&
                                            ticketEnd !== Infinity &&
                                            event.status === "published" &&
                                            !isActuallySoldOut && (
                                                <TicketCountdownBadge diff={ticketEnd - now} type="ends" />
                                            )}

                                        <div className="flex justify-between items-start mb-1">
                                            <h4
                                                className={cn(
                                                    "font-semibold text-sm leading-snug line-clamp-2",
                                                    isSelected
                                                        ? "text-primary"
                                                        : "text-slate-900",
                                                )}
                                            >
                                                {ticket.name}
                                            </h4>
                                            {isActuallySoldOut && (
                                                <span className="bg-danger text-white text-[10px] px-2 py-0.5 rounded-full font-semibold ml-2 shrink-0">
                                                    Habis
                                                </span>
                                            )}
                                        </div>

                                        <p className="font-bold text-base md:text-lg text-primary mb-1 leading-tight">
                                            {formatRupiah(ticket.price)}
                                        </p>

                                        {ticket.description && (
                                            <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                                                {ticket.description}
                                            </p>
                                        )}

                                        {ticket.quota > 0 ? (
                                            <QuotaBar
                                                booked={ticket.booked}
                                                total={ticket.quota}
                                                isSoldOut={isActuallySoldOut}
                                            />
                                        ) : (
                                            <div className="mt-3 flex items-center gap-2">
                                                <div className="h-1.5 w-full bg-white/60 rounded-full" />
                                                <span className="text-[10px] text-slate-500 whitespace-nowrap font-medium">
                                                    Tanpa Batas Kuota
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {effectiveTickets.length === 0 && (
                            <div className="p-4 text-center text-muted text-sm border border-dashed rounded-xl">
                                Belum ada tiket tersedia.
                            </div>
                        )}
                    </div>
                </div>

                <div className="shrink-0 p-5 pt-3 flex flex-col gap-3 border-t border-slate-100 bg-white">
                    {selectedTicket && (
                        <>
                            <div className="p-3 bg-primary-light rounded-xl flex items-center justify-between border border-primary/10">
                                <span className="font-semibold text-sm text-slate-900">
                                    Jumlah Tiket
                                </span>
                                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-xl border border-slate-200">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            setQty(Math.max(1, qty - 1))
                                        }
                                        className="h-7 w-7 rounded-full hover:bg-primary text-accent hover:text-white"
                                        disabled={qty <= 1}
                                    >
                                        <Minus size={16} />
                                    </Button>
                                    <span className="font-semibold w-4 text-center text-sm">
                                        {qty}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            if (qty < maxPurchase)
                                                setQty(qty + 1);
                                        }}
                                        className="h-7 w-7 rounded-full hover:bg-primary text-accent hover:text-white"
                                        disabled={qty >= maxPurchase}
                                    >
                                        <Plus size={16} />
                                    </Button>
                                </div>
                            </div>
                            {(event.max_ticket_per_user ?? 0) > 0 && (
                                <p className="text-xs text-muted text-right mt-1 px-1">
                                    Maksimal pembelian{" "}
                                    {event.max_ticket_per_user} tiket per user
                                </p>
                            )}
                        </>
                    )}
                    
                    <div className="flex justify-between items-end">
                        <span className="text-slate-500 text-sm font-semibold">
                            Total
                        </span>
                        <span className="font-bold text-xl md:text-2xl text-primary leading-none">
                            {selectedTicket ? formatRupiah(totalPrice) : "Rp 0"}
                        </span>
                    </div>

                        <Button
                            asChild
                            size="lg"
                            className="cursor-pointer w-full py-5 bg-linear-to-r from-primary to-secondary hover:opacity-90 rounded-xl font-semibold text-sm shadow-md shadow-primary/20"
                        >
                            <Link href="#">Masuk untuk Membeli Tiket</Link>
                        </Button>
                        
                    <Separator />

                    <div className="flex items-center justify-between text-slate-500">
                        <span className="text-sm font-medium">
                            Bagikan event ini
                        </span>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleShare("facebook")}
                                variant="outline"
                                size="icon"
                                className="w-8 h-8 rounded-full bg-muted/10 shadow-xs border-0 hover:bg-slate-200"
                            >
                                <Globe size={16} />
                            </Button>
                            <Button
                                onClick={() => handleShare("x")}
                                variant="outline"
                                size="icon"
                                className="w-8 h-8 rounded-full bg-muted/10 shadow-xs border-0 hover:bg-slate-200"
                            >
                                <X size={16} />
                            </Button>
                            <Button
                                onClick={() => handleShare("instagram")}
                                variant="outline"
                                size="icon"
                                className="w-8 h-8 rounded-full bg-muted/10 shadow-xs border-0 hover:bg-slate-200"
                            >
                                <Phone size={16} />
                            </Button>
                            <Button
                                onClick={() => handleShare("link")}
                                variant="outline"
                                size="icon"
                                className="w-8 h-8 rounded-full bg-muted/10 shadow-xs border-0 hover:bg-muted/20"
                            >
                                <LinkIcon size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
