import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ConfirmService,
  DashboardService,
  DashboardState,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { isArray } from 'lodash';
import { takeUntil } from 'rxjs';

/** Interface for the table element */
interface DashboardStateElement {
  state: DashboardState;
}

/**
 * Dashboard states component.
 */
@Component({
  selector: 'app-dashboard-states',
  templateUrl: './dashboard-states.component.html',
  styleUrls: ['./dashboard-states.component.scss'],
})
export class DashboardStatesComponent extends UnsubscribeComponent {
  /** List of states */
  public states: DashboardState[] = [];
  /** State elements for table */
  public statesElements: DashboardStateElement[] = [];
  /** Columns to display on table */
  public displayedColumns = ['name', 'value', 'actions'];

  /**
   * Dashboard states component.
   *
   * @param dashboardService Shared dashboard service
   * @param dialog Dialog service
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   */
  constructor(
    private dashboardService: DashboardService,
    public dialog: Dialog,
    private confirmService: ConfirmService,
    private translate: TranslateService
  ) {
    super();
    this.dashboardService.states$
      .pipe(takeUntil(this.destroy$))
      .subscribe((states: DashboardState[]) => {
        this.states = states;
        this.statesElements = this.setTableElements(states);
      });
  }

  /**
   * Open modal to add a new state
   */
  public async onAdd(): Promise<void> {
    const { StateModalComponent } = await import(
      './state-modal/state-modal.component'
    );
    const dialogRef = this.dialog.open(StateModalComponent);
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.dashboardService.setDashboardState(data.value, undefined, data.name);
    });
  }

  /**
   * Open modal to update selected state
   *
   * @param element element state from the table
   */
  public async onUpdate(element: DashboardStateElement): Promise<void> {
    const state = element.state;
    const { StateModalComponent } = await import(
      './state-modal/state-modal.component'
    );
    const dialogRef = this.dialog.open(StateModalComponent, {
      data: {
        name: state.name,
        value: state.value,
        id: state.id,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data) {
        this.dashboardService.setDashboardState(
          data.value,
          state.id,
          data.name
        );
      }
    });
  }

  /**
   * Delete selected state
   *
   * @param element element state from the table
   */
  public async onDelete(element: DashboardStateElement): Promise<void> {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('models.dashboard.states.delete.title'),
      content: this.translate.instant(
        'models.dashboard.states.delete.confirmationMessage',
        {
          state: element.state.name,
        }
      ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.dashboardService.deleteDashboardState(element.state.id);
      }
    });
  }

  /**
   * Check if state value on table is a array
   *
   * @param value state value
   * @returns if value is boolean
   */
  public isArray(value: any): boolean {
    return isArray(value);
  }

  /**
   * Serialize single table element from states
   *
   * @param state state to serialize
   * @returns serialized element
   */
  private setTableElement(state: DashboardState): DashboardStateElement {
    return {
      state,
    };
  }

  /**
   * Serialize list of table elements from states
   *
   * @param states states to serialize
   * @returns serialized elements
   */
  private setTableElements(states: DashboardState[]): DashboardStateElement[] {
    return states.map((x: DashboardState) => this.setTableElement(x));
  }
}
