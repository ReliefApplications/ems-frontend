import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  AfterViewInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  tile: any;
  template: any;
}

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

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public dialogRef: MatDialogRef<SafeTileDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  /** Once the template is ready, inject the settings component linked to the widget type passed as a parameter. */
  ngAfterViewInit(): void {
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      this.data.template
    );
    const componentRef = this.settingsContainer.createComponent(factory);
    componentRef.instance.tile = this.data.tile;
    componentRef.instance.change.subscribe((e: any) => {
      this.tileForm = e;
    });
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the modal sending tile form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.tileForm?.getRawValue());
  }
}
