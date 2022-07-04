import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'safe-data-source-tab',
  templateUrl: './data-source-tab.component.html',
  styleUrls: ['./data-source-tab.component.scss']
})
export class SafeDataSourceTabComponent implements OnInit {

  @Input() form: any;

  private reload = new Subject<boolean>();
  public reload$ = this.reload.asObservable();

  /** @returns the aggregation form */
  public get aggregationForm(): FormGroup {
    return ((this.form?.controls.aggregation as FormGroup) || null);
  }

  constructor() { }

  ngOnInit(): void {
    console.log(this.aggregationForm);
  }

  radioChange(event: any) {}

}
