import { Component } from '@angular/core';
import { LoggingService } from '../logging.service';
import { AccountsService } from '../accounts.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css']
  // ,
  // providers: [LoggingService]
})
export class NewAccountComponent {
  constructor(private loggingService: LoggingService,
              private accountsService: AccountsService) {
    this.accountsService.statusUpdated.subscribe(
      (status: string) => alert(`New Status : ${status}`)
    )
  }

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountsService.addAccount(accountName, accountStatus);

    // *THIS WORKS, BUT IS AN EXAMPLE OF HOW WE DON'T WANT TO DO IT*
    // const service = new LoggingService();
    // service.logStatusChange(accountStatus);

    // grab the instance of our service dependency that we passed into the ctor
    // this.loggingService.logStatusChange(accountStatus);
  }
}
