import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../ui/modal/modal.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeIconModule } from '../ui/icon/icon.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SafeButtonModule } from '../ui/button/button.module';
import { CustomStyleComponent } from './custom-style/custom-style.component';

@Component({
  selector: 'safe-application-settings',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SafeModalModule,
    DragDropModule,
    SafeIconModule,
    MatTabsModule,
    MatTooltipModule,
    SafeButtonModule,
    CustomStyleComponent,
  ],
  templateUrl: './application-settings.component.html',
  styleUrls: ['./application-settings.component.scss'],
})

/** Component with custom styling options settings from the application */
export class ApplicationSettingsComponent {
  @Output() style = new EventEmitter<string>();

  /**
   * To update the css style.
   *
   * @param {*} event new css string style value
   */
  public onUpdateStyle(event: any): void {
    this.style.emit(event.style);
  }
}
