import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  Field,
  QueryBuilderService,
} from '../../../../services/query-builder/query-builder.service';
import { ListBoxToolbarConfig } from '@progress/kendo-angular-listbox';

/**
 * Query style component.
 * Used by Grid Layout Settings.
 */
@Component({
  selector: 'shared-query-style',
  templateUrl: './query-style.component.html',
  styleUrls: ['./query-style.component.scss'],
})
/**
 * QueryStyleComponent is a component that allows the user to customize the style of a query.
 *
 * @class
 */
export class QueryStyleComponent implements OnInit {
  /**
   * The query object to be styled.
   *
   * @type {any}
   * @public
   */
  @Input() query: any;

  /**
   * The form group used to manage the form controls.
   *
   * @type {UntypedFormGroup}
   * @public
   */
  @Input() form!: UntypedFormGroup;

  /**
   * The form control used to manage the whole row toggle.
   *
   * @type {UntypedFormControl}
   * @public
   */
  public wholeRow!: UntypedFormControl;

  /**
   * The list of filter fields available for the query.
   *
   * @type {Field[]}
   * @public
   */
  public filterFields: Field[] = [];

  /**
   * The list of available fields for the query.
   *
   * @type {string[]}
   * @public
   */
  public availableFields: string[] = [];

  /**
   * The list of selected fields for the query.
   *
   * @type {string[]}
   * @private
   */
  public _selectedFields: string[] = [];

  /**
   * The configuration for the list box toolbar.
   *
   * @type {ListBoxToolbarConfig}
   * @public
   */
  public toolbarSettings: ListBoxToolbarConfig = {
    position: 'right',
    tools: ['transferFrom', 'transferTo', 'transferAllFrom', 'transferAllTo'],
  };

  /**
   * Gets the list of selected fields for the query.
   *
   * @type {string[]}
   * @public
   */
  public get selectedFields(): string[] {
    this.form.get('fields')?.setValue(this._selectedFields);
    return this._selectedFields;
  }

  /**
   * Sets the list of selected fields for the query.
   *
   * @type {string[]}
   * @public
   */
  public set selectedFields(value: string[]) {
    this.form.get('fields')?.setValue(this._selectedFields);
    this._selectedFields = value;
  }

  /**
   * Event emitter for closing the edition of the query style.
   *
   * @type {EventEmitter<any>}
   * @public
   */
  @Output() closeEdition = new EventEmitter<any>();

  /**
   * Constructor for the query style component.
   *
   * @constructor
   * @param {QueryBuilderService} queryBuilder - The service used to build the query.
   */
  constructor(private queryBuilder: QueryBuilderService) {}

  /**
   * Initializes the component.
   *
   * @public
   * @returns {void}
   */
  ngOnInit(): void {
    const fields = this.form.get('fields')?.value || [];
    if (fields.length > 0) {
      this.wholeRow = new UntypedFormControl(false);
    } else {
      this.wholeRow = new UntypedFormControl(true);
    }
    this.wholeRow.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('fields')?.setValue([]);
      }
    });

    this.queryBuilder.getFilterFields(this.query).then((f) => {
      this.filterFields = f;
    });

    this._selectedFields = [...fields];

    this.availableFields = [
      ...this.query.fields
        .map((x: any) => x.name)
        .filter((x: any) => !this._selectedFields.includes(x)),
    ];
  }

  /**
   * Toggles boolean controls.
   *
   * @public
   * @param {string} controlName - The name of the form control.
   * @returns {void}
   */
  onToggle(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(!control.value);
    }
  }
}
