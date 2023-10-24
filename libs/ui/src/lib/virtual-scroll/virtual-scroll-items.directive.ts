import { NgFor } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Input,
  ViewContainerRef,
  inject,
} from '@angular/core';

@Directive({
  selector: '[uiForVirtual]',
  standalone: true,
  hostDirectives: [
    // to avoid importing ngFor in component provider array
    {
      directive: NgFor,
      // exposing inputs and remapping them
      inputs: ['ngForOf:uiForVirtualOf'],
    },
  ],
})
export class NgForUIVirtualDirective<T> implements AfterViewInit {
  @Input() uiForVirtualOf: T[] | undefined;

  private vcr = inject(ViewContainerRef);
  private ref?: EmbeddedViewRef<unknown>;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    console.log(this.el);
    console.log(this.uiForVirtualOf);
  }
}
