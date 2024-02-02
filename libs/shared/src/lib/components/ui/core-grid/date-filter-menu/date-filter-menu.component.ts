import { Component, ElementRef, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, UntypedFormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  FilterService,
  PopupCloseEvent,
  SinglePopupService,
} from '@progress/kendo-angular-grid';
import { PopupSettings } from '@progress/kendo-angular-dateinputs';
import { takeUntil } from 'rxjs';
import {
  FIELD_TYPES,
  DATE_FILTER_OPERATORS,
} from '../../../filter/filter.const';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { DOCUMENT } from '@angular/common';

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
  selector: 'shared-date-filter-menu',
  templateUrl: './date-filter-menu.component.html',
  styleUrls: ['./date-filter-menu.component.scss'],
})
export class DateFilterMenuComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Field */
  @Input() public field = '';
  /** Filter */
  @Input() public filter: any;
  /** Field value */
  @Input() public valueField = '';
  /** Filter service */
  @Input() public filterService?: FilterService;
  /** Field format */
  @Input() public format = 'dd/MM/yy HH:mm';

  /** Form */
  public form!: ReturnType<typeof this.createFormGroup>;
  /** First date mode */
  public firstDateMode = 'date';
  /** Second date mode */
  public secondDateMode = 'date';

  /** Operators list */
  public operatorsList: any[] = [];
  /** Logics */
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

  /** Popup settings */
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
   * @param document document
   */
  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    private element: ElementRef,
    private popupService: SinglePopupService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
    const type = FIELD_TYPES.find((x) => x.editor === 'datetime');
    this.operatorsList = DATE_FILTER_OPERATORS.filter((x) =>
      type?.operators?.includes(x.value)
    );
    console.log(this.operatorsList);
    this.operatorsList.forEach((o) => {
      o.text = this.translate.instant(o.label);
    });
    console.log(this.operatorsList);
    popupService.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: PopupCloseEvent) => {
        if (
          this.document.activeElement &&
          closest(
            this.document.activeElement as HTMLElement,
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
            : 'gte',
          value: this.fb.control(
            this.filter.filters[0] ? this.filter.filters[0].value : ''
          ),
        }),
        this.fb.group({
          field: this.field,
          operator: this.filter.filters[1]
            ? this.filter.filters[1].operator
            : 'lte',
          value: this.fb.control(
            this.filter.filters[1] ? this.filter.filters[1].value : ''
          ),
        }),
      ]),
    });
  }

  /**
   * Switch the date mode input for the filter for the given date mode type: first or second
   *
   * @param dateMode Which date mode should be updated, first or second
   */
  setDateModeType(dateMode: 'first' | 'second') {
    if (dateMode === 'first') {
      this.firstDateMode =
        this.firstDateMode === 'expression' ? 'date' : 'expression';
    } else {
      this.secondDateMode =
        this.secondDateMode === 'expression' ? 'date' : 'expression';
    }
  }
}
