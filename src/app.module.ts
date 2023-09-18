import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ClsGuard, ClsModule } from 'nestjs-cls';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      guard: { generateId: true, mount: true },
    }),
    // 设置全局，同一个 API IP 限制 10, 30 次请求的限制
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 30,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule { }
