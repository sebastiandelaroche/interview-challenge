import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PostgresService } from './postgres.service';

describe('PostgresService', () => {
  afterEach(() => jest.restoreAllMocks());

  it('connects on init, and on shutdown disconnects and closes its pool', async () => {
    const end = jest.spyOn(Pool.prototype, 'end').mockResolvedValue();
    const config = {
      get: () => 'postgresql://user:pass@localhost:5432/tickets',
    } as unknown as ConfigService;
    const service = new PostgresService(config);
    const connect = jest.spyOn(service, '$connect').mockResolvedValue();
    const disconnect = jest.spyOn(service, '$disconnect').mockResolvedValue();

    await service.onModuleInit();
    await service.onModuleDestroy();

    expect(connect).toHaveBeenCalled();
    expect(disconnect).toHaveBeenCalled();
    expect(end).toHaveBeenCalled();
  });
});
