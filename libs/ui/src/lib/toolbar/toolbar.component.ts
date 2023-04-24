import { Component, Input } from '@angular/core';
import { Variant } from '../shared/variant.enum';

@Component({
  selector: 'ui-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Input() color = '';
  @Input() toolbarVariant!: Variant;

  toolbarVariants = Variant;
}
