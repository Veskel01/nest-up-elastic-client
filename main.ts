import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ElasticClientModule } from './src';
import { TestModule } from './test';

@Module({
  imports: [
    ElasticClientModule.forRoot({
      node: ['http://localhost:9200'],
      auth: {
        username: 'elastic',
        password: 'elastic'
      }
    }),
    TestModule
  ]
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}

bootstrap();
