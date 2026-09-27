import { ApiProperty } from '@nestjs/swagger';
import { RESERVATION_STATUSES } from '@modules/reservation/domain/values';

export class ReservationTierResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'VIP' })
  name: string;

  @ApiProperty({ example: 150.0 })
  unitPrice: number;
}

export class ReservationEventResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Summer Music Festival' })
  name: string;
}

export class CustomerResponse {
  @ApiProperty({ example: 'Jane Doe' })
  fullName: string;

  @ApiProperty({ format: 'email', example: 'jane@example.com' })
  email: string;
}

export class ReservationResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 2 })
  ticketsQuantity: number;

  @ApiProperty({ example: 300.0 })
  totalPrice: number;

  @ApiProperty({ enum: RESERVATION_STATUSES, example: 'on-hold' })
  status: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  expiresAt: Date;

  @ApiProperty({ type: ReservationEventResponse })
  event: ReservationEventResponse;

  @ApiProperty({ type: ReservationTierResponse })
  tier: ReservationTierResponse;

  @ApiProperty({ type: CustomerResponse })
  customer: CustomerResponse;
}

export class OrderResponse {
  @ApiProperty({ example: '6ab81393768c89951728efc4' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  reservationId: string;

  @ApiProperty({ type: ReservationEventResponse })
  event: ReservationEventResponse;

  @ApiProperty({ type: ReservationTierResponse })
  tier: ReservationTierResponse;

  @ApiProperty({ example: 2 })
  ticketsQuantity: number;

  @ApiProperty({ example: 300.0 })
  totalPrice: number;

  @ApiProperty({ type: CustomerResponse })
  customer: CustomerResponse;

  @ApiProperty({ enum: RESERVATION_STATUSES, example: 'confirmed' })
  status: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}

export class CancelReservationResponse {
  @ApiProperty({ example: 'Reservation cancelled successfully' })
  message: string;
}

export class InsufficientAvailabilityResponse {
  @ApiProperty({ example: 1 })
  available: number;

  @ApiProperty({ example: 2 })
  requested: number;
}
