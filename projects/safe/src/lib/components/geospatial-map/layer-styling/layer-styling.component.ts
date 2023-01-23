import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-layer-styling',
  templateUrl: './layer-styling.component.html',
  styleUrls: ['./layer-styling.component.scss']
})
export class SafeLayerStylingComponent implements OnInit {

  private _selectedLayer: any;

  @Input() set selectedLayer(value: any) {
    this._selectedLayer = value;
    this.updateForm();
  }
  get selectedLayer(): any {
      return this._selectedLayer;
  }

  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();

  private formSubscription: any;

  public styleForm: any;

  constructor() { }

  ngOnInit(): void {
    this.updateForm();
  }

  private updateForm() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe()
    }
    this.styleForm = this.getPolygonStyleForm();
    this.styleForm.patchValue(this.selectedLayer.options);
    this.styleForm.valueChanges.subscribe((value: any) => {
      this.edit.emit(value)
    })
  }

  private getPolygonStyleForm(): FormGroup {
    return new FormGroup({
      color: new FormControl('#3388ff'),
      weight: new FormControl(3),
      opacity: new FormControl(1.0),
      fill: new FormControl(true),
      fillColor: new FormControl('#3388ff'),
      fillOpacity: new FormControl(0.2)
    })
  }

}
