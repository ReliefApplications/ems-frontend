import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QueryRef } from 'apollo-angular';
import { Subject } from 'rxjs';
import { CHART_TYPES } from '../constants';
import { GetResourcesQueryResponse } from '../graphql/queries';

/**
 * Main tab of chart settings modal.
 */
@Component({
  selector: 'safe-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() type: any;
  public types = CHART_TYPES;
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;

  /** @returns the aggregation form */
  public get aggregationForm(): FormGroup {
    return (
      ((this.formGroup?.controls.chart as FormGroup).controls
        .aggregation as FormGroup) || null
    );
  }

  private reload = new Subject<boolean>();
  public reload$ = this.reload.asObservable();

  ngOnInit(): void {
    this.formGroup.get('chart.type')?.valueChanges.subscribe((value) => {
      this.reload.next(true);
    });
  }
}
