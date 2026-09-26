import {
  Controller,
  Get,
  HttpStatus,
  NotImplementedException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventResponse } from './dto/event.response';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor() {}

  @Get()
  @ApiOperation({ summary: 'List all events with per-tier availability' })
  @ApiResponse({ status: HttpStatus.OK, type: [EventResponse] })
  findAll(): Promise<EventResponse[]> {
    throw new NotImplementedException();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single event with per-tier availability' })
  @ApiResponse({ status: HttpStatus.OK, type: EventResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<EventResponse> {
    void id;
    throw new NotImplementedException();
  }
}
