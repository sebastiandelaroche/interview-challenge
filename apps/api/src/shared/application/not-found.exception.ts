export class NotFoundException extends Error {
  constructor(
    public readonly resource: string,
    public readonly id: string,
  ) {
    super(`${resource} with id ${id} was not found`);
    this.name = 'NotFoundException';
  }
}
