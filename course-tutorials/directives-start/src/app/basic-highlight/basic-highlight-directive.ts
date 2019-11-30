import { Directive, ElementRef, OnInit, AfterViewInit } from "@angular/core";

@Directive({
  selector: '[appBasicHighlight]'
})
export class BasicHighlightDirective implements OnInit {
  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.style.backgroundColor = 'green';
  }

  // in some advanced scenarios (maybe if we fetch data from a service),
  //  this approach would not work
  // the ideal approach is the one shown in ./better-highlight

  ngAfterViewInit() {
    this.elementRef.nativeElement.style.border = "15px solid orange";
  }
  
}