import { Component, inject, Injector, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ButtonModule,
  DividerModule,
  FormWrapperModule,
  IconModule,
  MenuModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { EmptyModule } from '../../../ui/empty/empty.module';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { ApplicationService } from '../../../../services/application/application.service';
import { Role } from '../../../../models/user.model';
import { ActionButton } from '../../grid/action-button.type';
import { Dialog } from '@angular/cdk/dialog';
import { Resource } from '../../../../models/resource.model';
import { GridSettingsFormFactory } from '../grid-settings.forms';

/**
 * Custom row actions settings component.
 */
@Component({
  selector: 'shared-custom-row-actions',
  standalone: true,
  imports: [
    CommonModule,
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
  templateUrl: './custom-row-actions.component.html',
  styleUrls: ['./custom-row-actions.component.scss'],
})
export class CustomRowActionsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Widget form group */
  @Input() formGroup!: ReturnType<
    typeof GridSettingsFormFactory.prototype.createGridWidgetFormGroup
  >;
  /** Resource associated with the grid */
  @Input() resource: Resource | null = null;
  /** List of action buttons from dashboard */
  public actionButtons: ActionButton[] = [];
  /** Behavior subject to track change in action buttons */
  public datasource = new BehaviorSubject(this.actionButtons);
  /** Current search string */
  public searchTerm = '';
  /** Columns to display */
  public displayedColumns = [
    'dragDrop',
    'columnLabel',
    'text',
    'roles',
    'actions',
  ];
  /** Shared application service */
  private applicationService = inject(ApplicationService);
  /** Translate service */
  private translate = inject(TranslateService);
  /** Dialog service */
  private dialog = inject(Dialog);
  /** Angular injector */
  private injector = inject(Injector);
  /** Form factory */
  private formFactory = new GridSettingsFormFactory(
    this.injector,
    this.destroy$
  );

  ngOnInit(): void {
    this.actionButtons =
      (this.formGroup.controls.customRowActions.value as any[]) || [];
    this.updateTable();
  }

  /**
   * Add new action button
   */
  public async onAddActionButton() {
    const { EditCustomRowActionModalComponent } = await import(
      '../edit-custom-row-action-modal/edit-custom-row-action-modal.component'
    );
    const dialogRef = this.dialog.open<ActionButton | undefined>(
      EditCustomRowActionModalComponent,
      {
        data: {
          resource: this.resource,
          disableClose: true,
        },
      }
    );

    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (button) => {
        if (!button) return;
        this.formGroup.controls.customRowActions.push(
          this.formFactory.createCustomRowActionFormGroup(button)
        );
        this.actionButtons.push(button);
        this.searchTerm = '';
        this.updateTable();
      });
  }

  /**
   * Edit action button
   *
   * @param actionButton Action button to edit
   */
  public async onEditActionButton(actionButton: ActionButton) {
    const { EditCustomRowActionModalComponent } = await import(
      '../edit-custom-row-action-modal/edit-custom-row-action-modal.component'
    );
    const dialogRef = this.dialog.open<ActionButton | undefined>(
      EditCustomRowActionModalComponent,
      {
        data: {
          resource: this.resource,
          button: actionButton,
          disableClose: true,
        },
      }
    );

    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (button) => {
        if (!button) return;
        const index = this.actionButtons.indexOf(actionButton);
        if (index > -1) {
          this.formGroup.controls.customRowActions.setControl(
            index,
            this.formFactory.createCustomRowActionFormGroup(button)
          );
          this.actionButtons[index] = button;
          this.updateTable();
        }
      });
  }

  /**
   * Delete action button
   *
   * @param actionButton Action button to delete
   */
  public async onDeleteActionButton(actionButton: ActionButton) {
    const { ConfirmModalComponent } = await import(
      '../../../confirm-modal/confirm-modal.component'
    );
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('models.dashboard.actionButtons.one'),
        }),
        content: this.translate.instant(
          'models.dashboard.actionButtons.confirmDelete'
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
        confirmVariant: 'danger',
      },
    });

    dialogRef.closed.subscribe((value: any) => {
      if (value) {
        const index = this.actionButtons.indexOf(actionButton);
        if (index > -1) {
          this.formGroup.controls.customRowActions.removeAt(index);
          this.actionButtons.splice(index, 1);
          this.searchTerm = '';
          this.updateTable();
        }
      }
    });
  }

  /**
   * Duplication action button
   *
   * @param actionButton Action button to duplicate
   */
  public async onDuplicateActionButton(actionButton: ActionButton) {
    const newActionButton = structuredClone(actionButton);
    newActionButton.text = `${newActionButton.text} (${this.translate.instant(
      'common.copy'
    )})`;
    this.formGroup.controls.customRowActions.push(
      this.formFactory.createCustomRowActionFormGroup(newActionButton)
    );
    this.actionButtons.push(newActionButton);
    this.searchTerm = '';
    this.updateTable();
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

  /**
   * Updates the datasource to reflect the state of the action buttons and to apply the filter
   */
  public updateTable() {
    let actionButtons: any[];

    if (this.searchTerm !== '') {
      actionButtons = this.actionButtons.filter(
        (action) =>
          action.columnLabel
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          action.text.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      actionButtons = this.actionButtons;
    }
    this.datasource.next([...actionButtons]);
  }
}
