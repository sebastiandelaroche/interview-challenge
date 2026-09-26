import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateReservationRequest {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  eventId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  ticketTierId: string;

  @ApiProperty({ minimum: 1, example: 2 })
  @IsInt()
  @Min(1)
  ticketsQuantity: number;

  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  customerFullName: string;

  @ApiProperty({ format: 'email', example: 'jane@example.com' })
  @IsEmail()
  customerEmail: string;
}
