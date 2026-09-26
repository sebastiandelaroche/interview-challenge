import { HttpStatus } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExceptionClass<E extends Error> = abstract new (...args: any[]) => E;

export type ExceptionMapping<E extends Error = Error> = {
  exception: ExceptionClass<E>;
  status: HttpStatus;
  details?: (exception: E) => Record<string, unknown>;
};

// Preserves the link between `exception` and `details` for type inference.
export const mapException = <E extends Error>(
  mapping: ExceptionMapping<E>,
): ExceptionMapping => mapping as unknown as ExceptionMapping;
