import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'safe-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss']
})
export class SafeSummaryCardComponent implements OnInit {
  @Input() header = true;
  @Input() public title = '';
  @Input() public text = '';

  constructor() { }

  ngOnInit(): void {
  }

}
