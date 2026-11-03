import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { loadConfig } from './config.js';

const config = loadConfig();

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', limit: config.throttleLimit, ttl: config.throttleTtlMs }],
    }),
  ],
  providers: [
    Reflector,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
