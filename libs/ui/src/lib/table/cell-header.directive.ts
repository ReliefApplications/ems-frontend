import { CdkColumnDef, CdkHeaderCell } from '@angular/cdk/table';
import {
  AfterContentInit,
  Directive,
  ElementRef,
  Renderer2,
} from '@angular/core';

/**
 * Ui Cell Header Directive
 */
@Directive({
  selector: '[uiCellHeader]',
})
export class CellHeaderDirective
  extends CdkHeaderCell
  implements AfterContentInit
{
  /**
   * Constructor of ui cell header directive
   *
   * @param columnDef columnDef associated to element
   * @param el reference to the element linked to the directive
   * @param renderer renderer2
   */
  constructor(
    private columnDef: CdkColumnDef,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    super(columnDef, el);
  }

  classes = [
    'capitalize',
    'py-3.5',
    'pl-4',
    'pr-3',
    'text-left',
    'text-sm',
    'font-medium',
    'text-gray-900',
  ];

  ngAfterContentInit(): void {
    for (const cl of this.classes) {
      this.renderer.addClass(this.el.nativeElement, cl);
    }
  }
}
