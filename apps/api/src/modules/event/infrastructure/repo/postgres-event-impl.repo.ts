import { Injectable } from '@nestjs/common';
import { Event, EventId, EventRepository } from '@modules/event/domain';
import { PrismaService } from '@shared/infrastructure/database';
import { EventMapper } from './event.mapper';

@Injectable()
export class PostgresEventImplRepo implements EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      include: { tiers: { orderBy: { createdAt: 'asc' } } },
      orderBy: { date: 'asc' },
    });
    return events.map(EventMapper.toDomain);
  }

  async findById(id: EventId): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { tiers: { orderBy: { createdAt: 'asc' } } },
    });
    return event ? EventMapper.toDomain(event) : null;
  }
}
