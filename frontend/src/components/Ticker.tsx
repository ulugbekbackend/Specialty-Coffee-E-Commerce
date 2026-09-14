import { IconBean, IconFlame, IconTruck } from './icons';

const ITEMS = [
  { icon: <IconFlame className="w-3.5 h-3.5" />, text: 'Roasted every Tuesday at dawn' },
  { icon: <IconTruck className="w-3.5 h-3.5" />, text: 'Free shipping over $40' },
  { icon: <IconBean className="w-3.5 h-3.5" />, text: 'Six coffees on the bench this week' },
  { icon: <IconFlame className="w-3.5 h-3.5" />, text: '48 hours from roaster to door' },
  { icon: <IconBean className="w-3.5 h-3.5" />, text: 'Direct trade · 12 partner farms' },
  { icon: <IconTruck className="w-3.5 h-3.5" />, text: 'Sealed within the hour, always' },
];

function Row() {
  return (
    <div className="flex items-center shrink-0">
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="flex items-center gap-2.5 pr-10 font-mono text-[11px] uppercase tracking-[0.18em] text-espresso-900/90"
        >
          <span className="text-rust-500">{item.icon}</span>
          {item.text}
        </span>
      ))}
    </div>
  );
}

export function Ticker() {
  return (
    <div className="relative z-30 overflow-hidden bg-honey-400 py-2">
      <div className="flex w-max anim-marquee">
        <Row />
        <Row />
      </div>
    </div>
  );
}
