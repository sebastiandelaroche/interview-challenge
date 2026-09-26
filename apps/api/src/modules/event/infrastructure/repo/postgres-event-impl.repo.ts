import { Injectable } from '@nestjs/common';
import {
  Event,
  EventId,
  EventRepository,
  TicketTierId,
} from '@modules/event/domain';
import { PostgresService } from '@shared/infrastructure/database';
import { EventMapper } from './event.mapper';

const WITH_TIERS = { tiers: { orderBy: { createdAt: 'asc' } } } as const;

@Injectable()
export class PostgresEventImplRepo implements EventRepository {
  constructor(private readonly prisma: PostgresService) {}

  async findById(id: EventId): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: WITH_TIERS,
    });
    return event ? EventMapper.toDomain(event) : null;
  }

  async getByTicketTierId(ticketTierId: TicketTierId): Promise<Event> {
    const event = await this.prisma.event.findFirstOrThrow({
      where: { tiers: { some: { id: ticketTierId } } },
      include: WITH_TIERS,
    });
    return EventMapper.toDomain(event);
  }
}
