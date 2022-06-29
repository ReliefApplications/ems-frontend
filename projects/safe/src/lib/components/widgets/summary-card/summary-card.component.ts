import { Component, Input, OnInit } from '@angular/core';

/**
 * Summary Card Widget component.
 */
@Component({
  selector: 'safe-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SafeSummaryCardComponent implements OnInit {
  @Input() header = true;
  @Input() public title = '';
  @Input() public text = '';

  /**
   * Summary Card Widget component.
   */
  constructor() {}

  ngOnInit(): void {}
}
