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
  ActionButton,
  UnsubscribeComponent,
  ApplicationService,
  Role,
  EmptyModule,
  Dashboard,
} from '@oort-front/shared';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

/** Component for editing dashboard action buttons */
@Component({
  selector: 'app-edit-action-buttons-modal',
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
  templateUrl: './edit-action-buttons-modal.component.html',
  styleUrls: ['./edit-action-buttons-modal.component.scss'],
})
export class EditActionButtonsModalComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** List of action buttons from dashboard */
  public actionButtons: ActionButton[] = [];
  /** Behavior subject to track change in action buttons */
  public datasource = new BehaviorSubject(this.actionButtons);
  /** Current search string */
  public searchTerm = '';
  /** Columns to display */
  public displayedColumns = ['dragDrop', 'name', 'roles', 'actions'];

  /**
   * Component for editing dashboard action buttons
   *
   * @param dialogRef dialog reference
   * @param data data passed to the modal
   * @param data.dashboard Current dashboard
   * @param dialog dialog module for button edition / creation / deletion
   * @param translateService used to translate modal text
   * @param applicationService shared application service
   */
  constructor(
    public dialogRef: DialogRef<ActionButton[]>,
    @Inject(DIALOG_DATA)
    private data: { dashboard: Dashboard },
    public dialog: Dialog,
    public translateService: TranslateService,
    public applicationService: ApplicationService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.data && this.data.dashboard?.buttons) {
      this.actionButtons = [...this.data.dashboard.buttons];
      this.updateTable();
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /** Open modal to add new action button */
  public async onAddActionButton() {
    const { EditActionButtonModalComponent } = await import(
      '../edit-action-button-modal/edit-action-button-modal.component'
    );
    const dialogRef = this.dialog.open<ActionButton | undefined>(
      EditActionButtonModalComponent,
      {
        data: {
          dashboard: this.data.dashboard,
        },
        disableClose: true,
      }
    );

    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (button) => {
        if (!button) return;
        this.actionButtons.push(button);
        this.searchTerm = '';
        this.updateTable();
      });
  }

  /**
   * Open modal to edit action button
   *
   * @param actionButton action button to edit
   */
  public async onEditActionButton(actionButton: ActionButton) {
    const { EditActionButtonModalComponent } = await import(
      '../edit-action-button-modal/edit-action-button-modal.component'
    );
    const dialogRef = this.dialog.open<ActionButton | undefined>(
      EditActionButtonModalComponent,
      {
        data: {
          button: actionButton,
          dashboard: this.data.dashboard,
        },
        disableClose: true,
      }
    );

    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (button) => {
        if (!button) return;
        const index = this.actionButtons.indexOf(actionButton);
        if (index > -1) {
          this.actionButtons[index] = button;
          this.updateTable();
        }
      });
  }

  /**
   * Removes action button
   *
   * @param actionButton action button
   */
  public async onDeleteActionButton(actionButton: ActionButton) {
    const { ConfirmModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('common.deleteObject', {
          name: this.translateService.instant(
            'models.dashboard.actionButtons.one'
          ),
        }),
        content: this.translateService.instant(
          'models.dashboard.actionButtons.confirmDelete'
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

    dialogRef.closed.subscribe((value: any) => {
      if (value) {
        const index = this.actionButtons.indexOf(actionButton);
        if (index > -1) {
          this.actionButtons.splice(index, 1);
          this.searchTerm = '';
          this.updateTable();
        }
      }
    });
  }

  /**
   * Get the roles names from the roles ids
   *
   * @param roles ids of roles
   * @returns names of roles
   */
  getCorrespondingRoles(roles: string[]) {
    return this.applicationService.application.value?.roles
      ?.filter((role: Role) => roles.includes(role.id ?? ''))
      .map((role: Role) => role.title)
      .join(', ');
  }

  /**
   * Moves item in array
   *
   * @param event Drag and drop event
   */
  drop(event: any) {
    if (this.searchTerm) return;
    moveItemInArray(
      this.actionButtons,
      event.previousIndex,
      event.currentIndex
    );
    this.updateTable();
  }

  /** On click on the save button close the dialog with the form value */
  public onSubmit(): void {
    this.dialogRef.close(this.actionButtons);
  }

  /**
   * Updates the datasource to reflect the state of the action buttons and to apply the filter
   */
  public updateTable() {
    let actionButtons: ActionButton[];

    if (this.searchTerm !== '') {
      actionButtons = this.actionButtons.filter((action) =>
        action.text.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      actionButtons = this.actionButtons;
    }
    this.datasource.next([...actionButtons]);
  }
}
