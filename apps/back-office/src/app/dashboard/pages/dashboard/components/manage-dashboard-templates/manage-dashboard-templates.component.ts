import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DialogModule,
  FormWrapperModule,
  ButtonModule,
  DividerModule,
  TableModule,
  MenuModule,
  TooltipModule,
  IconModule,
  SpinnerModule,
} from '@oort-front/ui';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import {
  UnsubscribeComponent,
  EmptyModule,
  DashboardsQueryResponse,
} from '@oort-front/shared';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DashboardTemplate } from './dashboard-template-type';
import { Apollo } from 'apollo-angular';
import { GET_DASHBOARDS_NAMES } from '../../graphql/queries';

/** Modal to manage existing dashboard templates */
@Component({
  selector: 'app-manage-dashboard-templates',
  templateUrl: './manage-dashboard-templates.component.html',
  styleUrls: ['./manage-dashboard-templates.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    TranslateModule,
    FormWrapperModule,
    ButtonModule,
    DividerModule,
    TableModule,
    MenuModule,
    TooltipModule,
    IconModule,
    DragDropModule,
    EmptyModule,
    ReactiveFormsModule,
    SpinnerModule,
  ],
})
export class ManageDashboardTemplatesComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** List of button actions from dashboard */
  public dashboardTemplates: DashboardTemplate[] = [];
  /** Search control */
  public searchControl: FormControl = new FormControl();
  /** Search string, delayed from search control */
  public searchTerm = '';
  /** Loading indicator */
  public loading = false;

  /**
   * Component for editing dashboard dashboard templates
   *
   * @param dialogRef dialog reference
   * @param data data passed to the modal
   * @param data.dashboardTemplates list of dashboard templates
   * @param dialog dialog module for button edition / creation / deletion
   * @param translateService used to translate modal text
   * @param apollo Apollo service
   */
  constructor(
    public dialogRef: DialogRef<DashboardTemplate[]>,
    @Inject(DIALOG_DATA)
    private data: { dashboardTemplates: DashboardTemplate[] },
    public dialog: Dialog,
    public translateService: TranslateService,
    public apollo: Apollo
  ) {
    super();
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
      });
    if (this.data && this.data.dashboardTemplates) {
      this.dashboardTemplates = [...this.data.dashboardTemplates];
      this.getDashboardNames();
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /** get dashboard names for templates using records */
  public getDashboardNames() {
    const recordIds = this.dashboardTemplates
      .map((template) => {
        if ('record' in template) {
          return template.content;
        }
        return null;
      })
      .filter(Boolean);

    // Assign names for elements regardless of records
    this.dashboardTemplates = this.dashboardTemplates.map((template) => ({
      ...template,
      ...('element' in template && { name: template.element }),
    }));

    // Only execute the query if there are records
    if (recordIds.length > 0) {
      this.loading = true;
      firstValueFrom(
        this.apollo.query<DashboardsQueryResponse>({
          query: GET_DASHBOARDS_NAMES,
          variables: { ids: recordIds },
        })
      ).then(({ data }) => {
        this.loading = false;
        const dashboardMap = new Map(
          data.dashboards.map((dashboard) => [dashboard.id, dashboard.name])
        );

        // Update names for templates with records
        this.dashboardTemplates = this.dashboardTemplates.map((template) => ({
          ...template,
          ...('record' in template && {
            name: dashboardMap.get(template.content),
          }),
        }));
      });
    }
  }

  /**
   * Removes dashboard template
   *
   * @param dashboardTemplate Dashboard template
   */
  public async onDeleteDashboardTemplate(dashboardTemplate: DashboardTemplate) {
    const { ConfirmModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('common.deleteObject', {
          name: 'Dashboard template',
        }),
        content: this.translateService.instant(
          'components.templates.delete.confirmationMessage',
          { name: dashboardTemplate.name }
        ),
        confirmText: this.translateService.instant(
          'components.confirmModal.delete'
        ),
        cancelText: this.translateService.instant(
          'components.confirmModal.cancel'
        ),
        confirmVariant: 'danger',
      },
    });

    dialogRef.closed.subscribe((template: any) => {
      if (template) {
        const index = this.dashboardTemplates.indexOf(dashboardTemplate);
        if (index > -1) {
          this.dashboardTemplates.splice(index, 1);
          this.searchControl.setValue('');
        }
      }
    });
  }

  /**
   * Checks if dashboard template name matches search term
   *
   * @param templateName name of the dashboard template
   * @returns true if template name matches search, else false
   */
  public matchesSearch(templateName: string) {
    return this.searchTerm === ''
      ? true
      : templateName.includes(this.searchTerm);
  }

  /** On click on the save button close the dialog with the form value */
  public onSubmit(): void {
    this.dialogRef.close(this.dashboardTemplates);
  }
}
