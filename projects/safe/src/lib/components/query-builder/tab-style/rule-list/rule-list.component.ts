import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'safe-rule-list',
  templateUrl: './rule-list.component.html',
  styleUrls: ['./rule-list.component.scss'],
})
export class SafeRuleListComponent implements OnInit {
  @Input() stylesList: any[] = [];

  @Output() editRule = new EventEmitter<any>();
  @Output() deleteRule = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  onEditStyle(index: any) {
    this.editRule.emit(index);
  }

  onDeleteStyle(index: any) {
    this.deleteRule.emit(index);
  }
}
