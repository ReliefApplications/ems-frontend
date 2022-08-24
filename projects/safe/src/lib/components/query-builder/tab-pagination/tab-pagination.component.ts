import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-tab-pagination',
  templateUrl: './tab-pagination.component.html',
  styleUrls: ['./tab-pagination.component.scss'],
})
export class SafeTabPaginationComponent implements OnInit {
  @Input() form!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    console.log(this.form);
  }
}
