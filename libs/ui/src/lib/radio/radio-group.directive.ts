import {
  Directive,
  Renderer2,
  AfterContentInit,
  Input,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[uiRadioGroupDirective]',
})
export class RadioGroupDirective implements AfterContentInit {
  @Input() nameGroup!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterContentInit() {
    const getInput = this.el.nativeElement.querySelector('input');
    this.renderer.setAttribute(getInput, 'name', this.nameGroup);
  }
}
