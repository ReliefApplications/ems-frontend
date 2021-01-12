import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'who-tab-sort',
  templateUrl: './tab-sort.component.html',
  styleUrls: ['./tab-sort.component.scss']
})
export class WhoTabSortComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() fields: any[];

  constructor() { }

  ngOnInit(): void {
  }

}
