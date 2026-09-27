export type TicketTier = {
  id: string;
  name: string;
  price: number;
  capacity: number;
  available: number;
};

export type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  tiers: TicketTier[];
};
