import { Global, Module } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { PostgresService } from './postgres.service';

@Global()
@Module({
  providers: [PostgresService, MongoService],
  exports: [PostgresService, MongoService],
})
export class DatabaseModule {}
