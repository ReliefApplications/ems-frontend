import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ComponentFactory,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss'],
})
export class SafeRuleComponent implements OnInit {
  @Input() factory?: ComponentFactory<any>;
  @Input() availableFields: any[] = [];
  @Input() stylesList: any[] = [];
  @Input() styleIndex?: any | null = null;
  @Input() styleForm?: FormGroup | null = null;
  @Input() fields: any[] = [];
  @Input() scalarFields: any[] = [];
  @Input() settings: any;

  public selectedColumns: boolean = false;
  
  @Output() closeRule = new EventEmitter<any>();
  @Output() changeApplyTo = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  onCloseField() {
    this.styleForm = null;
    this.closeRule.emit();
  }

  onStyleAppliedTo(value: boolean) {
    this.selectedColumns = value;
    this.changeApplyTo.emit(value);
  }
}
