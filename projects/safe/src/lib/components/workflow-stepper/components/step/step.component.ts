import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONTENT_TYPES, IContentType } from '../../../../models/page.model';
import { Step } from '../../../../models/step.model';

@Component({
  selector: 'safe-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
})
export class SafeStepComponent implements OnInit {
  @Input() step!: Step;
  @Input() active = false;
  @Input() canUpdate = false;
  @Output() delete = new EventEmitter();
  @Output() duplicate = new EventEmitter();

  get type(): IContentType | undefined {
    return CONTENT_TYPES.find((x) => x.name === this.step.type);
  }

  constructor() {}

  ngOnInit(): void {}

  /**
   * Emits delete event.
   *
   * @param e click event.
   */
  public onDelete(e: any): void {
    e.stopPropagation();
    this.delete.emit();
  }
}
