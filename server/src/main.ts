import { ConfigService } from './shared/services/config.service';  // the following 2 lines should be first - initializing serverConfig
ConfigService.initProcessEnvVars();
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import path from 'path';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { serverConfig } from './shared/consts/server-config';
import { AllExceptionsFilter } from './shared/exception-filters/all-exceptions-filter';

class Bootstrap {
  async init() {
    this.setConsoleLog();
    const app = await NestFactory.create(AppModule);
    this.setSecurity(app);
    this.setStaticFiles(app);
    this.setMiddlewares(app);
    this.setRequestHandling(app);

    app.setGlobalPrefix(serverConfig.globalApiPrefix);
    await app.listen(serverConfig.port, () => {
      Logger.log(`Server is up and listening at http://localhost:${serverConfig.port}/${serverConfig.globalApiPrefix}`);
    });
  }

  setSecurity(app) {
    app.enableCors();
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ['\'self\''],
          styleSrc: ['\'self\''],
          scriptSrc: ['\'self\''],
          fontSrc: ['\'self\''],
          reportUri: '/report-violation',
          objectSrc: ['\'self\'']
          // upgradeInsecureRequests: true
        }
      },
      referrerPolicy: { policy: 'same-origin' }
    }));
  }

  setStaticFiles(app) {
    // app.use('/', (req, res, next) => {
    //   console.log('in * :', req.url);
    //   next();
    // });
    app.use(express.static(path.join(process.cwd(), './dist/')));
    app.use('/assets', express.static(path.resolve(process.cwd(), serverConfig.paths.assetsFolder)));
    app.use('/favicon.ico', (req, res) => {
      res.setHeader('Content-Length', '0');
      res.setHeader('Content-Type', 'image/x-icon');
      res.end();
    });
  }

  setMiddlewares(app) {
    // app.useGlobalGuards(new RequestLogsGuard());
    // app.useGlobalInterceptors(new TransformInterceptor());
    // app.use(LoggerMiddleware);
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  }

  setRequestHandling(app) {
    app.use(morgan('dev'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(compression());
  }

  setConsoleLog() {
    console['orgLog'] = console.log;
    console.log = (...params) => {
      const time = (new Date()).toISOString().replace('T', ' ').substring(0, 19);
      console['orgLog'](time, ...params);
    };
  }
}

const bootstrap = new Bootstrap();
bootstrap.init().then();

