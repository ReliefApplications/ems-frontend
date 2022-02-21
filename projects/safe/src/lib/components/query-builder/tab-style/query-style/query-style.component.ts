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
  selector: 'safe-query-style',
  templateUrl: './query-style.component.html',
  styleUrls: ['./query-style.component.scss'],
})
export class SafeQueryStyleComponent implements OnInit {
  @Input() factory?: ComponentFactory<any>;
  @Input() availableFields: any[] = [];
  @Input() styleIndex?: any | null = null;
  @Input() form!: FormGroup;
  @Input() fields: any[] = [];
  @Input() scalarFields: any[] = [];

  public selectedColumns = false;

  @Output() closeEdition = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  onStyleAppliedTo(value: boolean) {
    this.selectedColumns = value;
  }
}
