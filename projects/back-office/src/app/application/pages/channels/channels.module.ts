import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelsRoutingModule } from './channels-routing.module';
import { ChannelsComponent } from './channels.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import {
  SafeConfirmModalModule,
  SafeButtonModule,
  SafeModalModule,
} from '@safe/builder';
import { AddChannelComponent } from './components/add-channel/add-channel.component';
import { EditChannelComponent } from './components/edit-channel/edit-channel.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Channels page module.
 */
@NgModule({
  declarations: [ChannelsComponent, AddChannelComponent, EditChannelComponent],
  imports: [
    CommonModule,
    ChannelsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSelectModule,
    SafeConfirmModalModule,
    MatDividerModule,
    SafeButtonModule,
    MatButtonModule,
    TranslateModule,
    SafeModalModule,
  ],
})
export class ChannelsModule {}
