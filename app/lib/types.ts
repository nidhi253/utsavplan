export type Task = { id: string; t: string; w: string; d: boolean; fn?: string };
export type BuyItem = { id: string; t: string; q: string; b: boolean; fn?: string };
export type FunctionSlot = { type: string; date: string; guests: number };
export type Payment = { id: string; label: string; amount: number; paid: boolean };
export type EventPlan = {
  id: string;
  types: string[];
  functions?: FunctionSlot[]; // one per function, each with its own date and guests
  date: string;
  city: string;
  guests: number;
  budget: number;
  needs: string[];
  tasks: Task[];
  buy: BuyItem[];
  payments: Payment[];
  created: number;
};
export type BookingStatus = "Requested" | "Confirmed" | "Declined" | "Completed";
export type Booking = {
  id: string;
  eventId: string;
  vendorId: number;
  fn?: string; // which function of the event this booking is for
  status: BookingStatus;
  note: string;
  date: string;
  created: number;
};
