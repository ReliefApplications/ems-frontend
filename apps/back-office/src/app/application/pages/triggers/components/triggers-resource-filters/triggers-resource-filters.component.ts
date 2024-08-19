import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  Access,
  CustomNotification,
  FiltersService,
  Resource,
} from '@oort-front/shared';
import { TranslateService } from '@ngx-translate/core';
import { get } from 'lodash';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

/**
 * Dialog data interface.
 */
interface DialogData {
  trigger: CustomNotification;
  resource: Resource;
}

/**
 * Component for displaying the filtering options for the resource triggers.
 */
@Component({
  selector: 'app-triggers-resource-filters',
  templateUrl: './triggers-resource-filters.component.html',
  styleUrls: ['./triggers-resource-filters.component.scss'],
})
export class TriggersResourceFiltersComponent implements OnInit {
  /** Id of the opened application */
  @Input() applicationId!: string;
  /** If the resource is disabled */
  @Input() disabled = false;

  /** Filter fields */
  public filterFields: any[] = [];
  /** Form group */
  public form: UntypedFormGroup = new UntypedFormGroup({});

  /**
   * Component for displaying the filtering options for the resource triggers.
   *
   * @param data dialog data
   * @param translate Angular translate service
   * @param fb Angular form builder
   * @param filtersService  Filters service
   * @param dialogRef This is the reference of the dialog that will be opened.
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    public translate: TranslateService,
    private fb: FormBuilder,
    public filtersService: FiltersService,
    private dialogRef: DialogRef<Access[]>
  ) {}

  async ngOnInit(): Promise<void> {
    const filters = this.data.trigger.filter;
    this.form = this.createFilterFormGroup(filters);

    this.filterFields = get(this.data.resource, 'metadata', [])
      .filter((x: any) => x.filterable !== false)
      .map((x: any) => ({ ...x }));
  }

  /**
   * Create filters filter group from value
   *
   * @param filter initial value
   * @returns filter as form group
   */
  private createFilterFormGroup(filter?: any) {
    return this.fb.group({
      filter: this.filtersService.createFilterGroup(filter),
    });
  }
}
