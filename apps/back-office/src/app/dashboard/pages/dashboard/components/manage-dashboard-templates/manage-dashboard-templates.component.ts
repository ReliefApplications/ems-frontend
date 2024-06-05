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
} from '@oort-front/ui';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import {
  UnsubscribeComponent,
  EmptyModule,
  DashboardsQueryResponse,
} from '@oort-front/shared';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
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
  ],
})
export class ManageDashboardTemplatesComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** List of button actions from dashboard */
  public dashboardTemplates: DashboardTemplate[] = [];
  /** Behavior subject to track change in dashboard templates */
  public datasource = new BehaviorSubject(this.dashboardTemplates);
  /** Search string */
  public searchTerm = '';

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
    firstValueFrom(
      this.apollo.query<DashboardsQueryResponse>({
        query: GET_DASHBOARDS_NAMES,
        variables: {
          ids: this.dashboardTemplates
            .map((template) => {
              if ('record' in template) {
                return template.content;
              }
              return;
            })
            .filter(Boolean),
        },
      })
    ).then(({ data }) => {
      const dashboardMap = new Map(
        data.dashboards.map((dashboard) => [dashboard.id, dashboard.name])
      );
      this.dashboardTemplates = this.dashboardTemplates.map((template) => ({
        ...template,
        ...('element' in template && {
          name: template.element,
        }),
        ...('record' in template && {
          name: dashboardMap.get(template.content),
        }),
      }));
    });
  }

  /**
   * Removes dashboard template
   *
   * @param dashboardTemplate Dashboard template
   */
  public async onDeleteButtonAction(dashboardTemplate: DashboardTemplate) {
    const { ConfirmModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('common.deleteObject', {
          name: 'Dashboard template',
        }),
        content: 'you sure you wanna delete Template bruh?',
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
          this.searchTerm = '';
        }
      }
    });
  }

  /** On click on the save button close the dialog with the form value */
  public onSubmit(): void {
    this.dialogRef.close(this.dashboardTemplates);
  }
}
