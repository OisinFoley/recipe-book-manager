export class LoggingService {
  logStatusChange(status: string) {
    console.log('a server status changed ' + status);
  }
}