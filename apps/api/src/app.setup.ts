import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

type FieldError = { field: string; messages: string[] };

// Flattens nested DTO errors into dotted paths, e.g. "customer.email".
const toFieldErrors = (errors: ValidationError[], parent = ''): FieldError[] =>
  errors.flatMap((error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    const own = error.constraints
      ? [{ field, messages: Object.values(error.constraints) }]
      : [];
    return [...own, ...toFieldErrors(error.children ?? [], field)];
  });

// Global pipeline shared by main.ts and the e2e tests, so both run the same app.
export const configureApp = (app: INestApplication): INestApplication =>
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors) => {
        const errors = toFieldErrors(validationErrors);
        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: errors.flatMap((e) => e.messages),
          errors,
        });
      },
    }),
  );
