import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormWrapperModule, IconModule, TooltipModule } from '@oort-front/ui';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { createQueryForm } from '../../../query-builder/query-builder-forms';
import { QueryBuilderModule } from '../../../query-builder/query-builder.module';
import { SpinnerModule } from '@oort-front/ui';

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
  ],
})
export class ContextualFiltersSettingsComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() data!: DialogData;
  public filterFields: any[] = [];
  public editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    fixedOverflowWidgets: true,
  };
  public loading = true;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param queryBuilder The service used to build queries
   */
  constructor(private queryBuilder: QueryBuilderService) {}

  /**
   * On initialization of editor, format code
   *
   * @param editor monaco editor used for scss edition
   */
  public initEditor(editor: any): void {
    if (editor) {
      setTimeout(() => {
        editor
          .getAction('editor.action.formatDocument')
          .run()
          .finally(() => {
            const control = this.form.get('dashboardFilters');
            control?.markAsPristine();
          });
      }, 100);
    }
  }

  ngOnInit(): void {
    this.queryBuilder.availableQueries$.subscribe((res) => {
      if (res.length > 0) {
        const hasDataForm = this.data.form !== null;
        const queryName = hasDataForm
          ? this.data.form.value.name
          : this.queryBuilder.getQueryNameFromResourceName(
              this.data.resourceName
            );
        this.form = createQueryForm({
          name: queryName,
          fields: hasDataForm ? this.data.form.value.fields : [],
          sort: hasDataForm ? this.data.form.value.sort : {},
          filter: hasDataForm ? this.data.form.value.filter : {},
        });
        this.loading = false;
      }
    });
  }
}
/*
openResourceFieldsModal() {
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_SHORT_RESOURCE_BY_ID,
        variables: {
          id: this.model.obj.resource,
        },
      })
      .subscribe(async ({ data }) => {
        if (data.resource && data.resource.name) {
          const nameTrimmed = data.resource.name
            .replace(/\s/g, '')
            .toLowerCase();
          const { ConfigDisplayGridFieldsModalComponent } = await import(
            '../../../components/config-display-grid-fields-modal/config-display-grid-fields-modal.component'
          );
          const dialogRef = this.dialog.open(
            ConfigDisplayGridFieldsModalComponent,
            {
              data: {
                form: !this.model.obj.gridFieldsSettings
                  ? null
                  : this.convertFromRawToFormGroup(
                      this.model.obj.gridFieldsSettings
                    ),
                resourceName: nameTrimmed,
              },
            }
          );
          dialogRef.closed
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
              if (res && res.value.fields) {
                this.model.obj.gridFieldsSettings = res.getRawValue();
              }
            });
        }
      });
*/
