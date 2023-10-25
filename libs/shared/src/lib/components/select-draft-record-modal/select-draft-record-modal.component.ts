import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TabsModule,
  DialogModule,
  ButtonModule,
  TooltipModule,
  SelectMenuModule,
  FormWrapperModule,
  IconModule,
} from '@oort-front/ui';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    DialogModule,
    IconModule,
    ButtonModule,
    TooltipModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
  selector: 'shared-select-draft-record-modal',
  templateUrl: './select-draft-record-modal.component.html',
  styleUrls: ['./select-draft-record-modal.component.scss'],
})
export class SelectDraftRecordModalComponent {}
