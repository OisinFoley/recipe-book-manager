import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPlaceholder]'
})
export class PlaceholderDirective {
  // holds info about the view/component that we are about to embed a component in
  constructor(public viewContainerRef: ViewContainerRef) { }
}
