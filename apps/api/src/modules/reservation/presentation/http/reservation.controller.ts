import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReservationRequest } from './dto/create-reservation.request';
import {
  CancelReservationResponse,
  InsufficientAvailabilityResponse,
  OrderResponse,
  ReservationResponse,
} from './dto/reservation.response';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {
  constructor() {}

  @Post()
  @ApiOperation({ summary: 'Create a temporary hold on tickets' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ReservationResponse })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation errors',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event or tier not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Not enough tickets available',
    type: InsufficientAvailabilityResponse,
  })
  create(@Body() body: CreateReservationRequest): Promise<ReservationResponse> {
    void body;
    throw new NotImplementedException();
  }

  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm a held reservation, creating an order' })
  @ApiResponse({ status: HttpStatus.OK, type: OrderResponse })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reservation not found',
  })
  @ApiResponse({
    status: HttpStatus.GONE,
    description: 'Reservation has expired',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Reservation already confirmed',
  })
  confirm(@Param('id', ParseUUIDPipe) id: string): Promise<OrderResponse> {
    void id;
    throw new NotImplementedException();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a held reservation' })
  @ApiResponse({ status: HttpStatus.OK, type: CancelReservationResponse })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reservation not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Reservation already confirmed or expired',
  })
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CancelReservationResponse> {
    void id;
    throw new NotImplementedException();
  }
}
