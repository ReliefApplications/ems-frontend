import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { CHART_TYPES } from '../constants';

@Component({
  selector: 'safe-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  public type: any;
  public types = CHART_TYPES;

  /** @returns the aggregation form */
  public get aggregationForm(): FormGroup {
    return (
      ((this.formGroup?.controls.chart as FormGroup).controls
        .aggregation as FormGroup) || null
    );
  }

  private reload = new Subject<boolean>();
  public reload$ = this.reload.asObservable();

  constructor() {}

  ngOnInit(): void {
    this.type = this.types.find(
      (x) => x.name === this.formGroup.get('chart.type')?.value
    );
    this.formGroup.get('chart.type')?.valueChanges.subscribe((value) => {
      this.type = this.types.find((x) => x.name === value);
      this.reload.next(true);
    });
  }
}
