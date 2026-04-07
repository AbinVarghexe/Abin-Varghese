import { PinterestPin } from "@/lib/pinterest-content";
import PinCard from "@/components/pinterest/PinCard";

interface RelatedPinRailProps {
  title: string;
  pins: PinterestPin[];
}

export default function RelatedPinRail({ title, pins }: RelatedPinRailProps) {
  if (!pins.length) {
    return null;
  }

  return (
    <aside className="rounded-3xl border border-black/10 bg-white/80 p-4 shadow-[0_20px_50px_-45px_rgba(0,0,0,0.7)] backdrop-blur-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</h2>
      <div>
        {pins.map((pin) => (
          <PinCard
            key={pin.id}
            pin={pin}
            href={`/pinterest/${pin.id}`}
            compact
            fixedHeight={200}
          />
        ))}
      </div>
    </aside>
  );
}
