import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { allConfigs } from '@shared/infrastructure/config';
import { DatabaseModule } from '@shared/infrastructure/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...allConfigs],
    }),
    DatabaseModule,
  ],
})
export class AppModule {}
