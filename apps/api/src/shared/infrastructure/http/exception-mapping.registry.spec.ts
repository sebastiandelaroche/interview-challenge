import { HttpStatus } from '@nestjs/common';
import { ExceptionMappingRegistry } from './exception-mapping.registry';

class BaseError extends Error {}
class SpecificError extends BaseError {}
class UnrelatedError extends Error {}

describe('ExceptionMappingRegistry', () => {
  it('resolves the mapping registered for an exception class', () => {
    const registry = new ExceptionMappingRegistry();
    registry.register([{ exception: BaseError, status: HttpStatus.CONFLICT }]);

    expect(registry.resolve(new BaseError())?.status).toBe(HttpStatus.CONFLICT);
  });

  it('falls back to the closest registered parent class', () => {
    const registry = new ExceptionMappingRegistry();
    registry.register([{ exception: BaseError, status: HttpStatus.CONFLICT }]);

    expect(registry.resolve(new SpecificError())?.status).toBe(
      HttpStatus.CONFLICT,
    );
  });

  it('prefers the most specific mapping, whatever the registration order', () => {
    const registry = new ExceptionMappingRegistry();
    registry.register([{ exception: BaseError, status: HttpStatus.CONFLICT }]);
    registry.register([{ exception: SpecificError, status: HttpStatus.GONE }]);

    expect(registry.resolve(new SpecificError())?.status).toBe(HttpStatus.GONE);
  });

  it('returns undefined for an unmapped exception', () => {
    const registry = new ExceptionMappingRegistry();

    expect(registry.resolve(new UnrelatedError())).toBeUndefined();
  });

  it('refuses to register the same exception twice', () => {
    const registry = new ExceptionMappingRegistry();
    registry.register([{ exception: BaseError, status: HttpStatus.CONFLICT }]);

    expect(() =>
      registry.register([{ exception: BaseError, status: HttpStatus.GONE }]),
    ).toThrow('already registered');
  });
});
