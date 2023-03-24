import { Component, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

/**
 *
 */
@Component({
  selector: 'safe-series-settings',
  templateUrl: './series-settings.component.html',
  styleUrls: ['./series-settings.component.css'],
})
export class SafeSeriesSettingsComponent implements OnChanges, OnInit {
  @Input() formGroup!: UntypedFormGroup;
  private fb: UntypedFormBuilder;
  
  constructor() {
    this.fb = new UntypedFormBuilder();
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
  }

  createSerieForm(value:any){
    return this.fb.group({
      test: ['null']
    })
  }
}
