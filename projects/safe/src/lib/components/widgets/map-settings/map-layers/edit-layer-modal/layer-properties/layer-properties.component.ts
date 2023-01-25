import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';

/** Component to edit the Layer Properties */
@Component({
  selector: 'safe-layer-properties',
  templateUrl: './layer-properties.component.html',
  styleUrls: ['./layer-properties.component.scss'],
})
export class SafeLayerPropertiesComponent implements OnInit {
  @Input() currentZoom = 2;
  @Input() form: FormGroup = new FormGroup({});
  @Output() formEvent = new EventEmitter<FormGroup>();

  public visibilityRangeOptions: Options = {
    floor: 2,
    ceil: 18,
    step: 1,
    showSelectionBar: true,
  };

  /** Creates an instance of SafeLayerPropertiesComponent. */
  constructor() {}

  /**
   * Submits the layer form changes to the parent component
   */
  ngOnInit(): void {
    this.form?.valueChanges.subscribe((value) => {
      if (value) {
        this.formEvent.next(this.form);
      }
    });
  }
}
