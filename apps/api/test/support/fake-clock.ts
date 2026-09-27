import { Clock } from '@shared/application';

// Lets a test move time forward instead of waiting for holds to expire.
export class FakeClock extends Clock {
  private current = new Date();

  now(): Promise<Date> {
    return Promise.resolve(new Date(this.current));
  }

  set(date: Date): void {
    this.current = new Date(date);
  }

  advanceMinutes(minutes: number): void {
    this.current = new Date(this.current.getTime() + minutes * 60_000);
  }
}
