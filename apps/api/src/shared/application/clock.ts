export abstract class Clock {
  abstract now(): Promise<Date>;
}
