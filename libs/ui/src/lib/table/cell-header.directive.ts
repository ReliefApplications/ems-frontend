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

  /** Cell header classes */
  classes = [
    'capitalize',
    'pt-3.5',
    'pb-5',
    'pl-6',
    'pr-3',
    'text-left',
    'text-sm',
    'font-bold',
    'text-light-200',
  ];

  ngAfterContentInit(): void {
    for (const cl of this.classes) {
      this.renderer.addClass(this.el.nativeElement, cl);
    }
  }
}
