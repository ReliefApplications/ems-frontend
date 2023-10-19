import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  SpinnerModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Shared filter for table lists
 * It would add a search control automatically to the parent component form group instance
 * It would remove the added search control from the parent component form group on component destroy
 * Can contain custom key control using the controlKey input property
 */
@Component({
  selector: 'shared-list-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IconModule,
    ButtonModule,
    SpinnerModule,
    FormWrapperModule,
  ],
  templateUrl: './list-filter.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class ListFilterComponent implements OnInit, OnDestroy {
  @Input() controlKey = 'search';
  @Input() loading = false;
  @Input() hasSiblingFilters = false;
  @Output() showFilters = new EventEmitter<boolean>();

  parentFormContainer = inject(ControlContainer);

  /**
   * Get components parent form control
   *
   * @returns {FormGroup} parent component control
   */
  get parentForm() {
    return this.parentFormContainer?.control as FormGroup;
  }

  showSignal = false;

  ngOnInit(): void {
    this.parentForm.addControl(this.controlKey, new FormControl(''));
  }

  /**
   * Show component sibling additional filters if exists
   */
  showSiblingFilters() {
    this.showSignal = !this.showSignal;
    this.showFilters.emit(this.showSignal);
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl(this.controlKey);
  }
}
