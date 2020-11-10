import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'who-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WhoWidgetComponent implements OnInit {

  @Input() widget: any;

  constructor() { }

  ngOnInit(): void {
  }

}
