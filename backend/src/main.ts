import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

async function bootstrap(): Promise<void> {
  const envPath = resolve(process.cwd(), '.env');
  if (existsSync(envPath)) process.loadEnvFile(envPath);

  const [{ NestFactory }, { ExpressAdapter }, { AppModule }, { configureApp }, { loadConfig }] = await Promise.all([
    import('@nestjs/core'),
    import('@nestjs/platform-express'),
    import('./app.module.js'),
    import('./configure-app.js'),
    import('./config.js'),
  ]);
  const config = loadConfig();
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  configureApp(app);
  await app.listen(config.port, '127.0.0.1');
}

void bootstrap().catch(() => {
  process.stderr.write('Backend startup failed. Check local configuration.\n');
  process.exitCode = 1;
});
