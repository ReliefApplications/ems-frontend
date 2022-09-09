import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AggregationBuilderService } from '../../../../services/aggregation-builder.service';

@Component({
  selector: 'safe-tab-preview',
  templateUrl: './tab-preview.component.html',
  styleUrls: ['./tab-preview.component.scss'],
})
export class TabPreviewComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  public settings: any;
  public grid: any;

  constructor(private aggregationBuilder: AggregationBuilderService) {}

  ngOnInit(): void {
    console.log('init');
    this.settings = this.formGroup.value;
    this.aggregationBuilder.getPreviewGrid().subscribe((value) => {
      this.grid = value;
    });
  }
}
