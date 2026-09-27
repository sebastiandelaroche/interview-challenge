import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { MongoService } from './mongo.service';

const config = (url?: string) =>
  ({ get: () => url }) as unknown as ConfigService;

describe('MongoService', () => {
  afterEach(() => jest.restoreAllMocks());

  it('uses the database named in the connection string', () => {
    const service = new MongoService(config('mongodb://localhost/tickets'));

    expect(service.collection('orders').dbName).toBe('tickets');
  });

  it('fails fast when MONGO_URL is missing', () => {
    expect(() => new MongoService(config(undefined))).toThrow(
      'MONGO_URL is not configured',
    );
  });

  it('connects on init and closes on shutdown', async () => {
    const connect = jest
      .spyOn(MongoClient.prototype, 'connect')
      .mockResolvedValue({} as MongoClient);
    const close = jest
      .spyOn(MongoClient.prototype, 'close')
      .mockResolvedValue();
    const service = new MongoService(config('mongodb://localhost/tickets'));

    await service.onModuleInit();
    await service.onModuleDestroy();

    expect(connect).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });
});
