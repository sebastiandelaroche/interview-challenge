import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { allConfigs } from '@shared/infrastructure/config';
import { ClockModule } from '@shared/infrastructure/clock';
import { DatabaseModule } from '@shared/infrastructure/database';
import { HttpExceptionsModule } from '@shared/infrastructure/http';
import { EventModule } from '@modules/event/event.module';
import { ReservationModule } from '@modules/reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...allConfigs],
    }),
    DatabaseModule,
    ClockModule,
    HttpExceptionsModule,
    EventModule,
    ReservationModule,
  ],
})
export class AppModule {}
