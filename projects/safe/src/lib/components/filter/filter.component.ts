import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Composite filter component.
 */
@Component({
  selector: 'safe-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class SafeFilterComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() fields: any[] = [];

  ngOnInit(): void {}
}
