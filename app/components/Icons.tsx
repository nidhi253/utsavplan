const P = { className: "i", viewBox: "0 0 24 24" } as const;
export const IconHome = () => <svg {...P}><path d="M3 11l9-8 9 8M5 10v10h14V10" /></svg>;
export const IconPlan = () => <svg {...P}><path d="M5 4h14v16H5zM9 9h6M9 13h6M9 17h3" /></svg>;
export const IconSearch = () => <svg {...P}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>;
export const IconEvent = () => <svg {...P}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>;
const HEART = "M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z";
export const IconHeart = ({ filled }: { filled?: boolean }) => (
  <svg className={filled ? "i fill" : "i"} viewBox="0 0 24 24"><path d={HEART} /></svg>
);
