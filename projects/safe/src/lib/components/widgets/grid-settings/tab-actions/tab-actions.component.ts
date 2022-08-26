import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-tab-actions',
  templateUrl: './tab-actions.component.html',
  styleUrls: ['./tab-actions.component.scss'],
})
export class TabActionsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  constructor() {}

  ngOnInit(): void {}
}
