import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/** Model for dialog data */
interface DialogData {
  tile: any;
  template: any;
}

/** Component for a data tile */
@Component({
  selector: 'safe-tile-data',
  templateUrl: './tile-data.component.html',
  styleUrls: ['./tile-data.component.scss'],
})
/** Modal content to edit the settings of a component. */
export class SafeTileDataComponent implements OnInit, AfterViewInit {
  // === REACTIVE FORM ===
  tileForm?: FormGroup;

  // === TEMPLATE REFERENCE ===
  @ViewChild('settingsContainer', { read: ViewContainerRef })
  settingsContainer: any;

  /**
   * Constructor of a data tile
   *
   * @param dialogRef Reference to a dialog opened via the material dialog service
   * @param data The dialog data
   */
  constructor(
    public dialogRef: MatDialogRef<SafeTileDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  /** Once the template is ready, inject the settings component linked to the widget type passed as a parameter. */
  ngAfterViewInit(): void {
    const componentRef = this.settingsContainer.createComponent(
      this.data.template
    );
    componentRef.instance.tile = this.data.tile;
    componentRef.instance.change.subscribe((e: any) => {
      this.tileForm = e;
    });
  }

  /**
   * Closes the modal sending tile form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.tileForm?.getRawValue());
  }
}
