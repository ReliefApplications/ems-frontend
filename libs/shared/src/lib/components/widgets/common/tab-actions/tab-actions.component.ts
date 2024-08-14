import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ApplicationService } from '../../../../services/application/application.service';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { DashboardState } from '../../../../models/dashboard.model';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';

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
  /** Show select dashboard state */
  public showSelectState = false;
  /** Available dashboard states */
  public states: DashboardState[] = [];
  /** Show select page id and checkbox for record id */
  public showSelectPage = false;
  /** Available pages from the application */
  public pages: any[] = [];
  /** Grid actions */
  public actions = [
    {
      name: 'showDetails',
      text: 'components.widget.settings.grid.actions.showDetails',
      tooltip: 'components.widget.settings.grid.hint.actions.showDetails',
      editLabel: true,
      label: 'components.widget.settings.grid.actions.details.label',
      placeholder: 'components.widget.settings.grid.actions.details.text',
    },
    {
      name: 'delete',
      text: 'components.widget.settings.grid.actions.delete.text',
      tooltip: 'components.widget.settings.grid.hint.actions.delete',
      editLabel: true,
      label: 'components.widget.settings.grid.actions.delete.label',
      placeholder: 'common.delete',
    },
    {
      name: 'history',
      text: 'components.widget.settings.grid.actions.show.text',
      tooltip: 'components.widget.settings.grid.hint.actions.show',
      editLabel: true,
      label: 'components.widget.settings.grid.actions.show.label',
      placeholder: 'common.history',
    },
    {
      name: 'convert',
      text: 'components.widget.settings.grid.actions.convert.text',
      tooltip: 'components.widget.settings.grid.hint.actions.convert',
      editLabel: true,
      label: 'components.widget.settings.grid.actions.convert.label',
      placeholder: 'models.record.convert',
    },
    {
      name: 'update',
      text: 'components.widget.settings.grid.actions.update.text',
      tooltip: 'components.widget.settings.grid.hint.actions.update',
      editLabel: true,
      label: 'components.widget.settings.grid.actions.update.label',
      placeholder: 'common.update',
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
      name: 'mapSelected',
      text: 'components.widget.settings.grid.actions.mapSelected',
      tooltip: 'components.widget.settings.grid.hint.actions.mapSelectedRows',
    },
    {
      name: 'mapView',
      text: 'components.widget.settings.grid.actions.mapView',
      tooltip: 'components.widget.settings.grid.hint.actions.mapViewRows',
    },
    {
      name: 'automaticallyMapSelected',
      text: 'components.widget.settings.grid.actions.automaticallyMapSelected',
      tooltip:
        'components.widget.settings.grid.hint.actions.automaticallyMapSelectedRows',
    },
    {
      name: 'automaticallyMapView',
      text: 'components.widget.settings.grid.actions.automaticallyMapView',
      tooltip:
        'components.widget.settings.grid.hint.actions.automaticallyMapViewRows',
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
   * @param dashboardService Shared dashboard service
   */
  constructor(
    public applicationService: ApplicationService,
    private dashboardService: DashboardService
  ) {
    super();
  }

  ngOnInit(): void {
    this.showSelectPage =
      this.formGroup.controls.actions.get('navigateToPage')?.value;
    // Add available pages to the list of available keys
    this.pages = this.applicationService.getPages();
    this.states = this.dashboardService.states.getValue() || [];
    this.formGroup.controls.actions
      .get('navigateToPage')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => {
        this.showSelectPage = val;
      });
  }
}
