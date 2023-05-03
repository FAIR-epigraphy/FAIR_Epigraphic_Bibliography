import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[childViewContainer]',
})
export class childViewContainerDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}