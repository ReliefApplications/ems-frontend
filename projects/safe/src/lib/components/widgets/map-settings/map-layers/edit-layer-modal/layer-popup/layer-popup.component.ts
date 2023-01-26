import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

/** Component to edit the Layer Popup component */
@Component({
  selector: 'safe-layer-popup',
  templateUrl: './layer-popup.component.html',
  styleUrls: ['./layer-popup.component.scss'],
})
export class SafeLayerPopupComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup({});
  @Output() formEvent = new EventEmitter<FormGroup>();

  /** Creates an instance of SafeLayerPopupComponent. */
  constructor() {}

  /**
   * To submits the layer form changes to the parent component
   */
  ngOnInit(): void {
    // When the popup form and design is finished and ready to be implemented:
    // Uncomment the form declaration and uncomment the subscribe .
    this.form = new FormGroup({
      enable: new FormControl(false),
      title: new FormControl(''),
    });
    // this.form?.valueChanges.subscribe((value) => {
    //   if (value) {
    //     this.formEvent.next(this.form);
    //   }
    // });
  }
}
