import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection, Db, Document, MongoClient } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private readonly client: MongoClient;
  private readonly db: Db;

  constructor(configService: ConfigService) {
    const url = configService.get<string>('database.mongo.url');
    if (!url) throw new Error('MONGO_URL is not configured');
    this.client = new MongoClient(url);
    // Database name comes from the connection string path.
    this.db = this.client.db();
  }

  collection<T extends Document>(name: string): Collection<T> {
    return this.db.collection<T>(name);
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
