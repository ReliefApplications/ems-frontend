import { Component, OnInit, Input } from '@angular/core';

/**
 *
 */
@Component({
  selector: 'safe-display-tab',
  templateUrl: './display-tab.component.html',
  styleUrls: ['./display-tab.component.scss'],
})
export class SafeDisplayTabComponent implements OnInit {
  @Input() form: any;

  /**
   *
   */
  constructor() {}

  ngOnInit(): void {}
}
