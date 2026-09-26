import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionMappingRegistry } from './exception-mapping.registry';

type ErrorBody = {
  statusCode: number;
  error: string;
  message: string | string[];
  [key: string]: unknown;
};

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  constructor(private readonly registry: ExceptionMappingRegistry) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const body = this.toBody(exception);
    response.status(body.statusCode).json(body);
  }

  private toBody(exception: unknown): ErrorBody {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      return typeof res === 'string'
        ? {
            statusCode: exception.getStatus(),
            error: exception.name,
            message: res,
          }
        : ({
            statusCode: exception.getStatus(),
            ...(res as object),
          } as ErrorBody);
    }

    const mapping =
      exception instanceof Error ? this.registry.resolve(exception) : undefined;
    if (mapping && exception instanceof Error)
      return {
        statusCode: mapping.status,
        error: exception.name,
        message: exception.message,
        ...mapping.details?.(exception),
      };

    this.logger.error(exception);
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'InternalServerError',
      message: 'Internal server error',
    };
  }
}
