import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  ColumnReorderEvent,
  GridComponent,
  GridDataResult,
  PageChangeEvent,
  RowArgs,
  SelectionEvent,
} from '@progress/kendo-angular-grid';
import { SafeExpandedCommentComponent } from '../expanded-comment/expanded-comment.component';
import get from 'lodash/get';
import { MatDialog } from '@angular/material/dialog';
import {
  EXPORT_SETTINGS,
  GRADIENT_SETTINGS,
  MULTISELECT_TYPES,
  PAGER_SETTINGS,
  SELECTABLE_SETTINGS,
} from './grid.constants';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from '@progress/kendo-data-query';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { ResizeBatchService } from '@progress/kendo-angular-common';
import {
  CalendarDOMService,
  MonthViewService,
  WeekNamesService,
} from '@progress/kendo-angular-dateinputs';
import { PopupService } from '@progress/kendo-angular-popup';
import { FormControl, FormGroup } from '@angular/forms';
import { SafeGridService } from '../../../../services/grid.service';
import { SafeDownloadService } from '../../../../services/download.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SafeExportComponent } from '../export/export.component';
import { GridLayout } from '../models/grid-layout.model';
import { SafeSnackBarService } from 'projects/safe/src/public-api';
import { TranslateService } from '@ngx-translate/core';
import * as Survey from 'survey-angular';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  const block = () => overlay.scrollStrategies.block();
  return block;
}

const matches = (el: any, selector: any) =>
  (el.matches || el.msMatchesSelector).call(el, selector);

@Component({
  selector: 'safe-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [
    PopupService,
    ResizeBatchService,
    CalendarDOMService,
    MonthViewService,
    WeekNamesService,
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
    {
      provide: MAT_TOOLTIP_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
    {
      provide: MAT_MENU_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
})
export class SafeGridComponent implements OnInit, AfterViewInit {
  public multiSelectTypes: string[] = MULTISELECT_TYPES;

  // === DATA ===
  @Input() fields: any[] = [];
  @Input() data: GridDataResult = { data: [], total: 0 };
  @Input() loading = false;
  @Input() error = false;
  @Input() blank = false;

  // === EXPORT ===
  public exportSettings = EXPORT_SETTINGS;
  @Output() export = new EventEmitter();

  // === EDITION ===
  @Input() editable = false;
  @Input() hasChanges = false;
  public formGroup: FormGroup = new FormGroup({});
  private currentEditedRow = 0;
  private currentEditedItem: any;
  public gradientSettings = GRADIENT_SETTINGS;
  public editing = false;

  // === ACTIONS ===
  @Input() actions = {
    add: false,
    update: false,
    delete: false,
    history: false,
    convert: false,
    export: false,
    showDetails: false,
  };
  @Input() hasDetails = true;
  @Output() action = new EventEmitter();
  get hasEnabledActions(): boolean {
    return Object.values(this.actions).includes(true);
  }

  // === DISPLAY ===
  @Input() resizable = true;
  @Input() reorderable = true;
  get columnMenu(): { columnChooser: boolean; filter: boolean } {
    return {
      columnChooser: false,
      filter: !this.showFilter,
    };
  }

  // === SELECT ===
  @Input() selectable = true;
  @Input() multiSelect = true;
  public selectableSettings = SELECTABLE_SETTINGS;
  @Input() selectedRows: string[] = [];
  @Output() selectionChange = new EventEmitter();

  // === FILTER ===
  @Input() filterable = true;
  @Input() showFilter = false;
  @Input() filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  @Output() filterChange = new EventEmitter();
  @Output() showFilterChange = new EventEmitter();
  @Input() searchable = true;
  public search = new FormControl('');
  @Output() searchChange = new EventEmitter();

  // === PAGINATION ===
  @Input() pageSize = 10;
  @Input() skip = 0;
  public pagerSettings = PAGER_SETTINGS;
  @Output() pageChange = new EventEmitter();

  // === SORT ===
  @Input() sortable = true;
  @Input() sort: SortDescriptor[] = [];
  @Output() sortChange = new EventEmitter();

  // === TEMPLATE ===
  @ViewChild(GridComponent)
  private grid?: GridComponent;

  // === ADMIN ===
  @Input() admin = false;
  private columnsOrder: any[] = [];
  @Output() columnChange = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private gridService: SafeGridService,
    private renderer: Renderer2,
    private downloadService: SafeDownloadService,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    // this way we can wait for 2s before sending an update
    this.search.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe((value) => {
        this.searchChange.emit(value);
      });
  }

  ngAfterViewInit(): void {
    // Wait for columns to be reordered before updating the layout
    this.grid?.columnReorder.subscribe((res) =>
      setTimeout(() => this.columnChange.emit(), 500)
    );
  }

  // === DATA ===
  /**
   * Returns property value in object from path.
   *
   * @param item Item to get property of.
   * @param path Path of the property.
   * @returns Value of the property.
   */
  public getPropertyValue(item: any, path: string): any {
    const meta = this.fields.find((x) => x.name === path).meta;
    const value = get(item, path);
    if (meta.choices) {
      if (Array.isArray(value)) {
        return meta.choices.reduce(
          (acc: string[], x: any) =>
            value.includes(x.value) ? acc.concat([x.text]) : acc,
          []
        );
      } else {
        return meta.choices.find((x: any) => x.value === value)?.text || '';
      }
    } else {
      return value;
    }
  }

  /**
   * Returns field style from path.
   *
   * @param item Item to get style of.
   * @param path Path of the property.
   * @returns Style fo the property.
   */
  public getStyle(item: any, path: string): any {
    const fieldStyle = get(item, `_meta.style.${path}`);
    const rowStyle = get(item, '_meta.style._row');
    return fieldStyle ? fieldStyle : rowStyle;
  }

  /**
   * Returns full URL value.
   * TODO: avoid template call
   *
   * @param url Initial URL.
   * @returns full valid URL.
   */
  public getUrl(url: string): URL | null {
    if (url && !(url.startsWith('https://') || url.startsWith('http://'))) {
      url = 'https://' + url;
    }
    try {
      return new URL(url);
    } catch {
      return null;
    }
  }

  // === FILTER ===
  /**
   * Handles filter change event.
   *
   * @param filter Filter event.
   */
  public onFilterChange(filter: CompositeFilterDescriptor): void {
    if (!this.loading) {
      this.filter = filter;
      this.filterChange.emit(filter);
    }
  }

  /**
   * Toggles quick filter visibility
   */
  public onToggleFilter(): void {
    if (!this.loading) {
      this.showFilter = !this.showFilter;
      this.showFilterChange.emit(this.showFilter);
      this.onFilterChange({
        logic: 'and',
        filters: this.showFilter ? [] : this.filter.filters,
      });
    }
  }

  /**
   * Searchs through all text columns.
   *
   * @param search text input value.
   */
  public onSearch(search: any): void {
    this.searchChange.emit(search);
  }

  // === SORT ===
  /**
   * Handles sort change event.
   *
   * @param sort Sort event.
   */
  public onSortChange(sort: SortDescriptor[]): void {
    if (!this.loading) {
      this.sort = sort;
      this.sortChange.emit(sort);
    }
  }

  // === PAGINATION ===
  /**
   * Handles page change event.
   *
   * @param page Page event.
   */
  public onPageChange(page: PageChangeEvent): void {
    if (!this.loading) {
      this.skip = page.skip;
      this.pageSize = page.take;
      this.pageChange.emit(page);
    }
  }

  // === SELECT ===
  /**
   * Handles selection change event.
   *
   * @param selection Selection event.
   */
  public onSelectionChange(selection: SelectionEvent): void {
    const deselectedRows = selection.deselectedRows || [];
    const selectedRows = selection.selectedRows || [];
    if (deselectedRows.length > 0) {
      this.selectedRows = [
        ...this.selectedRows.filter(
          (x) => !deselectedRows.some((y) => x === y.dataItem)
        ),
      ];
    }
    if (selectedRows.length > 0) {
      this.selectedRows = this.selectedRows.concat(
        selectedRows.map((x) => x.dataItem)
      );
    }
    this.selectionChange.emit(selection);
  }

  /**
   * Returns selected status of a row.
   *
   * @param row Row to test.
   * @returns selected status of the row.
   */
  public isRowSelected = (row: RowArgs) =>
    this.selectedRows.includes(row.dataItem);

  // === LAYOUT ===
  /**
   * Set and emit new grid configuration after column reorder event.
   *
   * @param e ColumnReorderEvent
   */
  onColumnReorder(e: ColumnReorderEvent): void {
    this.columnChange.emit();
  }

  /**
   * Sets and emits new grid configuration after column resize event.
   */
  onColumnResize(): void {
    this.columnChange.emit();
  }

  /**
   * Sets and emits new grid configuration after column visibility event.
   */
  onColumnVisibilityChange(): void {
    this.columnChange.emit();
  }

  /**
   * Returns the visible columns of the grid.
   */
  get visibleFields(): any {
    return this.grid?.columns
      .toArray()
      .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
      .filter((x: any) => x.field)
      .reduce(
        (obj, c: any) => ({
          ...obj,
          [c.field]: {
            field: c.field,
            title: c.title,
            width: c.width,
            hidden: c.hidden,
            order: c.orderIndex,
            subFields:
              this.fields.find((x) => x.name === c.field)?.subFields || [],
          },
        }),
        {}
      );
  }

  /**
   * Returns the current grid layout.
   */
  get layout(): GridLayout {
    return {
      fields: this.visibleFields,
      sort: this.sort,
      filter: this.filter,
      showFilter: this.showFilter,
    };
  }

  // === INLINE EDITION ===

  /**
   * Detects cell click event and opens row form if user is authorized.
   *
   * @param param0 click event.
   */
  public cellClickHandler({ isEdited, dataItem, rowIndex }: any): void {
    // Parameters that prevent the inline edition.
    if (
      !this.data.data[rowIndex - this.skip].canUpdate ||
      !this.editable ||
      isEdited ||
      (this.formGroup && !this.formGroup.valid)
    ) {
      return;
    }
    // Closes current inline edition.
    if (this.currentEditedItem) {
      if (this.formGroup.dirty) {
        this.action.emit({
          action: 'edit',
          item: this.currentEditedItem,
          value: this.formGroup.value,
        });
      }
      this.closeEditor();
    }
    // creates the form group.
    this.formGroup = this.gridService.createFormGroup(dataItem, this.fields);
    this.currentEditedItem = dataItem;
    this.currentEditedRow = rowIndex;
    this.grid?.editRow(rowIndex, this.formGroup);
  }

  /**
   * Detects document click to save record if outside the inline edition form.
   *
   * @param e click event.
   */
  private onDocumentClick(e: any): void {
    if (
      !this.editing &&
      this.formGroup &&
      this.formGroup.valid &&
      !matches(
        e.target,
        '#recordsGrid tbody *, #recordsGrid .k-grid-toolbar .k-button .k-animation-container'
      )
    ) {
      if (this.formGroup.dirty) {
        this.action.emit({
          action: 'edit',
          item: this.currentEditedItem,
          value: this.formGroup.value,
        });
      }
      this.closeEditor();
    }
  }

  /**
   * Closes the inline edition.
   */
  private closeEditor(): void {
    this.grid?.closeRow(this.currentEditedRow);
    this.grid?.cancelCell();
    this.currentEditedRow = 0;
    this.currentEditedItem = null;
    this.editing = false;
    this.formGroup = new FormGroup({});
  }

  /**
   * Saves edition.
   */
  public onSave(): void {
    // eslint-disable-next-line no-underscore-dangle
    const stringVal = this.data.data[0]._meta.formStructure;
    // Closes the editor, and saves the value locally
    if (this.formGroup.dirty) {
      this.action.emit({
        action: 'edit',
        item: this.currentEditedItem,
        value: this.formGroup.value,
      });
    }
    //Opens a snack bar if the validators from the form are not respected
    if (this.checkValidation(this.parseValidator(stringVal)) !== '') {
      this.snackBar.openSnackBar(
        this.checkValidation(this.parseValidator(stringVal)),
        {
          error: true,
          duration: 8000,
        }
      );
    } else {
      this.closeEditor();
      this.action.emit({ action: 'save' });
    }
  }

  /**
   * Cancels edition.
   */
  public onCancel(): void {
    this.closeEditor();
    this.action.emit({ action: 'cancel' });
  }

  // === EXPORT ===
  /**
   * Downloads file of record.
   *
   * @param file File to download.
   */
  public onDownload(file: any): void {
    const path = `download/file/${file.content}`;
    this.downloadService.getFile(path, file.type, file.name);
  }

  /**
   * Opens export modal.
   */
  public onExport(): void {
    const dialogRef = this.dialog.open(SafeExportComponent, {
      data: {
        export: this.exportSettings,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.exportSettings = res;
        this.export.emit(this.exportSettings);
      }
    });
  }

  // === VALIDATION ===

  /**
   * Transform the validators to a more useful format
   *
   * @param stringVal Validator on string form
   * @returns List of validators in JSON format with type and different values
   */
  parseValidator(stringVal: string): any {
    const listOfValidators: any[] = [];
    const JSONval = JSON.parse(stringVal);
    for (const page of JSONval.pages) {
      for (const element of page.elements) {
        if (typeof element.validators !== 'undefined') {
          //Create an object that will contain the attributes of the validator
          const validatorObject: any = { valueName: element.valueName };
          validatorObject.isRequired = element.isRequired;
          for (const validator of element.validators) {
            for (const key in validator) {
              if (validator.hasOwnProperty(key)) {
                validatorObject[key] = validator[key];
              }
            }
          }
          listOfValidators.push(validatorObject);
        }
      }
    }
    return listOfValidators;
  }

  /**
   * Checks if the data is coherent with the regex validators
   *
   * @param validator Validator with its attributes
   * @returns error message to display
   */
  checkValidation(validator: any): string {
    let errMessage = '';
    let row = 0;
    const data = this.data.data;
    Object.keys(data).forEach((value1, key1) => {
      Object.keys(data[key1]).forEach((value2, key2) => {
        Object.keys(validator).forEach((value3, key3) => {
          if (value2 === validator[value3].valueName) {
            //Check if the field is required and if the cell did not became empty
            if (validator[value3].isRequired && data[key1][value2] === '') {
              errMessage +=
                this.translate.instant(
                  'components.widget.grid.errors.fieldRequired',
                  { name: validator[value3].valueName }
                ) + '\n';
            }
            row = +value1 + 1;
            //Use different validation functions regarding the type of validator
            switch (validator[value3].type) {
              case 'regex':
                errMessage += this.validateRegex(
                  validator[value3].regex,
                  data[key1][value2],
                  this.writeErrorMessage(row, validator[value3])
                );
                break;
              case 'numeric':
                errMessage += this.validateNumeric(
                  data[key1][value2],
                  this.writeErrorMessage(row, validator[value3]),
                  validator[value3].minValue,
                  validator[value3].maxValue
                );
                break;
              case 'email':
                errMessage += this.validateEmail(
                  data[key1][value2],
                  this.writeErrorMessage(row, validator[value3])
                );
                break;
              case 'text':
                errMessage += this.validateText(
                  data[key1][value2],
                  this.writeErrorMessage(row, validator[value3]),
                  validator[value3].maxLength,
                  validator[value3].minLength,
                  validator[value3].allowDigits
                );
                break;
              case 'expression':
                const values: any = {};
                for (const columnIndex in data[key1]) {
                  //Check if columnIndex exists and if the name of the column is contained in the expression to check
                  //If so, we add it to the values object
                  if (
                    data[key1].hasOwnProperty(columnIndex) &&
                    validator[value3].expression.includes(
                      '{' + columnIndex + '}'
                    )
                  ) {
                    values[columnIndex] = data[key1][columnIndex];
                  }
                }
                errMessage += this.validateExpression(
                  validator[value3].expression,
                  values,
                  this.writeErrorMessage(row, validator[value3])
                );
                break;
            }
          }
        });
      });
    });
    return errMessage;
  }

  /**
   * Uses the SurveyJS expression validator to return an error message if necessary
   *
   * @param expression Expression used to check the data
   * @param values Object whose values we need to check
   * @param errText Error message to display if error
   * @returns Error message to display
   */
  validateExpression(expression: string, values: any, errText: string) {
    const expressionValidator = new Survey.ExpressionValidator(expression);
    expressionValidator.text = errText;
    const res = expressionValidator.validate('', errText, values);
    if (res === null || res.error === null) {
      return '';
    } else {
      return res.error.text;
    }
  }

  /**
   * Uses the SurveyJS text validator to return an error message if necessary
   *
   * @param value Value to check
   * @param errText Error message to display if error
   * @param maxLength Maximum length of the text
   * @param minLength Minimum length of the text
   * @param allowDigits Wether or not the text should contain digits
   * @returns Error message to display
   */
  validateText(
    value: any,
    errText: string,
    maxLength: number,
    minLength?: number,
    allowDigits?: boolean
  ) {
    const textValidator = new Survey.TextValidator();
    textValidator.maxLength = maxLength;
    textValidator.text = errText;
    if (minLength !== undefined) {
      textValidator.minLength = minLength;
    }
    if (allowDigits !== undefined) {
      textValidator.allowDigits = allowDigits;
    }
    const res = textValidator.validate(value);
    if (res === null || res.error === null) {
      return '';
    } else {
      return res.error.text;
    }
  }

  /**
   * Uses the SurveyJS numeric validator to return an error message if necessary
   *
   * @param value Value to check
   * @param errText Error message to display if error
   * @param minValue Value that our value to check should be superior to
   * @param maxValue Value that our value to check should be inferior to
   * @returns Error message to display
   */
  validateNumeric(
    value: any,
    errText: string,
    minValue: number,
    maxValue: number
  ) {
    const numericValidator = new Survey.NumericValidator(minValue, maxValue);
    numericValidator.text = errText;
    const res = numericValidator.validate(value);
    if (res === null || res.error === null) {
      return '';
    } else {
      return res.error.text;
    }
  }

  /**
   * Uses the SurveyJS e-mail validator to return an error message if necessary
   *
   * @param value Value to check
   * @param errText Error message to display if error
   * @returns Error message to display
   */
  validateEmail(value: any, errText: string): string {
    const emailValidator = new Survey.EmailValidator();
    emailValidator.text = errText;
    const res = emailValidator.validate(value);
    if (res === null || res.error === null) {
      return '';
    } else {
      return res.error.text;
    }
  }

  /**
   * Uses the SurveyJS regex validator to return an error message if necessary
   *
   * @param regex Regular expression used to check the value
   * @param value Value to check
   * @param errText Error message to display if error
   * @returns Error message to display
   */
  validateRegex(regex: any, value: any, errText: string) {
    const regexValidator = new Survey.RegexValidator(regex);
    regexValidator.text = errText;
    const res = regexValidator.validate(value);
    if (res === null || res.error === null) {
      return '';
    } else {
      return res.error.text;
    }
  }

  /**
   * Writes an error message regarding the validator
   *
   * @param rowNumber Row where the error is
   * @param validatorValue Value of the validator for this row
   * @returns error message to display
   */
  writeErrorMessage(rowNumber: number, validatorValue: any): string {
    return (
      this.translate.instant('components.widget.grid.errors.errorOnRow', {
        row: rowNumber,
        column: validatorValue.valueName,
        text: validatorValue.text,
      }) + '\n'
    );
  }
  // === UTILITIES ===
  /**
   * Checks if element overflows
   *
   * @param e Component resizing event.
   * @returns True if overflows.
   */
  isEllipsisActive(e: any): boolean {
    return e.offsetWidth < e.scrollWidth;
  }

  /**
   * Expands text in a full window modal.
   *
   * @param item Item to display data of.
   * @param rowTitle field name.
   */
  public onExpandText(item: any, field: any): void {
    const dialogRef = this.dialog.open(SafeExpandedCommentComponent, {
      data: {
        title: field.title,
        comment: get(item, field),
        readonly: !this.actions.update,
      },
      autoFocus: false,
      position: {
        bottom: '0',
        right: '0',
      },
      panelClass: 'expanded-widget-dialog',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res && res !== get(item, field)) {
        const value = { field: res };
        this.action.emit({ action: 'edit', item, value });
      }
    });
  }
}
