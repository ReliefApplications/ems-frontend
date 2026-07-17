import { Component, Input, NgZone, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ApplicationService } from '../../../../services/application/application.service';
import { Application } from '../../../../models/application.model';
import { ContentType, Page } from '../../../../models/page.model';
import { Layout } from '../../../../models/layout.model';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { Dialog } from '@angular/cdk/dialog';
import get from 'lodash/get';

/**
 * Actions tab of grid widget configuration modal.
 */
@Component({
  selector: 'shared-tab-actions',
  templateUrl: './tab-actions.component.html',
  styleUrls: ['./tab-actions.component.scss'],
})
export class TabActionsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Widget reactive form group */
  @Input() formGroup!: UntypedFormGroup;
  /** Available fields */
  @Input() fields: any[] = [];
  /** Layouts currently used by the widget */
  @Input() layouts: Layout[] = [];
  /** Show select page id and checkbox for record id */
  public showSelectPage = false;
  /** Number of fields currently marked as read-only for inline edition */
  public readOnlyFieldsCount = 0;
  /** Available pages from the application */
  public pages: any[] = [];
  /** Grid actions */
  public actions = [
    {
      name: 'delete',
      text: 'components.widget.settings.grid.actions.delete',
      tooltip: 'components.widget.settings.grid.hint.actions.delete',
    },
    {
      name: 'history',
      text: 'components.widget.settings.grid.actions.show',
      tooltip: 'components.widget.settings.grid.hint.actions.show',
    },
    {
      name: 'convert',
      text: 'components.widget.settings.grid.actions.convert',
      tooltip: 'components.widget.settings.grid.hint.actions.convert',
    },
    {
      name: 'update',
      text: 'components.widget.settings.grid.actions.update',
      tooltip: 'components.widget.settings.grid.hint.actions.update',
    },
    {
      name: 'inlineEdition',
      text: 'components.widget.settings.grid.actions.inline',
      tooltip: 'components.widget.settings.grid.hint.actions.inline',
    },
    {
      name: 'addRecord',
      text: 'components.widget.settings.grid.actions.add',
      tooltip: 'components.widget.settings.grid.hint.actions.add',
      toolTipWarning: 'components.widget.settings.grid.warnings.add',
    },
    {
      name: 'export',
      text: 'components.widget.settings.grid.actions.export',
      tooltip: 'components.widget.settings.grid.hint.actions.export',
    },
    {
      name: 'import',
      text: 'components.widget.settings.grid.actions.import',
      tooltip: 'components.widget.settings.grid.hint.actions.import',
    },
    {
      name: 'showDetails',
      text: 'components.widget.settings.grid.actions.showDetails',
      tooltip: 'components.widget.settings.grid.hint.actions.showDetails',
    },
    {
      name: 'navigateToPage',
      text: 'components.widget.settings.grid.actions.goTo.label',
      tooltip: 'components.widget.settings.grid.hint.actions.goTo',
    },
  ];

  /**
   * Constructor of the grid component
   *
   * @param applicationService Application service
   * @param dialog Angular CDK dialog service
   * @param ngZone Angular NgZone, used to run code impacting the UI within Angular's zone
   */
  constructor(
    public applicationService: ApplicationService,
    private dialog: Dialog,
    private ngZone: NgZone
  ) {
    super();
  }

  ngOnInit(): void {
    this.showSelectPage =
      this.formGroup.controls.actions.get('navigateToPage')?.value;
    // Add available pages to the list of available keys
    const application = this.applicationService.application.getValue();
    this.pages = this.getPages(application);
    this.formGroup.controls.actions
      .get('navigateToPage')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => {
        this.showSelectPage = val;
      });
    // Track the number of fields marked as read-only for inline edition
    const readOnlyFields =
      this.formGroup.controls.actions.get('readOnlyFields');
    this.readOnlyFieldsCount = readOnlyFields?.value?.length || 0;
    readOnlyFields?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string[] | null) => {
        this.readOnlyFieldsCount = value?.length || 0;
      });
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
   * Open the modal allowing the admin to select which fields should
   * stay read-only during inline edition.
   */
  async openReadOnlyFieldsModal(): Promise<void> {
    const { ReadOnlyFieldsModalComponent } = await import(
      './read-only-fields-modal/read-only-fields-modal.component'
    );
    // Inline edition only displays the fields selected in the layouts, so
    // the modal should list those instead of all the queryable fields.
    const layoutFields: any[] = this.layouts.flatMap((layout) =>
      get(layout, 'query.fields', [])
    );
    const fields = layoutFields.length
      ? // Union of the fields of all layouts, deduplicated by name
        layoutFields.filter(
          (field, index) =>
            layoutFields.findIndex((f) => f.name === field.name) === index
        )
      : this.fields;
    this.ngZone.run(() => {
      const dialogRef = this.dialog.open<string[]>(
        ReadOnlyFieldsModalComponent,
        {
          data: {
            fields,
            readOnlyFields:
              this.formGroup.get('actions')?.get('readOnlyFields')?.value || [],
          },
        }
      );
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((readOnlyFields: string[] | undefined) => {
          if (readOnlyFields) {
            this.formGroup
              .get('actions')
              ?.get('readOnlyFields')
              ?.setValue(readOnlyFields);
          }
        });
    });
  }
}
