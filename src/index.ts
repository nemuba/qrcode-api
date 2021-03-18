import { SetupServer } from './server';
import { Logger } from '@overnightjs/logger';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

(async (): Promise<void> => {
  try {
    const server = new SetupServer();
    await server.init();
    server.start();

  } catch (error) {
    Logger.Imp(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
})();