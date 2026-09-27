import { HttpStatus } from '@nestjs/common';
import { NotFoundException } from '@shared/application';
import {
  DomainException,
  DomainRuleException,
  InvalidValueException,
} from '@shared/domain';
import { ExceptionMappingRegistry } from './exception-mapping.registry';
import { sharedExceptionMappings } from './shared-exception-mappings';

describe('sharedExceptionMappings', () => {
  const registry = new ExceptionMappingRegistry();
  registry.register(sharedExceptionMappings);

  it.each([
    [new NotFoundException('Event', '1'), HttpStatus.NOT_FOUND],
    [new InvalidValueException('Email', 'is invalid'), HttpStatus.BAD_REQUEST],
    [new DomainRuleException('No'), HttpStatus.CONFLICT],
    [new DomainException('Oops'), HttpStatus.BAD_REQUEST],
  ])('maps %p to %p', (error, status) => {
    expect(registry.resolve(error)?.status).toBe(status);
  });

  it('adds the field to invalid value errors', () => {
    const error = new InvalidValueException('Email', 'is invalid');

    expect(registry.resolve(error)?.details?.(error)).toEqual({
      field: 'Email',
    });
  });
});
