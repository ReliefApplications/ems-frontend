import { CdkCell, CdkColumnDef } from '@angular/cdk/table';
import {
  AfterContentInit,
  Directive,
  ElementRef,
  Renderer2,
} from '@angular/core';

/**
 * Ui Cell Directive
 */
@Directive({
  selector: '[uiCell]',
})
export class CellDirective extends CdkCell implements AfterContentInit {
  /**
   * Constructor for ui cell directive
   *
   * @param columnDef column def associated with element
   * @param elRef Element linked to where the directive is used
   * @param renderer renderer2
   */
  constructor(
    private columnDef: CdkColumnDef,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {
    super(columnDef, elRef);
  }

  classes = [
    'whitespace-nowrap',
    'py-4',
    'pl-4',
    'pr-3',
    'text-sm',
    'font-normal',
    'text-gray-900',
  ];

  ngAfterContentInit(): void {
    for (const cl of this.classes) {
      this.renderer.addClass(this.elRef.nativeElement, cl);
    }
  }
}
