export type TicketTierView = {
  id: string;
  name: string;
  price: number;
  capacity: number;
  available: number;
};

export type EventView = {
  id: string;
  name: string;
  date: Date;
  location: string;
  description: string;
  tiers: TicketTierView[];
};
