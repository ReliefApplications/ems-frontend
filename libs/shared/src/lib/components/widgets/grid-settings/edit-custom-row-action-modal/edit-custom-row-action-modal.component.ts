import { Component, Inject, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlertModule,
  ButtonModule,
  DialogModule,
  DividerModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  TabsModule,
  ToggleModule,
  TooltipModule,
  categories as ButtonCategories,
  variants as ButtonVariants,
  SpinnerModule,
} from '@oort-front/ui';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@tinymce/tinymce-angular';
import { EditorControlComponent } from '../../../controls/editor-control/editor-control.component';
import { LocalizedInputComponent } from '../../../controls/localized-input/localized-input.component';
import { LocalizePipe } from '../../../../pipes/localize/localize.pipe';
import { QueryBuilderModule } from '../../../query-builder/query-builder.module';
import { ActionButton } from '../../grid/action-button.type';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { RawEditorSettings } from 'tinymce';
import { INLINE_EDITOR_CONFIG } from '../../../../const/tinymce.const';
import { Role } from '../../../../models/user.model';
import { Router } from '@angular/router';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { EditorService } from '../../../../services/editor/editor.service';
import { DataTemplateService } from '../../../../services/data-template/data-template.service';
import { ApplicationService } from '../../../../services/application/application.service';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { Application } from '../../../../models/application.model';
import { ContentType, Page } from '../../../../models/page.model';
import { Form } from '../../../../models/form.model';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../../models/resource.model';
import { GridSettingsFormFactory } from '../grid-settings.forms';
import { FilterModule } from '../../../filter/filter.module';
import { Apollo } from 'apollo-angular';
import { takeUntil } from 'rxjs';
import { GET_RESOURCE_METADATA } from './graphql/queries';

/** Dialog data interface */
interface DialogData {
  resource: Resource;
  button: ActionButton;
}

/**
 * Edit custom row action modal component.
 */
@Component({
  selector: 'shared-edit-custom-row-action-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    SelectMenuModule,
    ButtonModule,
    ToggleModule,
    EditorModule,
    EditorControlComponent,
    LocalizedInputComponent,
    LocalizePipe,
    DividerModule,
    TabsModule,
    IconModule,
    TooltipModule,
    QueryBuilderModule,
    AlertModule,
    FilterModule,
    SpinnerModule,
  ],
  templateUrl: './edit-custom-row-action-modal.component.html',
  styleUrls: ['./edit-custom-row-action-modal.component.scss'],
})
export class EditCustomRowActionModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Form group */
  public form: FormGroup;
  /** Button variants */
  public variants = ButtonVariants;
  /** Button categories */
  public categories = ButtonCategories;
  /** Is the action new */
  public isNew: boolean;
  /** tinymce href editor */
  public hrefEditor: RawEditorSettings = INLINE_EDITOR_CONFIG;
  /** Roles from current application */
  public roles: Role[];
  /** Fields, of current grid resource */
  public gridResourceFields: any[] = [];
  /** Edit record template list */
  public editRecordTemplates: Form[] = [];
  /** Available pages from the application for targetPage selection */
  public pages: any[] = [];
  /** Filters available to set filters from */
  public filterFields: any[] = [];
  /** Loading state */
  public loading = true;

  /**
   * Edit custom row action modal component.
   *
   * @param dialogRef Dialog reference
   * @param data Dialog data
   * @param editorService Shared editor service
   * @param dataTemplateService Data template service
   * @param router Angular router
   * @param applicationService Shared application service
   * @param queryBuilder Shared query builder
   * @param injector Angular injector
   * @param apollo Apollo service
   */
  constructor(
    public dialogRef: DialogRef<ActionButton>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private editorService: EditorService,
    private dataTemplateService: DataTemplateService,
    private router: Router,
    public applicationService: ApplicationService,
    private queryBuilder: QueryBuilderService,
    private injector: Injector,
    private apollo: Apollo
  ) {
    super();
    this.roles = this.applicationService.application.value?.roles || [];
    const factory = new GridSettingsFormFactory(this.injector, this.destroy$);
    this.form = factory.createCustomRowActionFormGroupForEdition(data.button);
    this.isNew = !data.button;

    // Set the editor base url based on the environment file
    this.hrefEditor.base_url = editorService.url;
    // Set the editor language
    this.hrefEditor.language = editorService.language;
  }

  ngOnInit(): void {
    // Build list of pages for autocompletion in navigation settings
    this.editorService.addCalcAndKeysAutoCompleter(
      this.hrefEditor,
      this.dataTemplateService.getAutoCompleterPageKeys()
    );
    // Build list of pages for targetPage selection
    this.pages = this.getPages(this.applicationService.application.getValue());
    // Populate templates & fields from resource
    this.editRecordTemplates = this.data.resource.forms || [];
    this.gridResourceFields = this.queryBuilder.getFields(
      this.data.resource.queryName as string
    );
    // Get filter fields
    this.getFilterFields();
  }

  /** On click on the preview button open the href */
  public preview(): void {
    let href = this.form.get('action.navigateTo.targetUrl.href')?.value;
    let isNewTab =
      this.form.get('action.navigateTo.targetUrl.openInNewTab')?.value ?? true;
    if (!href) {
      href = this.form.get(
        'action.cloneRecord.onSave.navigateTo.targetUrl.href'
      )?.value;
      isNewTab =
        this.form.get(
          'action.cloneRecord.onSave.navigateTo.targetUrl.openInNewTab'
        )?.value ?? true;
    }
    if (href) {
      //regex to verify if it's a page id key
      const regex = /{{page\((.*?)\)}}/;
      const match = href.match(regex);
      if (match) {
        href = this.dataTemplateService.getButtonLink(match[1]);
      }
      if (isNewTab) window.open(href, '_blank');
      else this.router.navigate([href]);
    }
  }

  /** On click on the save button close the dialog with the form value */
  public onSubmit(): void {
    const button: ActionButton = {
      columnLabel: this.form.get('general.columnLabel')?.value,
      text: this.form.get('general.buttonText')?.value,
      hasRoleRestriction: this.form.get('general.hasRoleRestriction')?.value,
      roles: this.form.get('general.roles')?.value,
      category: this.form.get('general.category')?.value,
      variant: this.form.get('general.variant')?.value,
      // If navigateTo enabled
      ...(this.form.get('action.navigateTo.enabled')?.value && {
        previousPage: this.form.get('action.navigateTo.previousPage')?.value,
        // If targetUrl enabled
        ...(this.form.get('action.navigateTo.targetUrl.enabled')?.value && {
          href: this.form.get('action.navigateTo.targetUrl.href')?.value,
          openInNewTab: this.form.get(
            'action.navigateTo.targetUrl.openInNewTab'
          )?.value,
        }),
      }),
      // If editRecord enabled
      ...(this.form.get('action.editRecord.enabled')?.value && {
        editRecord: {
          template: this.form.get('action.editRecord.template')?.value,
        },
      }),
      // If cloneRecord enabled
      ...(this.form.get('action.cloneRecord.enabled')?.value && {
        cloneRecord: {
          template: this.form.get('action.cloneRecord.template')?.value,
          onSave: {
            ...(this.form.get('action.cloneRecord.onSave.navigateTo.enabled')
              ?.value && {
              navigateTo: {
                // If targetPage enabled
                ...(this.form.get(
                  'action.cloneRecord.onSave.navigateTo.targetPage.enabled'
                )?.value && {
                  targetPage: {
                    pageUrl: this.form.get(
                      'action.cloneRecord.onSave.navigateTo.targetPage.pageUrl'
                    )?.value,
                    field: this.form.get(
                      'action.cloneRecord.onSave.navigateTo.targetPage.field'
                    )?.value,
                  },
                }),
                // If targetUrl enabled
                ...(this.form.get(
                  'action.cloneRecord.onSave.navigateTo.targetUrl.enabled'
                )?.value && {
                  targetUrl: {
                    href: this.form.get(
                      'action.cloneRecord.onSave.navigateTo.targetUrl.href'
                    )?.value,
                    openInNewTab: this.form.get(
                      'action.cloneRecord.onSave.navigateTo.targetUrl.openInNewTab'
                    )?.value,
                  },
                }),
              },
            }),
          },
        },
      }),
      // Filter
      filter: this.form.get('filter')?.value,
    };

    this.dialogRef.close(button);
  }

  /**
   * Get available pages from app
   *
   * @param application application
   * @returns list of pages and their url
   */
  private getPages(application: Application | null) {
    return (
      application?.pages?.map((page: any) => ({
        id: page.id,
        name: page.name,
        urlParams: this.getPageUrlParams(application, page),
        placeholder: `{{page(${page.id})}}`,
      })) || []
    );
  }

  /**
   * Get page url params
   *
   * @param application application
   * @param page page to get url from
   * @returns url of the page
   */
  private getPageUrlParams(application: Application, page: Page): string {
    const applicationPath =
      this.applicationService.getApplicationPath(application);
    return page.type === ContentType.form
      ? `${applicationPath}/${page.type}/${page.id}`
      : `${applicationPath}/${page.type}/${page.content}`;
  }

  /**
   * Get filter fields for the resource
   */
  private getFilterFields() {
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE_METADATA,
        variables: {
          id: this.data.resource.id,
        },
        fetchPolicy: 'cache-first',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.filterFields = data.resource.metadata ?? [];
        this.loading = false;
      });
  }
}
