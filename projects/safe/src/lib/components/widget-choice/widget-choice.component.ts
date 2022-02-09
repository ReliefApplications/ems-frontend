import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IWidgetType } from '../../models/dashboard.model';

@Component({
  selector: 'safe-widget-choice',
  templateUrl: './widget-choice.component.html',
  styleUrls: ['./widget-choice.component.scss'],
})
export class SafeWidgetChoiceComponent implements OnInit {
  public hovered = '';

  @Input() floating = false;

  @Input() widgetTypes?: IWidgetType[];

  @Output() add: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  public onSelect(e: any): void {
    this.add.emit(e);
  }
}
