import { Directive, ContentChildren, QueryList, AfterContentInit, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[radio-group-directive]'
})
export class RadioGroupDirective implements AfterContentInit {
  @ContentChildren('radioInput') radioInputs!: QueryList<ElementRef>;
  @Input('nameGroup') nameGroup!: string;

  constructor() {}

  ngAfterContentInit() {
    this.radioInputs.forEach(input => input.nativeElement.setAttribute('name', this.nameGroup));
  }
}