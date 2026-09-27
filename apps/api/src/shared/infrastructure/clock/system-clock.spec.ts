import { SystemClock } from './system-clock';

describe('SystemClock', () => {
  it('returns the current time', async () => {
    const before = Date.now();

    const now = await new SystemClock().now();

    expect(now.getTime()).toBeGreaterThanOrEqual(before);
    expect(now.getTime()).toBeLessThanOrEqual(Date.now());
  });
});
