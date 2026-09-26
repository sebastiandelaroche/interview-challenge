import { Injectable } from '@nestjs/common';
import { ExceptionMapping } from './exception-mapping';

@Injectable()
export class ExceptionMappingRegistry {
  private readonly mappings = new Map<Function, ExceptionMapping>();

  register(mappings: ExceptionMapping[]): void {
    for (const mapping of mappings) {
      if (this.mappings.has(mapping.exception))
        throw new Error(
          `Exception mapping for ${mapping.exception.name} is already registered`,
        );
      this.mappings.set(mapping.exception, mapping);
    }
  }

  // Walks the prototype chain so the most specific mapping wins,
  // regardless of registration order.
  resolve(exception: Error): ExceptionMapping | undefined {
    let proto: object | null = Object.getPrototypeOf(exception);
    while (proto && proto !== Error.prototype) {
      const mapping = this.mappings.get(proto.constructor);
      if (mapping) return mapping;
      proto = Object.getPrototypeOf(proto);
    }
    return undefined;
  }
}
