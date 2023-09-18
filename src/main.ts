import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/exceptions/base.exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { AppModule } from './app.module';
import { ClsMiddleware } from 'nestjs-cls';

/** 默认配置 3000 端口 */
const API_DEFAULT_PORT = 3000;

/** 默认配置请求前缀 */
const API_DEFAULT_PREFIX = '/api';

async function bootstrap() {
  // 使用 Fastify 提升性能
  const adapter: FastifyAdapter = new FastifyAdapter({ logger: true });

  // 安全防护
  adapter.register(helmet);
  // 压缩响应
  adapter.register(compress);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  // 设置请求前缀
  app.setGlobalPrefix(process.env.API_PREFIX || API_DEFAULT_PREFIX);

  // 开启版本管理
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // 设置全局返回
  app.useGlobalInterceptors(new TransformInterceptor());

  // 在 bootstrap 中挂载，因为中间件可能安装得太晚
  app.use(new ClsMiddleware({ useEnterWith: false }).use);

  // 抛出错误
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  await app.listen(process.env.API_PORT || API_DEFAULT_PORT);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
