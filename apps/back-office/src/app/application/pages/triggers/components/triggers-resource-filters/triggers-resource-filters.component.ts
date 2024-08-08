import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';
import { FiltersService, Resource, TriggersFilters } from '@oort-front/shared';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ResourceTriggersFilters,
  Triggers,
  triggers,
  TriggersType,
} from '../../triggers.types';
import { TranslateService } from '@ngx-translate/core';
import { get, isEqual, set } from 'lodash';

/** Triggers to apply by default to all filters */
const BASE_TRIGGERS = {
  cronBased: false,
  onRecordCreation: false,
  onRecordUpdate: false,
};

/**
 * Component for displaying the filtering options for the resource triggers.
 */
@Component({
  selector: 'app-triggers-resource-filters',
  templateUrl: './triggers-resource-filters.component.html',
  styleUrls: ['./triggers-resource-filters.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TriggersResourceFiltersComponent implements OnInit {
  /** Resource opened */
  @Input() resource!: Resource;
  /** Id of the opened application */
  @Input() applicationId!: string;
  /** If the resource is disabled */
  @Input() disabled = false;
  /** Event emitter for update */
  @Output() update = new EventEmitter();

  /** Filter fields */
  public filterFields: any[] = [];
  /** Opened filter index */
  public openedFilterIndex: number | null = null;
  /** Filters form array */
  public filtersFormArray!: UntypedFormArray;
  /** Opened filter form group */
  public openedFilterFormGroup?: UntypedFormGroup;
  /** Displayed columns */
  public displayedColumns: string[] = ['filter', 'actions'];
  /** Filters */
  public filters = new Array<ResourceTriggersFilters>();

  /**
   * Component for displaying the filtering options for the resource triggers.
   *
   * @param translate Angular translate service
   * @param fb Angular form builder
   * @param filtersService  Filters service
   */
  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    public filtersService: FiltersService
  ) {}

  async ngOnInit(): Promise<void> {
    const filters: ResourceTriggersFilters[] = [];
    const triggersFilters = get(this.resource, 'triggersFilters', []).find(
      (tf: TriggersFilters) => tf.application === this.applicationId
    );
    delete triggersFilters?.application;
    Object.keys(triggersFilters || {}).forEach((trigger) => {
      const triggerFilter = get(triggersFilters, trigger, {});
      for (const filter of get(triggerFilter, 'filters', [])) {
        const existingFilter = filters.find((x) => isEqual(x.filter, filter));
        if (existingFilter) {
          set(existingFilter, `triggers.${trigger}`, true);
        } else {
          filters.push({
            filter,
            triggers: {
              ...BASE_TRIGGERS,
              [trigger]: true,
            },
          });
        }
      }
    });

    // Init table
    this.filters = this.setTableElements(filters);
    // Init form array
    this.filtersFormArray = this.fb.array(
      filters.map((x) => this.createFilterFormGroup(x))
    );

    this.filterFields = get(this.resource, 'metadata', [])
      .filter((x: any) => x.filterable !== false)
      .map((x: any) => ({ ...x }));
  }

  /**
   * Adds new filter to filters list and toggles the edition for it
   */
  public addFilter() {
    const filterGroup = this.createFilterFormGroup();
    this.filtersFormArray.push(filterGroup);
    this.filters = this.setTableElements(this.filtersFormArray.value);
    this.toggleFilterEdition(this.filters.length - 1);
  }

  /**
   * Toggles the edition for a selected filter row
   *
   * @param index index of filter to edit
   */
  public toggleFilterEdition(index: number) {
    if (index < 0) return;
    if (index !== this.openedFilterIndex) {
      this.filters = this.setTableElements(this.filtersFormArray.value);
      const filterFormGroup = this.filtersFormArray.at(index).get('filter');
      if (filterFormGroup) {
        this.openedFilterFormGroup = filterFormGroup as UntypedFormGroup;
        this.openedFilterIndex = index;
      }
    } else {
      this.openedFilterIndex = null;
      this.filters = this.setTableElements(this.filtersFormArray.value);
    }
  }

  /**
   * Update triggers of filter at index
   *
   * @param index index of filter to update
   * @param action trigger to update
   */
  public toggleFilterTrigger(index: number, action: string) {
    const formGroup = this.filtersFormArray.at(index);
    const formControl = formGroup.get(`triggers.${action}`);
    formControl?.setValue(!formControl.value);
    this.filters = this.setTableElements(this.filtersFormArray.value);
  }

  /**
   * Delete a filter from the filters array
   *
   * @param index index of filter to remove
   */
  public deleteFilter(index: number) {
    this.openedFilterIndex = null;
    this.openedFilterFormGroup = undefined;
    this.filtersFormArray.removeAt(index);
    this.filters = this.setTableElements(this.filtersFormArray.value);
    if (this.filters.length === 0) {
      this.save();
    }
  }

  /**
   * Get the current value of the filter form array and return the triggersFilters to be saved.
   */
  public save() {
    const current = this.filtersFormArray.value as ResourceTriggersFilters[];
    const triggersFilters: any = {
      application: this.applicationId,
    };
    current.forEach((filter: any) => {
      Object.keys(filter.triggers).forEach((t: string) => {
        if (filter.triggers[t]) {
          if (Object.prototype.hasOwnProperty.call(triggersFilters, t)) {
            triggersFilters[t].filters.push(filter.filter);
          } else {
            triggersFilters[t] = { filters: [filter.filter] };
          }
        }
      });
    });
    this.update.emit(triggersFilters);
  }

  /**
   * Serialize single table element from filter
   *
   * @param filter filter to serialize
   * @returns serialized element
   */
  private setTableElement(filter: ResourceTriggersFilters): any {
    return {
      filter: filter.filter,
      triggers: triggers.map((trigger) => ({
        name: trigger,
        icon: this.getIcon(trigger),
        variant: this.getVariant(filter, trigger),
        tooltip: this.getTooltip(filter, trigger),
      })),
    };
  }

  /**
   * Serialize list of table elements from filter
   *
   * @param filters filters to serialize
   * @returns serialized elements
   */
  private setTableElements(filters: ResourceTriggersFilters[]): any[] {
    return filters.map((x: ResourceTriggersFilters) => this.setTableElement(x));
  }

  /**
   * Gets the correspondent icon for a given trigger
   *
   * @param trigger The trigger name
   * @returns the name of the icon to be displayed
   */
  private getIcon(trigger: TriggersType) {
    switch (trigger) {
      case Triggers.cronBased:
        return 'schedule_send';
      case Triggers.onRecordCreation:
        return 'add_circle';
      default:
        return 'edit';
    }
  }

  /**
   * Gets the correspondent variant for a given trigger
   *
   * @param filter The filter
   * @param trigger The trigger name
   * @returns the name of the variant to be displayed
   */
  private getVariant(filter: ResourceTriggersFilters, trigger: TriggersType) {
    const hasTrigger = filter.triggers[trigger];
    switch (hasTrigger) {
      case true:
        return 'primary';
      case false:
        return 'grey';
    }
  }

  /**
   * Gets the correspondent tooltip for a given trigger
   *
   * @param filter The filter
   * @param trigger The trigger name
   * @returns the tooltip to be displayed
   */
  private getTooltip(filter: ResourceTriggersFilters, trigger: TriggersType) {
    const hasTrigger = filter.triggers[trigger];
    if (hasTrigger) {
      switch (trigger) {
        case Triggers.cronBased:
          return 'components.triggers.tooltip.withFilterCronBasedTrigger';
        case Triggers.onRecordCreation:
          return 'components.triggers.tooltip.withFilterOnRecordCreationTrigger';
        default:
          return 'components.triggers.tooltip.withFilterOnRecordUpdateTrigger';
      }
    } else {
      switch (trigger) {
        case Triggers.cronBased:
          return 'components.triggers.tooltip.noFilterCronBasedTrigger';
        case Triggers.onRecordCreation:
          return 'components.triggers.tooltip.noFilterOnRecordCreationTrigger';
        default:
          return 'components.triggers.tooltip.noFilterOnRecordUpdateTrigger';
      }
    }
  }

  /**
   * Create filters filter group from value
   *
   * @param filter initial value
   * @returns filter as form group
   */
  private createFilterFormGroup(filter?: ResourceTriggersFilters) {
    return this.fb.group({
      filter: this.filtersService.createFilterGroup(
        get(filter, 'filter', null)
      ),
      triggers: this.fb.group({
        cronBased: get(filter, 'triggers.cronBased', false),
        onRecordCreation: get(filter, 'triggers.onRecordCreation', false),
        onRecordUpdate: get(filter, 'triggers.onRecordUpdate', false),
      }),
    });
  }
}
