import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsRoutingModule } from './channels-routing.module';
import { ChannelsComponent } from './channels.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import {
  SafeButtonModule,
  SafeModalModule,
  SafeDividerModule,
} from '@safe/builder';
import { AddChannelModalComponent } from './components/add-channel-modal/add-channel-modal.component';
import { EditChannelModalComponent } from './components/edit-channel-modal/edit-channel-modal.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Channels page module.
 */
@NgModule({
  declarations: [
    ChannelsComponent,
    AddChannelModalComponent,
    EditChannelModalComponent,
  ],
  imports: [
    CommonModule,
    ChannelsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSelectModule,
    SafeDividerModule,
    SafeButtonModule,
    MatButtonModule,
    TranslateModule,
    SafeModalModule,
  ],
})
export class ChannelsModule {}
