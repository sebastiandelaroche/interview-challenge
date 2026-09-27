import { appConfig } from './app.config';

describe('appConfig', () => {
  const original = process.env.PORT;
  afterEach(() => {
    process.env.PORT = original;
  });

  it('reads PORT from the environment', () => {
    process.env.PORT = '4000';

    expect(appConfig()).toEqual({ port: 4000 });
  });

  it('defaults to 3001', () => {
    delete process.env.PORT;

    expect(appConfig()).toEqual({ port: 3001 });
  });
});
