import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
  let cookieSession = require('cookie-session');
  if (cookieSession.default) {
    cookieSession = cookieSession.default;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
  let expressLayouts = require('express-ejs-layouts');
  if (expressLayouts.default) {
    expressLayouts = expressLayouts.default;
  }

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.use(
    cookieSession({
      name: 'session',
      keys: ['rahasia_dapur_dot_indonesia_kunci_panjang'],
      maxAge: 24 * 60 * 60 * 1000,
    }),
  );

  app.use(expressLayouts);
  app.set('layout', 'layouts/base');

  // 5. MIDDLEWARE USER
  app.use((req: any, res: Response, next: NextFunction) => {
    res.locals.user = req.session?.user || null;
    next();
  });

  app.use((req: any, res: Response, next: NextFunction) => {
    const flash = req.session?.flash;

    if (req.session) {
      req.session.flash = null;
    }

    res.locals.flash = flash;

    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setViewEngine('ejs');

  const port = 3000;
  await app.listen(port);
  logger.log(`Server running at http://localhost:${port}`);
}
void bootstrap();
