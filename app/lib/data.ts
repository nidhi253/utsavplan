import type { EventPlan, FunctionSlot } from "./types";

export type Vendor = {
  id: number;
  name: string;
  cat: string;
  city: string;
  price: number;
  rating: number;
  ev: string[];
  av: boolean;
  about: string;
};

export const VENDORS: Vendor[] = [
  { id: 1, name: "Priya Mehendi Art", cat: "Mehendi", city: "Hyderabad", price: 3000, rating: 4.8, ev: ["Wedding", "Haldi", "Mehendi", "Engagement"], av: true, about: "Bridal and function mehendi, 8 years, Arabic and Rajasthani styles." },
  { id: 2, name: "Ravi Candid Studio", cat: "Photographer", city: "Hyderabad", price: 15000, rating: 4.7, ev: ["Wedding", "Engagement", "Birthday", "Haldi"], av: true, about: "Candid and traditional photography, drone available." },
  { id: 3, name: "Floral Dreams Decor", cat: "Decorator", city: "Hyderabad", price: 20000, rating: 4.6, ev: ["Wedding", "Haldi", "Housewarming", "Engagement"], av: false, about: "Marigold and fresh flower setups for haldi and mandap." },
  { id: 4, name: "Amma's Kitchen", cat: "Caterer", city: "Hyderabad", price: 350, rating: 4.9, ev: ["Wedding", "Naming ceremony", "Housewarming", "Birthday"], av: true, about: "Home-style catering, per plate. South Indian and Hyderabadi menus." },
  { id: 5, name: "DJ Kartik", cat: "DJ / Music", city: "Hyderabad", price: 12000, rating: 4.4, ev: ["Wedding", "Birthday", "Engagement"], av: true, about: "Sangeet and reception sets with lights." },
  { id: 6, name: "Glow by Sana", cat: "Makeup", city: "Hyderabad", price: 8000, rating: 4.7, ev: ["Wedding", "Engagement", "Mehendi"], av: true, about: "Bridal and party makeup, HD and airbrush." },
  { id: 7, name: "Henna by Meera", cat: "Mehendi", city: "Bengaluru", price: 2500, rating: 4.5, ev: ["Wedding", "Birthday", "Mehendi"], av: true, about: "Quick, detailed designs for guests and brides." },
  { id: 8, name: "Frame Story", cat: "Photographer", city: "Bengaluru", price: 9000, rating: 4.3, ev: ["Birthday", "Naming ceremony", "Housewarming"], av: false, about: "Small functions and family portraits." },
  { id: 9, name: "Petal & Co", cat: "Decorator", city: "Chennai", price: 6000, rating: 4.2, ev: ["Birthday", "Naming ceremony", "Haldi"], av: true, about: "Budget-friendly decor for small functions." },
  { id: 10, name: "Spice Route Catering", cat: "Caterer", city: "Chennai", price: 500, rating: 4.6, ev: ["Wedding", "Engagement", "Housewarming"], av: true, about: "Multi-cuisine buffet catering." },
  { id: 11, name: "Rhythm Beats", cat: "DJ / Music", city: "Bengaluru", price: 18000, rating: 4.8, ev: ["Wedding", "Engagement"], av: true, about: "Live band and DJ combo." },
  { id: 12, name: "Bloom Makeup Studio", cat: "Makeup", city: "Chennai", price: 4500, rating: 4.1, ev: ["Haldi", "Mehendi", "Birthday"], av: true, about: "Party and function makeup." },
];

export const CATEGORIES = ["Mehendi", "Photographer", "Decorator", "Caterer", "DJ / Music", "Makeup"];
export const CITIES = ["Hyderabad", "Bengaluru", "Chennai"];
export const EVENT_TYPES = ["Haldi", "Mehendi", "Wedding", "Engagement", "Birthday", "Naming ceremony", "Housewarming"];

export const WORK: Record<string, string[]> = {
  Mehendi: ["Bridal hands", "Arabic design", "Guest mehendi", "Feet design", "Portrait mehendi", "Minimal design"],
  Photographer: ["Candid moments", "Portraits", "Ceremony", "Couple shoot", "Drone shot", "Family group"],
  Decorator: ["Stage decor", "Floral entrance", "Table setup", "Mandap", "Haldi backdrop", "Lighting"],
  Caterer: ["Buffet spread", "Live counter", "Desserts", "Plated meal", "Snacks", "Beverages"],
  "DJ / Music": ["Live set", "Dance floor", "Stage lighting", "Sangeet night", "Console setup", "Crowd"],
  Makeup: ["Bridal look", "Party look", "HD makeup", "Hair styling", "Saree draping", "Engagement look"],
};

export const SERVICES: Record<string, [string, number][]> = {
  Mehendi: [["Bridal mehendi (both hands + feet)", 2.5], ["Guest mehendi (per hour)", 1], ["Simple design, one hand", 0.4]],
  Photographer: [["Half-day coverage", 1], ["Full-day coverage", 1.8], ["Drone add-on", 0.4]],
  Decorator: [["Stage + entrance", 1], ["Full venue decor", 2.2], ["Per-table centrepieces", 0.3]],
  Caterer: [["Veg menu (per plate)", 1], ["Non-veg menu (per plate)", 1.4], ["Live counter add-on", 0.5]],
  "DJ / Music": [["4-hour set", 1], ["Full evening", 1.6], ["Lights + sound upgrade", 0.5]],
  Makeup: [["Bridal makeup", 1], ["Party makeup", 0.5], ["Hair styling add-on", 0.3]],
};

export const PRICE_RANGES: Record<string, [number, number]> = {
  "Under ₹5,000": [0, 5000],
  "₹5,000 – ₹15,000": [5000, 15000],
  "Above ₹15,000": [15000, 1e9],
};

const FOLDER: Record<string, string> = {
  Mehendi: "mehendi", Photographer: "photographer", Decorator: "decorator",
  Caterer: "caterer", "DJ / Music": "dj", Makeup: "makeup",
};
export const imgUrl = (v: Vendor, i: number) => `/images/${FOLDER[v.cat]}/${((i + v.id) % 6) + 1}.jpg`;
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const vendorById = (id: number) => VENDORS.find((v) => v.id === id)!;

// Rule-based recommended list per event type (no AI in the MVP).
type Template = { needs: string[]; tasks: [string, string][]; buy: [string, string][] };
const T: Record<string, Template> = {
  Haldi: {
    needs: ["Mehendi", "Photographer", "Decorator", "Caterer"],
    tasks: [["Finalize guest list", "2 weeks before"], ["Send invites", "2 weeks before"], ["Confirm yellow dress code", "1 week before"], ["Arrange seating", "2 days before"]],
    buy: [["Turmeric", "2 kg"], ["Marigold flowers", "10 kg"], ["Yellow outfits", "6"], ["Puja items", "1 set"]],
  },
  Mehendi: {
    needs: ["Mehendi", "Makeup", "DJ / Music", "Caterer"],
    tasks: [["Finalize guest list", "2 weeks before"], ["Plan mehendi seating", "1 week before"], ["Arrange snacks and drinks", "3 days before"]],
    buy: [["Mehendi cones for guests", "30"], ["Bangles", "40 sets"], ["Cushions and seating", "20"]],
  },
  Wedding: {
    needs: ["Photographer", "Decorator", "Caterer", "Makeup", "DJ / Music", "Mehendi"],
    tasks: [["Book venue", "6 months before"], ["Finalize guest list", "3 months before"], ["Send invites", "6 weeks before"], ["Confirm menu tasting", "1 month before"], ["Plan rituals timeline", "2 weeks before"]],
    buy: [["Wedding outfits", "2 sets"], ["Jewellery", "1 set"], ["Return gifts", "100"], ["Puja samagri", "1 set"]],
  },
  Engagement: {
    needs: ["Photographer", "Decorator", "Makeup", "Caterer"],
    tasks: [["Finalize guest list", "3 weeks before"], ["Book venue", "1 month before"], ["Plan ring exchange timeline", "1 week before"]],
    buy: [["Rings", "2"], ["Outfits", "2 sets"], ["Sweets boxes", "50"]],
  },
  Birthday: {
    needs: ["Decorator", "Caterer", "Photographer", "DJ / Music"],
    tasks: [["Pick theme", "3 weeks before"], ["Send invites", "2 weeks before"], ["Order cake", "1 week before"]],
    buy: [["Cake", "1"], ["Balloons", "50"], ["Return gifts", "30"]],
  },
  "Naming ceremony": {
    needs: ["Caterer", "Decorator", "Photographer"],
    tasks: [["Confirm muhurat with priest", "2 weeks before"], ["Finalize guest list", "2 weeks before"], ["Arrange cradle", "1 week before"]],
    buy: [["Cradle decor", "1"], ["Puja items", "1 set"], ["Return gifts", "40"]],
  },
  Housewarming: {
    needs: ["Caterer", "Decorator"],
    tasks: [["Confirm muhurat with priest", "2 weeks before"], ["Send invites", "10 days before"], ["Clean and arrange the house", "2 days before"]],
    buy: [["Milk for boiling", "1 L"], ["Mango leaves and flowers", "1 set"], ["Puja items", "1 set"], ["Return gifts", "30"]],
  },
};

// Older events may have no `functions`; derive them from `types`.
export const fnsOf = (e: EventPlan): FunctionSlot[] =>
  e.functions?.length ? e.functions : e.types.map((type) => ({ type, date: e.date, guests: e.guests }));

export const fmtDate = (d: string) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "date TBD";

// Any event name is allowed. Known ones get a tailored list; the rest get this generic one.
const GENERIC: Template = {
  needs: ["Caterer", "Decorator", "Photographer"],
  tasks: [["Fix the date and venue", "4 weeks before"], ["Finalize guest list", "3 weeks before"], ["Send invites", "2 weeks before"], ["Confirm vendors", "1 week before"]],
  buy: [["Decorations", "1 set"], ["Return gifts", "as needed"]],
};

// "haldi " -> "Haldi" for known events; custom names are tidied ("baby shower" -> "Baby Shower").
export function canonicalEvent(name: string) {
  const n = name.trim().replace(/\s+/g, " ").slice(0, 40);
  const known = Object.keys(T).find((k) => k.toLowerCase() === n.toLowerCase());
  // Custom names: capitalise each word's first letter only, so "bride's day" doesn't become "Bride'S Day".
  return known ?? n.replace(/(^|\s)(\S)/g, (_, sp, c) => sp + c.toUpperCase());
}

export function buildTemplate(types: string[]) {
  const needs = new Set<string>();
  const tasks: { id: string; t: string; w: string; d: boolean; fn: string }[] = [];
  const buy: { id: string; t: string; q: string; b: boolean; fn: string }[] = [];
  for (const type of types) {
    const tpl = T[type] ?? GENERIC;
    tpl.needs.forEach((n) => needs.add(n));
    tpl.tasks.forEach(([t, w], i) => tasks.push({ id: `${type}-t${i}`, t, w, d: false, fn: type }));
    tpl.buy.forEach(([t, q], i) => buy.push({ id: `${type}-b${i}`, t, q, b: false, fn: type }));
  }
  return { needs: [...needs], tasks, buy };
}
