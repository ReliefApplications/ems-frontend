import { Component, OnInit, Inject, ViewChild, ViewContainerRef,
  ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'who-tile-data',
  templateUrl: './tile-data.component.html',
  styleUrls: ['./tile-data.component.scss']
})
/*  Modal content to edit the settings of a component.
*/
export class WhoTileDataComponent implements OnInit, AfterViewInit {

  // === REACTIVE FORM ===
  tileForm: FormGroup = new FormGroup({});

  // === TEMPLATE REFERENCE ===
  @ViewChild('settingsContainer', { read: ViewContainerRef }) settingsContainer: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public dialogRef: MatDialogRef<WhoTileDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      tile: any,
      template: any
    }
  ) { }

  ngOnInit(): void {}

  /*  Once the template is ready, inject the settings component linked to the widget type passed as a parameter.
  */
  ngAfterViewInit(): void {
    const factory = this.componentFactoryResolver.resolveComponentFactory(this.data.template);
    const componentRef = this.settingsContainer.createComponent(factory);
    componentRef.instance.tile = this.data.tile;
    componentRef.instance.change.subscribe(e => { this.tileForm = e; });
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
