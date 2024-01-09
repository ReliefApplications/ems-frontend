import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ListFilterComponent } from '../../list-filter/list-filter.component';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { Role } from '../../../models/user.model';

/**
 * Filter used by the resources component
 */
@Component({
  standalone: true,
  selector: 'shared-users-filter',
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.scss'],
  imports: [
    CommonModule,
    FormWrapperModule,
    FormsModule,
    ReactiveFormsModule,
    ListFilterComponent,
    SelectMenuModule,
    ButtonModule,
    TranslateModule,
  ],
})
export class UsersFilterComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Loading state */
  @Input() loading = false;
  /** Roles list */
  @Input() roles: Role[] = [];
  /** Event emitted when the user clicks on the filter button */
  @Output() filter = new EventEmitter<any>();
  /** Reference to expanded filter template */
  @ViewChild('expandedFilter')
  expandedFilter!: TemplateRef<any>;

  /** Form */
  public form = this.fb.group({
    role: [null],
  });
  /** Show expanded filter */
  public show = false;

  /**
   * FilterComponent constructor.
   *
   * @param fb Used to create reactive forms.
   */
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.emitFilter(value);
      });
  }

  /**
   * Emits the filter value, so the main component can get it.
   *
   * @param value Value to be emitted.
   */
  private emitFilter(value: any): void {
    const filters: any[] = [];
    if (value.search) {
      filters.push({
        logic: 'or',
        filters: [
          { field: 'name', operator: 'contains', value: value.search },
          { field: 'username', operator: 'contains', value: value.search },
        ],
      });
    }
    if (value.role) {
      filters.push({
        field: 'roles',
        operator: 'contains',
        value: [value.role],
      });
    }
    const filter = {
      logic: 'and',
      filters,
    };
    this.filter.emit(filter);
  }

  /**
   * Clears form.
   */
  clear(): void {
    this.form.reset();
  }
}
