import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-tab-filter',
  templateUrl: './tab-filter.component.html',
  styleUrls: ['./tab-filter.component.scss']
})
export class SafeTabFilterComponent implements OnInit {

  @Input() form: FormGroup = new FormGroup({});
  @Input() filters: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
