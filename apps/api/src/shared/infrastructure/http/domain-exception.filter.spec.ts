import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { DomainRuleException } from '@shared/domain';
import { DomainExceptionFilter } from './domain-exception.filter';
import { ExceptionMappingRegistry } from './exception-mapping.registry';

class SoldOutException extends DomainRuleException {
  constructor() {
    super('Sold out');
    this.name = 'SoldOutException';
  }
}

// Captures what the filter writes to the Express response.
const catchWith = (filter: DomainExceptionFilter, exception: unknown) => {
  const response = { status: jest.fn(), json: jest.fn() };
  response.status.mockReturnValue(response);
  const host = {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost;

  filter.catch(exception, host);

  return {
    status: response.status.mock.calls[0][0],
    body: response.json.mock.calls[0][0],
  };
};

describe('DomainExceptionFilter', () => {
  const registry = new ExceptionMappingRegistry();
  registry.register([
    {
      exception: SoldOutException,
      status: HttpStatus.CONFLICT,
      details: () => ({ available: 0 }),
    },
  ]);
  const filter = new DomainExceptionFilter(registry);

  it('passes Nest HttpExceptions through with their own body', () => {
    const { status, body } = catchWith(
      filter,
      new BadRequestException({ message: ['bad'], errors: [] }),
    );

    expect(status).toBe(400);
    expect(body).toEqual({ statusCode: 400, message: ['bad'], errors: [] });
  });

  it('wraps an HttpException created with a plain string', () => {
    const { body } = catchWith(filter, new BadRequestException('bad'));

    expect(body).toMatchObject({ statusCode: 400, message: 'bad' });
  });

  it('maps a registered domain exception with its details', () => {
    const { status, body } = catchWith(filter, new SoldOutException());

    expect(status).toBe(409);
    expect(body).toEqual({
      statusCode: 409,
      error: 'SoldOutException',
      message: 'Sold out',
      available: 0,
    });
  });

  it('hides unknown errors behind a generic 500', () => {
    const log = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    const { status, body } = catchWith(filter, new Error('db password leak'));

    expect(status).toBe(500);
    expect(body).toEqual({
      statusCode: 500,
      error: 'InternalServerError',
      message: 'Internal server error',
    });
    expect(log).toHaveBeenCalled();
  });
});
