import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChipModule } from '@oort-front/ui';

/**
 * Template option type with core chip for when template is core.
 */
@Component({
  selector: 'app-template-options',
  standalone: true,
  imports: [CommonModule, ChipModule, TranslateModule],
  template: `<div class="flex gap-2 items-center">
    <div uiChipList *ngIf="template?.core">
      <ui-chip class="!rounded-lg" variant="grey">
        {{ 'models.form.core' | translate }}
      </ui-chip>
    </div>
    {{ template?.name }}
  </div>`,
})
export class TemplateOptionsComponent {
  /** Form template to display the selected one among the template options */
  @Input() template!: any;
}
