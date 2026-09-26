import { Injectable } from '@nestjs/common';
import { Clock } from '@shared/application';

// Async so it can be swapped for a DB-backed clock without touching callers.
@Injectable()
export class SystemClock implements Clock {
  now(): Promise<Date> {
    return Promise.resolve(new Date());
  }
}
