import { HttpStatus } from '@nestjs/common';
import { mapException } from './exception-mapping';

class TooManyException extends Error {
  constructor(readonly limit: number) {
    super('too many');
  }
}

describe('mapException', () => {
  it('returns the mapping unchanged, including its details function', () => {
    const mapping = mapException({
      exception: TooManyException,
      status: HttpStatus.CONFLICT,
      details: (e) => ({ limit: e.limit }),
    });

    expect(mapping.exception).toBe(TooManyException);
    expect(mapping.status).toBe(HttpStatus.CONFLICT);
    expect(mapping.details?.(new TooManyException(3))).toEqual({ limit: 3 });
  });
});
