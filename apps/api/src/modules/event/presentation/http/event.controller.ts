import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetEventQuery, ListEventsQuery } from '../../application/queries';
import { EventResponse } from './dto/event.response';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(
    private readonly listEvents: ListEventsQuery,
    private readonly getEvent: GetEventQuery,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all events with per-tier availability' })
  @ApiResponse({ status: HttpStatus.OK, type: [EventResponse] })
  findAll(): Promise<EventResponse[]> {
    return this.listEvents.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single event with per-tier availability' })
  @ApiResponse({ status: HttpStatus.OK, type: EventResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<EventResponse> {
    return this.getEvent.execute({ id });
  }
}
