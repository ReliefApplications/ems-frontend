import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeDividerModule } from '../../../../../ui/divider/divider.module';
import { SafeButtonModule } from '../../../../../ui/button/button.module';
import { PopupElement } from '../../../../../../models/layer.model';
import { Fields } from '../../layer-fields/layer-fields.component';
import { SafeMapLayersService } from '../../../../../../services/map/map-layers.service';
import { Observable } from 'rxjs';
import { SafeEditorControlComponent } from '../../../../../editor-control/editor-control.component';
/**
 * Popup fields element component.
 */
@Component({
  selector: 'safe-fields-element',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    SafeDividerModule,
    SafeButtonModule,
    SafeEditorControlComponent,
  ],
  templateUrl: './fields-element.component.html',
  styleUrls: ['./fields-element.component.scss'],
})
export class FieldsElementComponent implements OnInit {
  @Input() fields$!: Observable<Fields[]>;
  @Input() formGroup!: FormGroup;

  public keys: string[] = [];

  ngOnInit(): void {
    // Listen to fields changes
    this.fields$.subscribe((value) => {
      this.keys = value.map((field) => field.name);
    });
  }

  /**
   * Creates an instance of FieldsElementComponent.
   *
   * @param mapLayersService Shared map layer Service.
   */
  constructor(private mapLayersService: SafeMapLayersService) {}

  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param event Event emitted when a layer is reordered
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onListDrop(event: CdkDragDrop<PopupElement[]>) {
    // todo(gis): change type there
    // moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
  }

  /**
   * Remove field from the array
   *
   * @param {number} index item index
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onRemoveField(index: number): void {
    // this.fields = this.fields.splice(index, 1);
  }
}
