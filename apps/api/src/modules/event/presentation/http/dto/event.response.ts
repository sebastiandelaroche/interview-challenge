import { ApiProperty } from '@nestjs/swagger';

export class TicketTierResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'VIP' })
  name: string;

  @ApiProperty({ example: 150.0 })
  price: number;

  @ApiProperty({ example: 100 })
  capacity: number;

  @ApiProperty({
    example: 42,
    description: 'capacity - confirmed_orders - active_holds',
  })
  available: number;
}

export class EventResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Summer Music Festival' })
  name: string;

  @ApiProperty({ type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ example: 'Central Park, NYC' })
  location: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [TicketTierResponse] })
  tiers: TicketTierResponse[];
}
