import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 *
 */
@Component({
  selector: 'safe-series-settings',
  templateUrl: './series-settings.component.html',
  styleUrls: ['./series-settings.component.css'],
})
export class SafeSeriesSettingsComponent implements OnChanges, OnInit {
  seriesSettings!: FormGroup;

  /**
   *
   * @param fb
   */
  constructor(private fb: FormBuilder) {
    this.seriesSettings = this.fb.group({
      color123: '',
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    console.log('TESTE');
    setTimeout(() => {
      console.log(this.seriesSettings);
    }, 10000);
  }

  /**
   *
   */
  testing() {
    alert('aqui');
    console.log(this.seriesSettings);
  }
}
