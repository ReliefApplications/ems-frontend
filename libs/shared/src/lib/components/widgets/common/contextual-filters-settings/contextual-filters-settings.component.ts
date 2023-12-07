import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormWrapperModule, IconModule, TooltipModule } from '@oort-front/ui';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { QueryBuilderModule } from '../../../query-builder/query-builder.module';
import { SpinnerModule } from '@oort-front/ui';
import { FilterBuilderComponent } from './filter-builder/filter-builder.component';
import { Observable } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { Apollo } from 'apollo-angular';
import { ResourceQueryResponse } from '../../../../models/resource.model';
import { GET_RESOURCE } from '../../editor-settings/graphql/queries';

/**
 * Interface that describes the structure of the data shown in the dialog
 */
interface DialogData {
  form: any;
  resourceName: string;
}

/** Component to define the contextual filters of a widget or a map layer */
@Component({
  selector: 'shared-contextual-filters-settings',
  standalone: true,
  templateUrl: './contextual-filters-settings.component.html',
  styleUrls: ['./contextual-filters-settings.component.scss'],
  imports: [
    CommonModule,
    MonacoEditorModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    IconModule,
    TooltipModule,
    QueryBuilderModule,
    SpinnerModule,
    FilterBuilderComponent,
  ],
})
export class ContextualFiltersSettingsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  @Input() form!: FormGroup;
  /** resource id used to get information of dataFilter */
  @Input() resourceId!: any;
  @Input() canExpand = true;
  public dataFilter!: DialogData;
  public filterFields: any[] = [];
  public availableFields: any[] = [];
  public filteredQueries: any[] = [];
  public allQueries: any[] = [];
  public query: any;
  public showFilterBuilder = true;
  public formChange = false;

  /**
   * Getter for the available scalar fields
   *
   * @returns the available scalar fields
   */
  get availableScalarFields(): any[] {
    return this.availableFields.filter(
      (x) => x.type.kind === 'SCALAR' || x.type.kind === 'OBJECT'
    );
    // return this.availableFields.filter((x) => x.type.kind === 'SCALAR');
  }

  public editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    fixedOverflowWidgets: true,
  };
  public loading = true;
  // === FIELD EDITION ===
  public isField = false;
  @Output() closeField: EventEmitter<boolean> = new EventEmitter();
  // === QUERY BUILDER ===
  public availableQueries?: Observable<any[]>;
  public queryBuilderForm?: FormGroup;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param queryBuilder The service used to build queries
   * @param apollo Apollo client
   */
  constructor(
    private queryBuilder: QueryBuilderService,
    private apollo: Apollo
  ) {
    super();
  }

  ngOnInit(): void {
    this.getDataFilter();
    if (!this.dataFilter) {
      this.showFilterBuilder = false;
      return;
    }

    this.updateQueryBuilderForm();
  }

  /**
   * Set custom editors for contextFilters.
   */
  private updateForm(): void {
    this.form
      .get('contextFilters')
      ?.setValue(JSON.stringify(this.queryBuilderForm?.get('filter')?.value));
  }

  /**
   * Updates the query builder form
   */
  private updateQueryBuilderForm(): void {
    this.queryBuilder.availableQueries$.subscribe(() => {
      const hasDataForm = this.dataFilter.form !== null;
      const queryName = this.queryBuilder.getQueryNameFromResourceName(
        this.dataFilter.resourceName
      );
      this.queryBuilderForm = new FormGroup({
        name: new FormControl(queryName),
        filter: new FormControl(hasDataForm ? this.dataFilter.form : {}),
      });
      this.loading = false;
    });

    this.queryBuilderForm?.valueChanges.subscribe(() => {
      this.updateForm();
    });
  }

  /**
   * Gets the data filter from the resource
   */
  private getDataFilter(): void {
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id: this.resourceId,
        },
      })
      .subscribe(({ data }) => {
        if (data.resource && data.resource.name) {
          const nameTrimmed = data.resource.name
            .replace(/\s/g, '')
            .toLowerCase();
          const formValue = this.form.get('contextFilters')?.value;
          this.dataFilter = {
            form: typeof formValue === 'string' ? JSON.parse(formValue) : null,
            resourceName: nameTrimmed,
          };
        }
      });
  }
}
