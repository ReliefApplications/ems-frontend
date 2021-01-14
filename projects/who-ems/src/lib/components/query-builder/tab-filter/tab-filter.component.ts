import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'who-tab-filter',
  templateUrl: './tab-filter.component.html',
  styleUrls: ['./tab-filter.component.scss']
})
export class WhoTabFilterComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() filters: any[];

  constructor() { }

  ngOnInit(): void {
  }

}
