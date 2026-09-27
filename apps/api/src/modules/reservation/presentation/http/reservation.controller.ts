import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CancelReservationUseCase,
  ConfirmReservationUseCase,
  CreateReservationUseCase,
} from '../../application/use-cases';
import { GetReservationQuery } from '../../application/queries';
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
  constructor(
    private readonly createReservation: CreateReservationUseCase,
    private readonly confirmReservation: ConfirmReservationUseCase,
    private readonly cancelReservation: CancelReservationUseCase,
    private readonly getReservation: GetReservationQuery,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a reservation with its event and tier' })
  @ApiResponse({ status: HttpStatus.OK, type: ReservationResponse })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reservation not found',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ReservationResponse> {
    return this.getReservation.execute({ id });
  }

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
    return this.createReservation.execute(body);
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
    description: 'Reservation already confirmed or cancelled',
  })
  confirm(@Param('id', ParseUUIDPipe) id: string): Promise<OrderResponse> {
    return this.confirmReservation.execute({ reservationId: id });
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
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CancelReservationResponse> {
    await this.cancelReservation.execute({ reservationId: id });
    return { message: 'Reservation cancelled successfully' };
  }
}
