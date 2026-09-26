import { Global, Module } from '@nestjs/common';
import { Clock } from '@shared/application';
import { SystemClock } from './system-clock';

@Global()
@Module({
  providers: [{ provide: Clock, useClass: SystemClock }],
  exports: [Clock],
})
export class ClockModule {}
