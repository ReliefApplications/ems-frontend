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
  DashboardTemplate,
} from '@oort-front/shared';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
} from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Apollo } from 'apollo-angular';
import { GET_DASHBOARDS_NAMES } from '../../graphql/queries';

/**
 * Modal to manage existing dashboard templates.
 * Templates are only removed when clicking on save.
 */
@Component({
  selector: 'app-manage-templates-modal',
  templateUrl: './manage-templates-modal.component.html',
  styleUrls: ['./manage-templates-modal.component.scss'],
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
    TableModule,
  ],
})
export class ManageTemplateModalComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** List of action buttons from dashboard */
  public dashboardTemplates: DashboardTemplate[] = [];
  /** Behavior subject to track change in action buttons */
  public dataSource = new BehaviorSubject(this.dashboardTemplates);
  /** Search control */
  public searchControl: FormControl = new FormControl();
  /** Loading indicator */
  public loading = false;
  /** Table columns */
  public displayedColumns: string[] = ['name', 'actions'];

  /**
   * Component for editing dashboard templates
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
      .subscribe(() => {
        this.updateTable();
      });
    if (this.data && this.data.dashboardTemplates) {
      this.dashboardTemplates = this.data.dashboardTemplates;
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
    this.dataSource.next(this.dashboardTemplates);

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
        this.dataSource.next(this.dashboardTemplates);
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

  /** On click on the save button close the dialog with the form value */
  public onSubmit(): void {
    this.dialogRef.close(this.dashboardTemplates);
  }

  /**
   * Updates the dataSource to reflect the state of the action buttons and to apply the filter
   */
  public updateTable() {
    let templates: DashboardTemplate[];
    const searchTerm = this.searchControl.value;

    if (searchTerm !== '') {
      templates = this.dashboardTemplates.filter((template) =>
        template.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      templates = this.dashboardTemplates;
    }
    this.dataSource.next([...templates]);
  }
}
