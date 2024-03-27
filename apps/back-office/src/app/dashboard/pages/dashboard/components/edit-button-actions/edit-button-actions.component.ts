import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DialogModule,
  FormWrapperModule,
  SelectMenuModule,
  ButtonModule,
  ToggleModule,
  DividerModule,
  TableModule,
  MenuModule,
  TooltipModule,
  IconModule,
} from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { EditorModule } from '@tinymce/tinymce-angular';
import {
  EditorControlComponent,
  ButtonActionT,
  UnsubscribeComponent,
  ApplicationService,
  Role,
  EmptyModule,
} from '@oort-front/shared';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

/** Component for editing a dashboard button action */
@Component({
  selector: 'app-edit-button-actions',
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
    DividerModule,
    TableModule,
    MenuModule,
    TooltipModule,
    IconModule,
    DragDropModule,
    EmptyModule,
  ],
  templateUrl: './edit-button-actions.component.html',
  styleUrls: ['./edit-button-actions.component.scss'],
})
export class EditButtonActionsComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /**
   * list of button actions from dashboard
   */
  private buttonActions: ButtonActionT[] = [];
  /**
   * Behaviour subject to track change in action buttons
   */
  datasource = new BehaviorSubject(this.buttonActions);

  /**
   * Search string
   */
  searchTerm = '';

  /** Columns to display */
  displayedColumns = ['dragDrop', 'name', 'roles', 'actions'];

  /**
   * Component for editing a dashboard button action
   *
   * @param dialogRef dialog reference
   * @param data data passed to the modal
   * @param data.buttonActions list of button actions
   * @param dialog dialog module for button edition / creation / deletion
   * @param translateService used to translate modal text
   * @param applicationService shared application service
   */
  constructor(
    public dialogRef: DialogRef<ButtonActionT[]>,
    @Inject(DIALOG_DATA) private data: { buttonActions: ButtonActionT[] },
    public dialog: Dialog,
    public translateService: TranslateService,
    public applicationService: ApplicationService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.data && this.data.buttonActions) {
      this.buttonActions = [...this.data.buttonActions];
      this.updateDatasource();
    }
  }

  /** Open modal to add new button action */
  public async onAddButtonAction() {
    const { EditButtonActionComponent } = await import(
      '../edit-button-action/edit-button-action.component'
    );
    const dialogRef = this.dialog.open<ButtonActionT | undefined>(
      EditButtonActionComponent
    );

    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (button) => {
        if (!button) return;
        this.buttonActions.push(button);
        this.updateDatasource();
      });
  }

  /**
   * Open modal to edit button action
   *
   * @param buttonAction Button action to edit
   */
  public async onEditButtonAction(buttonAction: ButtonActionT) {
    const { EditButtonActionComponent } = await import(
      '../edit-button-action/edit-button-action.component'
    );
    const dialogRef = this.dialog.open<ButtonActionT | undefined>(
      EditButtonActionComponent,
      { data: buttonAction }
    );

    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (button) => {
        if (!button) return;
        const index = this.buttonActions.indexOf(buttonAction);
        if (index > -1) {
          this.buttonActions[index] = button;
          this.updateDatasource();
        }
      });
  }

  /**
   * Removes button action
   *
   * @param buttonAction button Action
   */
  public async onDeleteButtonAction(buttonAction: ButtonActionT) {
    const { ConfirmModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: this.translateService.instant('common.deleteObject', {
          name: this.translateService.instant(
            'models.dashboard.buttonActions.one'
          ),
        }),
        content: this.translateService.instant(
          'models.dashboard.buttonActions.confirmDelete'
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
        const index = this.buttonActions.indexOf(buttonAction);
        if (index > -1) {
          this.buttonActions.splice(index, 1);
          this.updateDatasource();
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
      this.buttonActions,
      event.previousIndex,
      event.currentIndex
    );
    this.updateDatasource();
  }

  /** On click on the save button close the dialog with the form value */
  public onSubmit(): void {
    this.dialogRef.close(this.buttonActions);
  }

  /**
   * Updates the datasource to reflect the state of the buttonActions and to apply the filter
   */
  public updateDatasource() {
    let buttonActions: ButtonActionT[];

    console.log(this.buttonActions);
    if (this.searchTerm !== '') {
      buttonActions = this.buttonActions.filter((action) =>
        action.text.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      buttonActions = this.buttonActions;
    }
    this.datasource.next([...buttonActions]);
  }

  /**
   * Leave Modal
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
