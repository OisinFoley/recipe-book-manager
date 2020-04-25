import { HostBinding, HostListener, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  exportAs: 'appDropDown'
})

export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  // accessing elRef where event fires ensures we can close the dropdown from anywhere on the page
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

  constructor(private elRef: ElementRef) {}
}
