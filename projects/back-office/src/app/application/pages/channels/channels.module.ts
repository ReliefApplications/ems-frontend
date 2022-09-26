import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsRoutingModule } from './channels-routing.module';
import { ChannelsComponent } from './channels.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import {
  SafeConfirmModalModule,
  SafeButtonModule,
  SafeModalModule,
  SafeDividerModule,
} from '@safe/builder';
import { AddChannelModalComponent } from './components/add-channel-modal/add-channel-modal.component';
import { EditChannelModalComponent } from './components/edit-channel-modal/edit-channel-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
    SafeConfirmModalModule,
    SafeDividerModule,
    SafeButtonModule,
    MatButtonModule,
    TranslateModule,
    SafeModalModule,
  ],
})
export class ChannelsModule {}
