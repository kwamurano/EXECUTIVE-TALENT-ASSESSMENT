import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from 'dotenv'
import { ValidationPipe } from '@nestjs/common'

config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true, 
  }))
  app.enableCors()
  const PORT = process.env.PORT
  await app.listen(PORT || 6000, () => {
    console.log(
      `Server is running on port ${PORT}\nDatabase connected successfully`
    )
  })
}

bootstrap()