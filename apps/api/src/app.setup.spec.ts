import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, Min, ValidateNested } from 'class-validator';
import { configureApp } from './app.setup';

class Customer {
  @IsEmail()
  email: string;
}

class Body {
  @IsInt()
  @Min(1)
  quantity: number;

  @ValidateNested()
  @Type(() => Customer)
  customer: Customer;
}

// Grabs the pipe configureApp registers so it can be run directly.
const registeredPipe = (): ValidationPipe => {
  const app = { useGlobalPipes: jest.fn().mockReturnThis() };
  configureApp(app as never);
  return app.useGlobalPipes.mock.calls[0][0];
};

const metadata: ArgumentMetadata = { type: 'body', metatype: Body };

const validationError = async (value: unknown) => {
  try {
    await registeredPipe().transform(value, metadata);
  } catch (error) {
    return (error as BadRequestException).getResponse();
  }
  throw new Error('expected validation to fail');
};

describe('configureApp', () => {
  it('returns field-level errors next to the flat message list', async () => {
    const body = await validationError({
      quantity: 0,
      customer: { email: 'bad' },
    });

    expect(body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: ['quantity must not be less than 1', 'email must be an email'],
      errors: [
        { field: 'quantity', messages: ['quantity must not be less than 1'] },
        { field: 'customer.email', messages: ['email must be an email'] },
      ],
    });
  });

  it('rejects properties that are not in the DTO', async () => {
    const body = await validationError({
      quantity: 1,
      customer: { email: 'jane@example.com' },
      isAdmin: true,
    });

    expect(body).toMatchObject({
      errors: [
        { field: 'isAdmin', messages: ['property isAdmin should not exist'] },
      ],
    });
  });

  it('transforms a valid payload into the DTO class', async () => {
    const result = await registeredPipe().transform(
      { quantity: 2, customer: { email: 'jane@example.com' } },
      metadata,
    );

    expect(result).toBeInstanceOf(Body);
  });
});
