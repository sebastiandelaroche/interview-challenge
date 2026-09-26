import { Injectable } from '@nestjs/common';
import { Clock, Query } from '@shared/application';
import { EventReadModel, EventView } from '../../read-models';

@Injectable()
export class ListEventsQuery implements Query<void, EventView[]> {
  constructor(
    private readonly readModel: EventReadModel,
    private readonly clock: Clock,
  ) {}

  async execute(): Promise<EventView[]> {
    return this.readModel.findAll(await this.clock.now());
  }
}
