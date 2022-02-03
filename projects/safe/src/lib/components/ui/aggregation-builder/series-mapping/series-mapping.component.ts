import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'safe-series-mapping',
  templateUrl: './series-mapping.component.html',
  styleUrls: ['./series-mapping.component.scss'],
})
export class SafeSeriesMappingComponent implements OnInit {
  // === DATA ===
  @Input() fields$!: Observable<any[]>;
  // === REACTIVE FORM ===
  @Input() mappingForm!: AbstractControl;
  constructor() {}

  ngOnInit(): void {}

  get mappingGroup() {
    return this.mappingForm as FormGroup;
  }
}
