import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  // the following is a way to select an element that has an HTML attribute of 
  //    'app-servers', similar to the selector available in CSS
  // the square brackets can also be used to select multiple elements
  // selector: '[app-servers]',
  // same as above but as a class
  // selector: '.app-servers',
  templateUrl: './servers.component.html',
  // template: `
  //   <app-server></app-server>
  //   <app-server></app-server>`,
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  allowNewServer = false;
  serverCreationStatus = 'No server created yet';
  serverName = '';
  serverCreated = false;
  servers = ['TestServer', 'TestServer 2'];

  constructor() { 
    setTimeout(() => {
      this.allowNewServer = true;
    }, 2000);
  }

  ngOnInit() {
  }

  onCreateServer() {
    // this.serverCreationStatus = `Server was created and name is ${this.serverName}!`;
    this.serverCreated = true;
    this.servers.push(this.serverName);
  }

  onUpdateServerName(event: any) {
    this.serverName = (<HTMLInputElement>event.target).value;
  }
}
