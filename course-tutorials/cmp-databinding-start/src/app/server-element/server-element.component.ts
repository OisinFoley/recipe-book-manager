import { Component, OnInit, Input, ViewEncapsulation, ContentChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ServerElementComponent implements 
  OnInit,
  AfterViewInit {
    @Input() element: { type: string, name: string, content: string };
    @ContentChild('contentParagraph', {static: true}) paragraph: ElementRef;

    constructor() { }

    ngOnInit() {
      console.log('text content of pargraph: ' + this.paragraph.nativeElement.textContent);
    }

    ngAfterViewInit() {
      console.log('text content of pargraph: ' + this.paragraph.nativeElement.textContent);
    }

}
