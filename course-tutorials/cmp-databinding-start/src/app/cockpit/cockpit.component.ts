import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css']
})
export class CockpitComponent implements OnInit {
  @Output() serverCreated = new EventEmitter<{ serverName: string, serverContent: string }>();
  @Output('bpCreated') blueprintCreated = new EventEmitter<{ serverName: string, serverContent: string }>();
  newServerName = '';
  newServerContent = '';
  // part of (2.) in the template, how to directly access DOM element,
  // instead of using binding
  @ViewChild('serverContentInput', {static: true}) serverContentInput: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  
  //   console.log(nameInput.value);
  // see commented code in template (1.) for 
  //  use of local reference to pass arg to this func
  // onAddServer(nameInput: HTMLInputElement) {
  //   console.log(nameInput.value);
  //   this.serverCreated.emit({
  // // part of 1.
  //     serverName: nameInput.value,
  // // part of 2.
  //     serverContent: this.serverContentInput.nativeElement.value
  //   });
  // }

  onAddServer() {
    this.serverCreated.emit({
      serverName: this.newServerName,
      serverContent: this.newServerContent
    });
  }

  onAddBlueprint() {
    this.blueprintCreated.emit({
      serverName: this.newServerName,
      serverContent: this.newServerContent
    });
  }

}
