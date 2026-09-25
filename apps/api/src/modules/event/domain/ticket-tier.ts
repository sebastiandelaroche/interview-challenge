import { Entity } from '@shared/domain';
import {
  TicketTierCapacity,
  TicketTierPrice,
  TicketTierId,
  TicketTierName,
} from './values';

type CreateTicketTier = {
  name: TicketTierName;
  capacity: TicketTierCapacity;
  price: TicketTierPrice;
};

type HydrateTicketTier = {
  id: TicketTierId;
  name: TicketTierName;
  capacity: TicketTierCapacity;
  price: TicketTierPrice;
  createdAt: Date;
  updatedAt: Date;
};

export class TicketTier extends Entity<TicketTierId> {
  private constructor(
    id: TicketTierId,
    public name: TicketTierName,
    public capacity: TicketTierCapacity,
    public price: TicketTierPrice,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super(id);
  }

  static create(input: CreateTicketTier): TicketTier {
    const now = new Date();
    return new TicketTier(
      TicketTierId.generate(),
      input.name,
      input.capacity,
      input.price,
      now,
      now,
    );
  }

  static hydrate(input: HydrateTicketTier): TicketTier {
    return new TicketTier(
      input.id,
      input.name,
      input.capacity,
      input.price,
      input.createdAt,
      input.updatedAt,
    );
  }
}
