import { Injectable } from '@nestjs/common';
import { Clock, NotFoundException, Query } from '@shared/application';
import { EventReadModel, EventView } from '../../read-models';

export type GetEventInput = { id: string };

@Injectable()
export class GetEventQuery implements Query<GetEventInput, EventView> {
  constructor(
    private readonly readModel: EventReadModel,
    private readonly clock: Clock,
  ) {}

  async execute(input: GetEventInput): Promise<EventView> {
    const event = await this.readModel.findById(
      input.id,
      await this.clock.now(),
    );
    if (!event) throw new NotFoundException('Event', input.id);
    return event;
  }
}
