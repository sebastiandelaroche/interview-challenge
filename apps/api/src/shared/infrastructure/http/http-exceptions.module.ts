import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DomainExceptionFilter } from './domain-exception.filter';
import { ExceptionMappingRegistry } from './exception-mapping.registry';
import { sharedExceptionMappings } from './shared-exception-mappings';

@Global()
@Module({
  providers: [
    {
      provide: ExceptionMappingRegistry,
      useFactory: () => {
        const registry = new ExceptionMappingRegistry();
        registry.register(sharedExceptionMappings);
        return registry;
      },
    },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
  exports: [ExceptionMappingRegistry],
})
export class HttpExceptionsModule {}
