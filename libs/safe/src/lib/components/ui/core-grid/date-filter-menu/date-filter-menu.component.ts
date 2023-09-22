import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  FilterService,
  PopupCloseEvent,
  SinglePopupService,
} from '@progress/kendo-angular-grid';
import { PopupSettings } from '@progress/kendo-angular-dateinputs';
import { takeUntil } from 'rxjs';
import { FIELD_TYPES, FILTER_OPERATORS } from '../../../filter/filter.const';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';

/**
 * Required in order to prevent the kendo datepicker to close the menu on click.
 *
 * @param node html element
 * @param predicate predicate method
 * @returns is close or not
 */
const closest = (
  node: HTMLElement,
  predicate: (node: HTMLElement) => boolean
): HTMLElement => {
  while (node && !predicate(node)) {
    node = node.parentNode as HTMLElement;
  }

  return node;
};

/**
 * Date Filter Component allows to use expressions or to select a date.
 */
@Component({
  selector: 'safe-date-filter-menu',
  templateUrl: './date-filter-menu.component.html',
  styleUrls: ['./date-filter-menu.component.scss'],
})
export class SafeDateFilterMenuComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() public field = '';
  @Input() public filter: any;
  @Input() public valueField = '';
  @Input() public filterService?: FilterService;

  public form!: ReturnType<typeof this.createFormGroup>;
  public firstDateMode = 'date';
  public secondDateMode = 'date';

  public operatorsList: any[] = [];
  public logics = [
    {
      text: this.translate.instant('kendo.grid.filterOrLogic'),
      value: 'or',
    },
    {
      text: this.translate.instant('kendo.grid.filterAndLogic'),
      value: 'and',
    },
  ];

  public popupSettings: PopupSettings = {
    popupClass: 'date-range-filter',
  };

  /** @returns The filters */
  public get filters(): UntypedFormArray {
    return this.form?.get('filters') as UntypedFormArray;
  }

  /**
   * Constructor for date filter component
   *
   * @param fb This is the service used to build forms.
   * @param translate The translation service
   * @param element element ref
   * @param popupService kendo popup service
   */
  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    private element: ElementRef,
    private popupService: SinglePopupService
  ) {
    super();
    const type = FIELD_TYPES.find((x) => x.editor === 'datetime');
    this.operatorsList = FILTER_OPERATORS.filter((x) =>
      type?.operators?.includes(x.value)
    );
    this.operatorsList.forEach((o) => {
      o.text = this.translate.instant(o.label);
    });
    popupService.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: PopupCloseEvent) => {
        if (
          document.activeElement &&
          closest(
            document.activeElement as HTMLElement,
            (node) =>
              node === this.element.nativeElement ||
              String(node.className).indexOf('date-range-filter') >= 0
          )
        ) {
          e.preventDefault();
        }
      });
  }

  ngOnInit(): void {
    this.form = this.createFormGroup();
    this.form.valueChanges.subscribe((value) => {
      this.filterService?.filter(value as any);
    });
  }

  /**
   * Create form group
   *
   * @returns form group
   */
  createFormGroup() {
    return this.fb.group({
      logic: this.filter.logic,
      filters: this.fb.array([
        this.fb.group({
          field: this.field,
          operator: this.filter.filters[0]
            ? this.filter.filters[0].operator
            : 'eq',
          value: this.fb.control(
            this.filter.filters[0] ? this.filter.filters[0].value : ''
          ),
        }),
        this.fb.group({
          field: this.field,
          operator: this.filter.filters[1]
            ? this.filter.filters[1].operator
            : 'eq',
          value: this.fb.control(
            this.filter.filters[1] ? this.filter.filters[1].value : ''
          ),
        }),
      ]),
    });
  }
}
