import { HttpStatus } from '@nestjs/common';
import { NotFoundException } from '@shared/application';
import {
  DomainException,
  DomainRuleException,
  InvalidValueException,
} from '@shared/domain';
import { ExceptionMapping, mapException } from './exception-mapping';

export const sharedExceptionMappings: ExceptionMapping[] = [
  mapException({ exception: NotFoundException, status: HttpStatus.NOT_FOUND }),
  mapException({
    exception: InvalidValueException,
    status: HttpStatus.BAD_REQUEST,
    details: (e) => ({ field: e.field }),
  }),
  mapException({ exception: DomainRuleException, status: HttpStatus.CONFLICT }),
  mapException({ exception: DomainException, status: HttpStatus.BAD_REQUEST }),
];
