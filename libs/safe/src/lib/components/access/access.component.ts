import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

/**
 * Component that is used to create the access management modals
 */
@Component({
  selector: 'safe-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss'],
})
export class SafeAccessComponent {
  // === PERMISSIONS LAYER OF CURRENT OBJECT ===
  @Input() access!: any;
  @Input() application?: string;

  // === DISPLAY ===
  @Input() menuItem = false;
  @Input() objectTypeName!: string;

  // === PASS THE RESULT TO PARENT COMPONENT ===
  @Output() save: EventEmitter<any> = new EventEmitter();

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {Dialog} dialog - MatDialog - This is the material service that is used to open modal dialogs with Material Design styling and animations.
   */
  constructor(private dialog: Dialog) {}

  /**
   * Function that on click displays the EditAccess modal. Once closed, emits the result if exists.
   */
  async onClick(): Promise<void> {
    const { SafeEditAccessComponent } = await import(
      './edit-access/edit-access.component'
    );
    const dialogRef = this.dialog.open(SafeEditAccessComponent, {
      data: {
        access: this.access,
        application: this.application,
        objectTypeName: this.objectTypeName,
      },
    });
    dialogRef.closed.subscribe((res) => {
      if (res) {
        this.save.emit(res);
      }
    });
  }
}
